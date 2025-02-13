using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    [Authorize]
    [ApiController]
    [Route("[controller]")]
    public class SpiralBaseController : ControllerBase
    {
        public string AccountName
        {
            get
            {
                return Convert.ToString(User.FindFirst(ClaimTypes.Spn).Value);
            }
        }
        public bool IsAdmin
        {
            get
            {
                return Convert.ToBoolean(User.FindFirst("IsAdmin").Value);
            }
        }
        public int AccountId
        {
            get
            {
                return Convert.ToInt32(User.FindFirst(ClaimTypes.PrimarySid).Value);
            }
        }
        public int EmployeeId
        {
            get
            {
                return Convert.ToInt32(User.FindFirst(ClaimTypes.Sid).Value);
            }
        }
        public int UserId
        {
            get
            {
                return Convert.ToInt32(User.FindFirst(ClaimTypes.Sid).Value);
            }
        }
        public int PositionId
        {
            get
            {
                return Convert.ToInt32(User.FindFirst(ClaimTypes.PrimaryGroupSid).Value);
            }
        }
        public string EmployeeName
        {
            get
            {
                return User.FindFirst(ClaimTypes.Name).Value;
            }
        }
    }
}
