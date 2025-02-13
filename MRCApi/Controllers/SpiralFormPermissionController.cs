using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class SpiralFormPermissionController : SpiralBaseController
    {
        private readonly ISpiralFormPermissionService _service;
        public SpiralFormPermissionController(SpiralFormPermissionContext spiralFormPermissionContext)
        {
            _service = new SpiralFormPermissionService(spiralFormPermissionContext);

        }
        [HttpGet("GetList")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData)
        {
            Task<DataTable> data = Task.Run(() => _service.GetList(AccountId, UserId, JsonData));
            return data.Result;
        }
        [HttpGet("GetById")]
        public ActionResult<DataTable> GetById([FromHeader] string JsonData)
        {
            Task<DataTable> data = Task.Run(() => _service.GetById(AccountId, UserId, JsonData));
            return data.Result;
        }
        [HttpPost("Update")]
        public async Task<ResultInfo> Update([FromBody] string JsonData)
        {
            Task<int> data = Task.Run(() => _service.Update(AccountId, UserId, JsonData));
            return new ResultInfo(data.Result, null, null);
        }
    }
}
