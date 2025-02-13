using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;

namespace SpiralService
{


    public interface IUserService
    {
        UsersModel Authenticate(int AccountId, string username, string password);
        IEnumerable<UsersEntity> GetAll(int AccountId);
        UsersEntity GetById(int id);
        UsersEntity GetByUserName(int AccountId, string UserName);
        Task<int> UserSave(int AccountId, string EmployeeCode, string Username, string Password, string Type);
    }
    public class UserService : IUserService
    {
        private readonly UserContext _context;
        private readonly AppSettings _appSettings;

        public UserService(IOptions<AppSettings> appSettings, UserContext context)
        {
            _context = context;
            _appSettings = appSettings.Value;
        }

        public UsersModel Authenticate(int AccountId, string username, string password)
        {
            string passsys = Helper.Encrypt(password, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            //string passa = Helper.Decrypt("wwNQwM5eHzVeyLxa4Wmiig==", string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            var user = _context.GetLogin(AccountId, username, passsys, password);
            // return null if user not found
            if (user == null)
                return null;
            UsersModel login = new UsersModel();
            login.AccountId = user.AccountId;
            login.Id = user.EmployeeId;
            login.ParentId = user.ParentId;
            login.FirstName = user.FirstName;
            login.LastName = user.LastName;
            login.FullName = user.FullName;
            login.Username = user.Username;
            login.EmployeeCode = user.EmployeeCode;
            login.PositionId = user.PositionId;
            login.AccountId = user.AccountId;
            login.AccountName = user.AccountName;
            login.Role = user.GroupPosition;
            login.ExpriedDate = Int32.Parse(DateTime.Now.AddDays(7).ToString("yyyyMMdd"));
            login.IsAdmin = user.IsAdmin;
            // authentication successful so generate jwt token
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.PrimarySid, login.AccountId.ToString()),
                    new Claim(ClaimTypes.Sid, login.Id.ToString()),
                    new Claim(ClaimTypes.Name, login.FullName),
                    new Claim(ClaimTypes.PrimaryGroupSid, login.PositionId.ToString()),
                    new Claim(ClaimTypes.Role, login.Role),
                    new Claim(ClaimTypes.Spn, login.AccountName),
                    new Claim("IsAdmin", Convert.ToString(login.IsAdmin))
                }),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.Aes128CbcHmacSha256)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            login.Token = tokenHandler.WriteToken(token);
            // remove password before returning
            login.Password = null;
            return login;
        }

        public IEnumerable<UsersEntity> GetAll(int AccountId)
        {
            return _context.Users.Where(u => u.AccountId == AccountId).ToList();
        }

        public UsersEntity GetById(int id)
        {
            return _context.Users.Where(u => u.EmployeeId == id).FirstOrDefault();
        }
        public UsersEntity GetByUserName(int AccountId, string UserName)
        {
            var user=from u in _context.Users
                     where u.Username==UserName && u.AccountId==AccountId
                     select new UsersEntity
                     {
                         AccountId = u.AccountId,
                         EmployeeId = u.EmployeeId,
                         Username = u.Username,
                         Employee = u.Employee
                     };
            return user.FirstOrDefault();   
        }
        public async Task<int> UserSave(int AccountId, string EmployeeCode, string Username, string Password, string Type)
        {
            Password = Helper.Encrypt(Password, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            return await _context.UserSave(AccountId, EmployeeCode, Username, Password, Type);
        }
    }
}

