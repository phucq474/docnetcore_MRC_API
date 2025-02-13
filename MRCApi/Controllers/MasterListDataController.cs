using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class MasterListDataController : SpiralBaseController
    {
        public readonly IMasterListDataService _service;

        public MasterListDataController(MasterListDataContext _context)
        {
            _service = new MasterListDataService(_context);
        }

        [HttpGet("list")]
        public ActionResult<List<MasterListDataEntity>> GetList([FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                Task<List<MasterListDataEntity>> data = Task.Run(() => _service.GetList(accId.Value));
                return data.Result;
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        [HttpGet("competitor")]
        public async Task<ActionResult> GetCompetitor([FromHeader] int? accId)
        {
            accId = accId != null ? accId.Value : AccountId;
            var data = await _service.GetCompetitor(accId.Value);
            return Ok(data);
        }
        [HttpGet("banks")]
        public ActionResult BankGetList()
        {
            var data = _service.BankGetList();
            return Ok(data);
        }

        [HttpGet("GetFilterMaster")]
        public ActionResult<List<MasterListDataEntity>> GetFilterMaster([FromHeader] string listCode, [FromHeader] string name, [FromHeader] int? accId)
        {
            accId = accId != null ? accId.Value : AccountId;
            Task<List<MasterListDataEntity>> getfilter = Task.Run(() => _service.GetFilterMaster(listCode, name, accId.Value));
            return getfilter.Result;

        }
        // New 
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetListCode")]
        public ActionResult<DataTable> GetListCode([FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                Task<DataTable> data = Task.Run(() => _service.GetListCode(accId.Value));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetName")]
        public ActionResult<DataTable> GetName([FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                Task<DataTable> data = Task.Run(() => _service.GetName(accId.Value));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                Task<DataTable> data = Task.Run(() => _service.Insert(accId.Value, JsonData));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                Task<DataTable> data = Task.Run(() => _service.Update(accId.Value, JsonData));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Delete")]
        public ActionResult<DataTable> Delete([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                Task<DataTable> data = Task.Run(() => _service.Delete(accId.Value, JsonData));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
