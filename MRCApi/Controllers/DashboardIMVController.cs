using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralService;
using System.Threading.Tasks;
using System;
using System.Data;

namespace MRCApi.Controllers
{
    public class DashboardIMVController : SpiralBaseController
    {
        public readonly IDashboardIMVService _service;
        public DashboardIMVController(DashboardIMVContext context)
        {
            _service = new DashboardIMVService(context);
        }

        [HttpGet("SellIn/Total")]
        public ActionResult<DataSet> Attendant_Byday([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.SellIn_Total(AccountId, UserId, JsonData));
                if (data.Result.Tables.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
    }
}
