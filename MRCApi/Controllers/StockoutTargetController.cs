using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class StockoutTargetController : SpiralBaseController
    {
        private readonly IStockoutTargetService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public StockoutTargetController(StockoutTargetContext context, IWebHostEnvironment webHost)
        {
            _service = new StockoutTargetService(context);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(accId ?? AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("Detail")]
        public ActionResult<DataTable> Detail([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Detail(accId ?? AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public class JsonModel
        {
            public string listCustomer { get; set; } //'[1,2,3,4]'
            public string listProduct { get; set; } //'[1,2,3,4]'
            public string fromDate { get; set; }
            public string toDate { get; set; }
        }

        [HttpPost("Insert")]
        public ActionResult<ResultInfo> Insert([FromBody] JsonModel model, [FromHeader] int? accId)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Insert(accId ?? AccountId, UserId, model.listCustomer, model.listProduct, model.fromDate, model.toDate));
                if (data.Result > 0)
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
        public ActionResult<ResultInfo> Update([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Update(accId ?? AccountId, JsonData));
                if (data.Result > 0)
                {
                    return new ResultInfo(1, "Đã Sửa thành công", "");
                }
                return new ResultInfo(0, "Đã Sửa thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromBody] string JsonData)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Delete(JsonData));
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

        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/StockOut";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Danh sách Tồn kho _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_StockoutTarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.Export(accId ?? AccountId, JsonData)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["DS Tồn kho"];

                            sheet.Cells[3, 1].LoadFromDataTable(data, true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 7], "#9BC2E6", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 8, 3, data.Columns.Count], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 1, data.Rows.Count + 3, data.Columns.Count);
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        pk.Save();
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }
    }
}
