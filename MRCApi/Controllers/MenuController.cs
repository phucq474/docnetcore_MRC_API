using System;
using System.Collections.Generic;
using System.Data;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;


namespace MRCApi.Controllers
{
    public class MenuController : SpiralBaseController
    {
        private IMenuService _menuService;
        private IUserPagesService _userpageService;
        public MenuController(MenuContext menuContext, UserPagesContext userPagesContext)
        {
            _menuService = new MenuService(menuContext);
            _userpageService = new UserPagesService(userPagesContext);
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader]int? position, [FromHeader] int? EmployeeId)
        {
            Task<DataTable> data = Task.Run(() => _menuService.Filter(AccountId, position, EmployeeId));
            return data.Result;
        }
        [HttpPost("Permission")]
        public ActionResult<List<AlertModel>> ActionPermission([FromBody]List<UserPagesEntity> _lst,[FromHeader] int? EmployeeId, [FromHeader] int? Position)
        {
            var lis = new List<AlertModel>();
            try
            {
                string jsonData = JsonConvert.SerializeObject(_lst);
                Task<int> data = Task.Run(() => _userpageService.SetPermission(AccountId, jsonData, EmployeeId, Position));
                if (data.Result > 0)
                    lis.Add(new AlertModel(1, "Successful", null));
                else
                    lis.Add(new AlertModel(-1, "Fail", null));
                return lis;

            }
            catch (Exception ex)
            {
                lis.Add(new AlertModel(-2, "Fail", ex.Message));
            }
           
            return lis;
            
        }
        
        [HttpGet("GetListMenus")]
        public ActionResult<List<MenuEntity>> GetListMenus()
        {
            List<MenuEntity> getparent = _menuService.GetListMenus(AccountId);
            return getparent;
        }
        [HttpGet("GetParentAccountMenu")]
        public ActionResult<DataTable> GetParentAccountMenu()
        {
            Task<DataTable> getparent =  Task.Run(() => _menuService.GetParentAccountMenu(AccountId));
            return getparent.Result;
        }
        [HttpPost("DisableMenu")]
        public ActionResult<AlertModel> DisableMenu([FromHeader] int id)
        {
            try
            {
                int data =  _menuService.DisableMenu(AccountId, id);
                if(data > 0)
                {
                    return (new AlertModel(1, "Successful", null));
                }
                else
                {
                    return (new AlertModel(-1, "Fail", null));
                }
            }
            catch (Exception ex)
            {
                return (new AlertModel(-2, ex.Message, ""));
            }
        }

        [HttpPost("InsertMenu")]
        public ActionResult<AlertModel> InsertMenu([FromBody] string JsonData)
        {
            try
            {
                Task<int> data = Task.Run(() => _menuService.InsertMenu(AccountId, JsonData));
                if (data.Result > 0)
                    return (new AlertModel(1, "Successful", null));
                else
                    return (new AlertModel(-1, "Fail", null));
            }
            catch (Exception ex)
            {
                return (new AlertModel(-2, ex.Message, ""));
            }
        }
        [HttpPost("UpdateMenu")]
        public ActionResult<AlertModel> UpdateMenu([FromBody] string JsonData)
        {
            try
            {
                Task<int> data = Task.Run(() => _menuService.UpdateMenu(AccountId, JsonData));
                if (data.Result > 0)
                    return (new AlertModel(1, "Successful", null));
                else
                    return (new AlertModel(-1, "Fail", null));
            }
            catch(Exception ex)
            {
                return (new AlertModel(-2, ex.Message, ""));
            }
        }

        [HttpGet("GetPermission")]
        public ActionResult<DataTable> GetPermission()
        {
            Task<DataTable> data = Task.Run(() => _menuService.Filter(AccountId, 0, EmployeeId));
            return data.Result;
        }
        [HttpGet("ListMenus")]
        public ActionResult<List<MenuModel>> ListMenus([FromHeader] int? Account, [FromHeader] int? User)
        {
            if (User == 5540 || User == 5812 || User == 7557 || User == 5811 || User == 5810) 
            {
                User = 5880;
            }    
            var data = Task.Run(() => _menuService.GetMenus(Account, User));
            if (data != null)
                return data.Result;
            else return Ok(-1);
        }
        [HttpGet("GetListTopMenus")]
        public ActionResult<DataTable> GetListTopMenus()
        {
            var data = Task.Run(() => _menuService.GetListTopMenus(AccountId, UserId));
            return data.Result;
        }
        [HttpGet("FilterAccountMenu")]
        public ActionResult<DataTable> FilterAccountMenu([FromHeader] int Id)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _menuService.FilterAccountMenu(AccountId, Id));
                return data.Result;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
