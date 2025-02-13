using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using MRCApi.Authorize;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;
        private IAccountService _accountService;
        private IMenuService _menuService;
        private ILogsService _logsService;
        private IEmployeeService _employeeSerivce;
        public UsersController(IEmployeeService employee, IUserService userService, IAccountService accountService, IMenuService menuService, ILogsService logsService)
        {
            this._userService = userService;
            this._accountService = accountService;
            this._menuService = menuService;
            this._logsService = logsService;
            this._employeeSerivce = employee;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public IActionResult Login([FromBody] UsersModel userParam)
        {
            try
            {
                var domain = HttpContext.Request.Host.Value;
                var Account = _accountService.GetByDomain(domain);
                var user = _userService.Authenticate(Account.AccountId, userParam.Username, userParam.Password);
                if (user == null)
                    return BadRequest(new UsersModel { Id = 0, Error = "Username or password is incorrect" });
                // Logs Login
                Task<int> logs = Task.Run(() => _logsService.Write(new LogsEntity("LOG IN", "Web", DateTime.Now, user.Id, 0)));
                //Get Menu
                var menus = _menuService.GetListTopMenus(user.AccountId, user.Id).Result;
                //if(menus == null)
                //{
                //    Console.WriteLine("Error",menus);
                //}    
                user.MenuList = menus.Rows.Count > 0 ? JsonConvert.SerializeObject(menus) : null;
                //GET LANG 
                DataTable dtLang = Task.Run(() => _accountService.GetLang(user.AccountId)).Result;
                dtLang.TableName = "Langue";
                user.LangueList = JsonConvert.SerializeObject(dtLang);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        [AllowAnonymous]
        [HttpGet("password")]
        public ActionResult SendPass([FromHeader] string Email, [FromHeader] string Username)
        {
            var domain = HttpContext.Request.Host.Value;
            var Account = _accountService.GetByDomain(domain);
            var employee = _employeeSerivce.FindEmplyeeByEmail(Account.AccountId, Email, Username);
            if (employee != null && employee.Email != null)
            {
                string password = "";
                int sended = EmailExtends.SendMailResetPass(domain, employee.Email, ref password);
                //if (sended == 1)
                //{
                sended = Task.Run(() => _employeeSerivce.ResetPassWord(employee.AccountId, employee.Id, password)).Result;
                //}
                return Ok("Yêu cầu cấp lại mật khẩu đã được gửi tới email");
            }
            else
                return Ok("Không tìm thấy email đăng kí");
        }
        [Authorize(Roles = Role.Admin)]
        [HttpGet("list")]
        public IActionResult GetAll()
        {
            var domain = HttpContext.Request.Host.Value;
            var Account = _accountService.GetByDomain(domain);
            var users = _userService.GetAll(Account.AccountId);
            return Ok(users);
        }
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var user = _userService.GetById(id);

            if (user == null)
            {
                return NotFound();
            }

            var currentUserId = int.Parse(User.Identity.Name);
            if (id != currentUserId && !User.IsInRole(Role.Admin))
            {
                return Forbid();
            }

            return Ok(user);
        }
        [HttpGet("GetUserByUserName")]
        [Authorize]
        public ActionResult<int> User_GetByUserName([FromHeader] string UserName)
        {
            try
            {
                var domain = HttpContext.Request.Host.Value;
                var Account = _accountService.GetByDomain(domain);
                Task<UsersEntity> data = Task.Run(() => _userService.GetByUserName(Account.AccountId, UserName));
                if (data.Result != null)
                    return data.Result.EmployeeId;
                return 0;
            }
            catch (Exception ex)
            {
                return -1;
            }
        }
        [HttpPost("UserSave")]
        [Authorize]
        public ActionResult<int> UserSave([FromBody] UsersModel para)
        {
            int result = 0;
            try
            {

                var domain = HttpContext.Request.Host.Value;
                var Account = _accountService.GetByDomain(domain);
                Task<int> data = Task.Run(() => _userService.UserSave(Account.AccountId, para.EmployeeCode, para.Username, para.Password, para.Type));
                result = data.Result;
                return result;
            }
            catch (Exception ex)
            {
            }
            return 0;
        }
        #region sync data

        private class UserMRC
        {
            public string EmployeeCode { get; set; }
            public string EmployeeName { get; set; }
            public string UserName { get; set; }
            public string Token { get; set; }
            public string Expried { get; set; }
            public string Error { get; set; }
        }


        [AllowAnonymous]
        [HttpGet("getToken")]
        public IActionResult GetToken([FromHeader] string UserName, [FromHeader] string PassWord)
        {
            string Expried = Convert.ToString(DateTime.Now.AddDays(7));
            try
            {
                var user = _userService.Authenticate(1, UserName, PassWord);
                if (user == null)
                    return BadRequest(new UserMRC {  Error = "UserName or Password is incorrect" });
                else
                    return Ok(new UserMRC { EmployeeCode = user.EmployeeCode, EmployeeName = user.FullName, UserName=user.Username, Token = user.Token,Expried= Expried });
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }

        }

        #endregion
    }
}