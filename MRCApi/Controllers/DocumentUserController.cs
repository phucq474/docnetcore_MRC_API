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
    public class DocumentUserController : SpiralBaseController 
    {
        private readonly IDocumentUserService _service;
        public DocumentUserController(DocumentUserContext context)
        {
            _service = new DocumentUserService(context);
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(UserId, JsonData));
                return data.Result;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("Detail")]
        public ActionResult<DataTable> Detail([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Detail(JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Insert")]
        public ActionResult<ResultInfo> Insert([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(UserId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(1, "Thêm thành công", "");
                }
                return new ResultInfo(0, "Thêm thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Update")]
        public ActionResult<ResultInfo> Update([FromBody] string JsonData)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Update(JsonData));
                if (data.Result > 0)
                {
                    return new ResultInfo(1, "Cập nhật thành công", "");
                }
                return new ResultInfo(0, "Cập nhật thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] int EmployeeId, [FromHeader] string listId)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Delete(EmployeeId, listId));
                if (data.Result > 0)
                {
                    return new ResultInfo(1, "Xóa thành công", "");
                }
                return new ResultInfo(0, "Xóa thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpGet("GetDocument")]
        public ActionResult<DataTable> GetDocument([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDocument(AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
