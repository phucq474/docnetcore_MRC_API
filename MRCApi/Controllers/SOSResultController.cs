using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System.IO;
using System.Threading.Tasks;
using System;
using System.Data;

namespace MRCApi.Controllers
{
    public class SOSResultController : SpiralBaseController
    {
        private readonly ISOSResultService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SOSResultController(SOSResultContext context, IWebHostEnvironment webHost)
        {
            _service = new SOSResultService(context);
            this._webHostEnvironment = webHost;
        }

        [HttpGet("GetList")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetList( accId ?? AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
                string folder = _webHostEnvironment.WebRootPath;
                string subfolder = "export/SOS";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                FileInfo file = null;
                string fileName = $"SOS_Result_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);
                file = new FileInfo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataSet dt = await Task.Run(() => _service.Export(accId ?? AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets.Add("Raw Data");
                        if (sheet != null)
                        {
                            if (dt.Tables[0].Rows.Count > 0)
                            {
                                //load data
                                sheet.Row(4).Height = 30;
                                sheet.Row(1).Height = 30;
                                sheet.Cells[4, 1].LoadFromDataTable(dt.Tables[0], true);
                                sheet.Cells[1, 1].Value = "SOS REPORT";
                                sheet.Cells[1, 1, 1, dt.Tables[0].Columns.Count].Merge = true;
                                ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, dt.Tables[0].Columns.Count], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                sheet.Cells[2, 1].Value = "Từ ngày: ";
                                sheet.Cells[2, 2].Value = dataJson.fromdate;
                                sheet.Cells[2, 3].Value = "Tới ngày: ";
                                sheet.Cells[2, 4].Value = dataJson.todate;
                                ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, dt.Tables[0].Columns.Count], "#5B9BD5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 4, 1, dt.Tables[0].Rows.Count + 4, dt.Tables[0].Columns.Count);
                                sheet.Cells.AutoFitColumns();
                            }
                            else
                                return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        if (dataJson.accountName == "MARICO MT")
                        {
                            if (dt.Tables[1].Rows.Count > 0)
                            {
                                var sheet2 = package.Workbook.Worksheets.Add("STORE NON VISIBILITY");
                                sheet2.Cells[2, 2].LoadFromDataTable(dt.Tables[1], true);
                                ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                                sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                                sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            }
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Xuất báo cáo thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception err)
            {
                return (new ResultInfo(500, err.Message, null));
            }
        }

        [HttpGet("GetDetail")]
        public ActionResult<DataTable> GetDetail([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDetail(JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
