using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class SpiralFormStatisticalController : SpiralBaseController
    {
        private readonly ISpiralFormStatisticalService _service;
        public SpiralFormStatisticalController(SpiralFormStatisticalContext spiralFormStatisticalContext)
        {
            _service = new SpiralFormStatisticalService(spiralFormStatisticalContext);

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
        [HttpGet("GetByQuestion")]
        public ActionResult<DataTable> GetByQuestion([FromHeader] string JsonData)
        {
            Task<DataTable> data = Task.Run(() => _service.GetByQuestion(AccountId, UserId, JsonData));
            return data.Result;
        }
    }
}
