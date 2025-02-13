using System;
using Microsoft.AspNetCore.Mvc;
using SpiralService;
using SpiralEntity;
using MRCApi.Extentions;
using Microsoft.AspNetCore.Hosting;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace MRCApi.Controllers
{
	public class AccountController : SpiralBaseController
    {
		private IWebHostEnvironment _host;
		private readonly IAccountService _service;
		public AccountController(IAccountService service,IWebHostEnvironment host)
		{
			_service = service;
			_host = host;
		}
		[HttpGet("getlist")]
		public ActionResult<List<AccountsEntity>> GetListAccount()
		{
			try
			{
				var list = Task.Run(() => _service.GetListAccount(AccountId, EmployeeId)).Result;
				if(list.Count > 0)
				{
					return list;
				}
				else
				{
					return null;
				}
			}
			catch (Exception ex)
			{
				return BadRequest(ex.Message);
			}
        }
        [HttpGet("setClaim")]
        public ActionResult<List<AccountsEntity>> SetClaim()
        {
            try
            {
                var list = Task.Run(() => _service.GetListAccount(AccountId, EmployeeId)).Result;
                if (list.Count > 0)
                {
                    return list;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}

