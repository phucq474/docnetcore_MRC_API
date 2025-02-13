using MRCApi.Extentions;
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
    public class MobileMenuController : SpiralBaseController
    {
        public readonly IMobileMenuService _service;
        public MobileMenuController(MobileMenuContext context)
        {
            _service = new MobileMenuService(context);
        }

        [HttpGet("GetList")]
        public ActionResult<ResultInfo> GetList()
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetList());
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get list successfully!", "", data.Result);
                }
                return new ResultInfo(500, "No data!", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpGet("GetListMenu")]
        public ActionResult<DataTable> GetListMenu([FromHeader] int? position, [FromHeader] int? accId)
        {
            accId = accId != null ? accId : AccountId;
            DataTable data = _service.GetListMenu(accId.Value, UserId, position).Result;
            return data;
        }
        [HttpPost("Filter")]
        public ActionResult<ResultInfo> Filter([FromBody] string json, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                DataTable data = Task.Run(() => _service.Filter(accId.Value, UserId, json)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", "", data);
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Insert")]
        public ActionResult<ResultInfo> Insert([FromBody] string json, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                DataTable data = Task.Run(() => _service.Insert(accId.Value, UserId, json)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", "", data);
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Update")]
        public ActionResult<ResultInfo> Update([FromBody] string json, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                DataTable data = Task.Run(() => _service.Update(accId.Value, UserId, json)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", "", data);
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] int id, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                int data = Task.Run(() => _service.Delete(accId.Value, UserId, id)).Result;
                if (data > 0)
                {
                    return new ResultInfo(200, "Thành công", "");
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
    }
}
