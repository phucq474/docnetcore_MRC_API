using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class ApproachController : SpiralBaseController
    {
        public readonly IApproachService _service;

        private readonly IWebHostEnvironment _hostEnvironment;

        public ApproachController(ApproachContext context, IWebHostEnvironment webHost)
        {
            _service = new ApproachService(context);
            this._hostEnvironment = webHost;
        }

        [HttpPost("Filter")]
        public ActionResult<ResultInfo> Filter([FromBody] string JsonData)
        {
            try
            {
                var data = Task.Run(() => _service.Filter(AccountId, UserId, JsonData));

                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", "", data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No data!", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpPost("GetDetail")]
        public ActionResult<ResultInfo> GetDetail([FromHeader] int Id)
        {
            try
            {
                var data = Task.Run(() => _service.GetDetail(AccountId, Id));

                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Success", "", data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No data!", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpPost("Export")]
        public ActionResult<ResultInfo> Export([FromBody] string JsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Report_Approach_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo file = new FileInfo(fileExport);
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

            try
            {
                using (var dtRaw = Task.Run(() => _service.Export_Rawdata(AccountId, UserId, JsonData)).Result) 
                {
                    using (var package = new ExcelPackage(file))
                    {
                        if (dtRaw.Rows.Count > 0)
                        {
                            var sheet = package.Workbook.Worksheets.Add("RawData");
                            sheet.Cells[3, 1].LoadFromDataTable(dtRaw, true);

                            sheet.Cells[1, 1, 1, 7].Merge = true;
                            sheet.Cells[1, 1].Value = "RawData";
                            sheet.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                            sheet.Cells[1, 1].Style.Font.Size = 18;
                            sheet.Cells[1, 1, 1, 7].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[1, 1, 1, 7].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 7], "#3399FF", true, ExcelHorizontalAlignment.Center);


                            sheet.Cells.AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Row(3).Height = 30;
                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3,13], "#3399FF", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 14, 3, sheet.Dimension.End.Column], "#548235", true, ExcelHorizontalAlignment.Center);
                            sheet.Cells[3, 1, 3, sheet.Dimension.End.Column].Style.Font.Color.SetColor(Color.White);

                            sheet.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Column(6).Width = 42;
                            sheet.Column(7).Width = 50;
                            sheet.Cells[4, sheet.Dimension.End.Column, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Successful", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return (new ResultInfo(500, ex.Message, ex.StackTrace));
            }
        }
    }
}
