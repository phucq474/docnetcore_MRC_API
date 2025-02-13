using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralEntity;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class ChannelController : SpiralBaseController
    {
        private readonly IChannelService _service;
        public ChannelController (ChannelContext context)
        {
            _service = new ChannelService(context);
        }
        [HttpGet("GetList")]
        public ActionResult<List<ChannelEntity>> GetList([FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            List<ChannelEntity> data = _service.GetList(accId.Value);
            return data;
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] int? Id)
        {
            Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, Id));
            return data.Result;
        }
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(AccountId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return Ok(-1);
            } 
            catch(Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
    }
}
