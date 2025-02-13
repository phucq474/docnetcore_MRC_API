using System;
using SpiralService;
using SpiralData;
using Microsoft.AspNetCore.Mvc;
using MRCApi.ClientModel;
using System.Data;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class DashboardController: SpiralBaseController
    {
        public readonly IDashboardService _service;
        public DashboardController(DashboardContext context)
        {
            _service = new DashboardService(context);
        }
        [HttpGet("sellout/summary")]
        public ActionResult SellOutSummary([FromHeader]string info)
        {
            try
            {
                var results = _service.SellOutSummary(AccountId, info, EmployeeId).Result;
                return Ok(results);
            }catch(Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        [HttpGet("Attendant/nationwide")]
        public ActionResult<DataTable> Attendant_Byday([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Attendant_Byday(AccountId, UserId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest(-1);
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }

        [HttpGet("Attendant/ByLeader")]
        public ActionResult<DataSet> Attendant_ByLeader([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_ByLeader(AccountId, UserId, JsonData));
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

        [HttpGet("Attendant/byday")]
        public ActionResult<DataSet> Attendant_ToanQuoc([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_ToanQuoc(AccountId, UserId, JsonData));
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

        [HttpGet("Attendant/Area")]
        public ActionResult<DataSet> Attendant_Area([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_Area(AccountId, UserId, JsonData));
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

        [HttpGet("Attendant/ByLeaderV2")]
        public ActionResult<DataSet> Attendant_ByLeaderV2([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_ByLeaderV2(AccountId, UserId, JsonData));
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

        [HttpGet("Status/Area")]
        public ActionResult<DataSet> Status_Area([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Status_Area(AccountId, UserId, JsonData));
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

        [HttpGet("Status/Leader")]
        public ActionResult<DataSet> Status_Leader([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Status_Leader(AccountId, UserId, JsonData));
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

        // DashBoard MT: ST,CHTL

        [HttpGet("Attendant/Visit/ST")]
        public ActionResult<DataSet> Attendant_Visit_ST([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_Visit_ST(AccountId, UserId, JsonData));
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


        [HttpGet("Attendant/Visit/CHTL")]
        public ActionResult<DataSet> Attendant_Visit_CHTL([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_Visit_CHTL(AccountId, UserId, JsonData));
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

        [HttpGet("Attendant/Status/CHTL")]
        public ActionResult<DataSet> Attendant_Status_CHTL([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_Status_CHTL(AccountId, UserId, JsonData));
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

        [HttpGet("Attendant/Status/ST")]
        public ActionResult<DataSet> Attendant_Status_ST([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.Attendant_Status_ST(AccountId, UserId, JsonData));
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

        [HttpGet("OSA")]
        public ActionResult<DataSet> OSA([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.OSA(AccountId, UserId, JsonData));
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

        [HttpGet("SOS")]
        public ActionResult<DataSet> SOS([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.SOS(AccountId, UserId, JsonData));
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

        [HttpGet("SellOut/MT")]
        public ActionResult<DataSet> SellOut_MT([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.SellOut_MT(AccountId, UserId, JsonData));
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

        #region "SellOut alpha"
        [HttpGet("alphasellarea")]
        public ActionResult<DataSet> AlphaSellArea([FromHeader] string JsonData)
        {
            try
            {
                Task<DataSet> data = Task.Run(() => _service.AlphaSellArea(AccountId, EmployeeId, JsonData));
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
        #endregion
    }
}
