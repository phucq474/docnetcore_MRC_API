using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;
using System.Drawing;
namespace MRCApi.Controllers
{
    public class WorkingResultOOLController : SpiralBaseController
    {
        private readonly IWorkingResultOOLService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public WorkingResultOOLController(WorkingResultOOLContext context, IWebHostEnvironment webHost)
        {
            _service = new WorkingResultOOLService(context);
            this._webHostEnvironment = webHost;
        }

        [HttpGet("Filter_OOLResult")]
        public ActionResult<DataTable> FilterResult([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.FilterOOLResult(AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }
        }
        [HttpGet("Export_OOLResult")]
        public async Task<ResultInfo> ExportResult([FromHeader] string JsonData)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
                string folder = _webHostEnvironment.WebRootPath;
                string subFolder = "export/Visibility";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subFolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subFolder));
                }
                FileInfo file = null;
                string fileName = $"Visibility_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subFolder, fileName);
                file = new FileInfo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var dt = await Task.Run(() => _service.ExportOOLResult(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets.Add("Visibility");
                        if (sheet != null)
                        {
                            if (dt.Tables[0].Rows.Count > 0)
                            {
                                // load data
                                sheet.Row(4).Height = 30;
                                sheet.Row(1).Height = 30;
                                sheet.Cells[4, 1].LoadFromDataTable(dt.Tables[0], true);
                                sheet.Cells[1, 1].Value = "OOL RawData";
                                sheet.Cells[1, 1, 1, dt.Tables[0].Columns.Count].Merge = true;
                                ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, dt.Tables[0].Columns.Count], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                sheet.Cells[2, 1].Value = "Từ ngày: ";
                                sheet.Cells[2, 2].Value = dataJson.fromdate;
                                sheet.Cells[2, 3].Value = "Tới ngày: ";
                                sheet.Cells[2, 4].Value = dataJson.todate;
                                ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, dt.Tables[0].Columns.Count], "#5B9BD5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 4, 1, dt.Tables[0].Rows.Count + 4, dt.Tables[0].Columns.Count);
                                //sheet.Cells.AutoFitColumns();
                            }
                            else
                                return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        if (dt.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets.Add("STORE NON VISIBILITY");
                            sheet2.Cells[2, 2].LoadFromDataTable(dt.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }

                        package.Save();
                    }
                    return (new ResultInfo(200, "Xuất báo cáo thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subFolder, fileName)));
                }
            }
            catch (Exception err)
            {
                return new ResultInfo(500, err.Message, null);
            }
        }
        [HttpGet("Detail_OOLResult")]
        public ActionResult<DataTable> DetailOSA([FromHeader] int EmployeeId, [FromHeader] int ShopId, [FromHeader] int WorkDate)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.DetailOOLResult(EmployeeId, ShopId, WorkDate));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
