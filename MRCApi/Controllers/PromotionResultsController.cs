using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity.Models;
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
    public class PromotionResultsController:SpiralBaseController
    {
        private readonly IPromotionResultsService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public PromotionResultsController(PromotionResultsContext context, IWebHostEnvironment hostingEnvironment)
        {
            _service = new PromotionResultsService(context);
            this._hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetList(AccountId,UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpGet("Detail")]
        public ActionResult<DataTable> Detail([FromHeader] int ShopId,[FromHeader] int EmployeeId,[FromHeader] int WorkDate)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDetail(ShopId,EmployeeId,WorkDate));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);

            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/Promotion";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Báo cáo Chương trình khuyến mãi _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_PromotionResult_Rawdata.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.ExportRawdata(UserId, JsonData)))
                {
                    if (data.Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            var sheet = pk.Workbook.Worksheets["Dữ liệu"];

                            sheet.Cells[2, 5].Value = string.Format("Từ ngày: {0} - Đến ngày: {1}", dataJson.fromdate, dataJson.todate);

                            sheet.Cells[3, 1].LoadFromDataTable(data, true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Columns.Count], "#305496", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 3, 1, data.Rows.Count + 3, data.Columns.Count);

                            sheet.Cells[3, 12, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Column(14).Width = 15;
                            sheet.Column(15).Width = 34;
                            sheet.Column(17).Width = 47;
                            pk.Save();
                        }
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
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
