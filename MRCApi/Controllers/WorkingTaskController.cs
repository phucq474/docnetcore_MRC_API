using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class WorkingTaskController : SpiralBaseController
    {
        public readonly IWorkingTaskService _service;
        public readonly IWebHostEnvironment _webHost;
        public WorkingTaskController(WorkingTaskContext workingTaskContext, IWebHostEnvironment webHost)
        {
            _service = new WorkingTaskService(workingTaskContext);
            this._webHost = webHost;
        }

        [HttpPost("Filter")]
        public ActionResult<DataSet> Filter([FromBody] string jsonData)
        {
            DataSet data = Task.Run(() => _service.Filter(AccountId, UserId, jsonData)).Result;
            return data;
        }
        [HttpGet("GetTask")]
        public ActionResult<DataTable> GetTask([FromHeader] string json)
        {
            DataTable data = Task.Run(() => _service.GetTask(UserId, json)).Result;
            return data;
        }
        [HttpPost("Save")]
        public ActionResult<ResultInfo> Save([FromBody] string json)
        {
            try
            {
                DataTable data = Task.Run(() => _service.Save(UserId, json)).Result;
                if(data.Rows.Count > 0)
                {
                    if(Convert.ToString(data.Rows[0]["Status"]) == "200")
                    {
                        return new ResultInfo(200, "Thành công", null, data);
                    }
                    else
                    {
                        return new ResultInfo(500, Convert.ToString(data.Rows[0]["Message"]), "");
                    }
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "");
                }
            }
            catch(Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Export")]
        public ActionResult<ResultInfo> Export([FromBody] string json)
        {
            try
            {
                string folder = _webHost.WebRootPath;
                string subfolder = "export/WorkingPlan";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                string fileName = $"Working Task_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);
                FileInfo file = new FileInfo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                using (var pk = new ExcelPackage(file))
                {
                    DataTable data = Task.Run(() => _service.Export(AccountId, UserId, json)).Result;

                    if (data.Rows.Count > 0)
                    {
                        var sheet = pk.Workbook.Worksheets.Add("WorkingTask");

                        sheet.Cells[1, 1].Value = "WORKING TASK";
                        sheet.Cells[1, 1].Style.Font.Size = 20;

                        sheet.Cells[1, 1, 1, 6].Merge = true;
                        sheet.Row(1).Height = 30;
                        sheet.Row(3).Height = 25;
                        sheet.Cells[1, 1, 1, 6].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
                        ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 6], "#E2EFDA", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                        sheet.Cells[1, 1, 1, 6].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        sheet.Cells[1, 1, 1, 6].Style.Border.Bottom.Color.SetColor(Color.Red);

                        sheet.Cells[3, 1].LoadFromDataTable(data, true);

                        for (int c = 1; c <= data.Columns.Count; c++)
                        {
                            string header = Convert.ToString(sheet.Cells[3, c].Value);
                            string[] key = header.Split("_");
                            if (key.Length > 1)
                            {
                                sheet.Column(c).Width = 10;
                                sheet.Cells[3, c].Value = key[1];
                                sheet.Cells[3, c, sheet.Dimension.End.Row, c].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                                if (key[0] == "1")
                                {
                                    ExcelFormats.FormatCell(sheet.Cells[3, c], "#F4B084", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                }
                                else
                                {
                                    ExcelFormats.FormatCell(sheet.Cells[3, c], "#FFD966", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                }
                            }
                            else
                            {
                                sheet.Cells[3, c, sheet.Dimension.End.Row, c].AutoFitColumns(8);
                                ExcelFormats.FormatCell(sheet.Cells[3, c], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            }
                        }
                        ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, data.Columns.Count);
                    }

                    DataSet dataActual = Task.Run(() => _service.Export_Actual_Rawdata(AccountId, UserId, json)).Result;

                    if(dataActual.Tables.Count > 0)
                    {
                        var sheetCoaching = pk.Workbook.Worksheets.Add("Coaching");
                        if (dataActual.Tables[0].Rows.Count > 0)
                        {
                            sheetCoaching.Cells[1, 1].Value = "HUẤN LUYỆN THỰC ĐỊA";
                            sheetCoaching.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                            sheetCoaching.Cells[1, 1].Style.Font.Size = 15;
                            sheetCoaching.Cells[1, 1, 1, 5].Merge = true;
                            ExcelFormats.FormatCell(sheetCoaching.Cells[1, 1, 1, 5], "#305496", true, ExcelHorizontalAlignment.Center);
                            sheetCoaching.Row(1).Height = 30;
                            sheetCoaching.Row(3).Height = 30;

                            sheetCoaching.Cells[3, 1].LoadFromDataTable(dataActual.Tables[0], true);

                            sheetCoaching.Cells[3, 1, sheetCoaching.Dimension.End.Row, sheetCoaching.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.FormatCell(sheetCoaching.Cells[3, 1, 3, sheetCoaching.Dimension.End.Column], "#FFE699", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheetCoaching, 3, 1, sheetCoaching.Dimension.End.Row, sheetCoaching.Dimension.End.Column);
                        }

                        var sheetMarket = pk.Workbook.Worksheets.Add("Market");
                        if (dataActual.Tables[1].Rows.Count > 0)
                        {
                            sheetMarket.Cells[1, 1].Value = "KIỂM TRA THỊ TRƯỜNG";
                            sheetMarket.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                            sheetMarket.Cells[1, 1].Style.Font.Size = 15;
                            sheetMarket.Cells[1, 1, 1, 5].Merge = true;
                            ExcelFormats.FormatCell(sheetMarket.Cells[1, 1, 1, 5], "#00B050", true, ExcelHorizontalAlignment.Center);
                            sheetMarket.Row(1).Height = 30;
                            sheetMarket.Row(3).Height = 30;

                            sheetMarket.Cells[3, 1].LoadFromDataTable(dataActual.Tables[1], true);

                            sheetMarket.Cells[3, 1, sheetMarket.Dimension.End.Row, sheetMarket.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.FormatCell(sheetMarket.Cells[3, 1, 3, sheetMarket.Dimension.End.Column], "#FFE699", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheetMarket, 3, 1, sheetMarket.Dimension.End.Row, sheetMarket.Dimension.End.Column);
                        }

                    }
                    pk.Save();

                    return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));

                }
            }
            catch(Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpGet("GetDetailByEmployee")]
        public ActionResult<DataSet> GetDetailByEmployee([FromHeader] string json)
        {
            DataSet data = Task.Run(() => _service.GetDetailByEmployee(UserId, json)).Result;
            return data;
        }

        #region Coaching
        [HttpPost("Coaching/Filter")]
        public ActionResult<ResultInfo> Coaching_Filter([FromBody] string jsonData)
        {
            DataTable data = Task.Run(() => _service.Coaching_Filter(AccountId, UserId, jsonData)).Result;
            if(data.Rows.Count > 0)
            {
                return new ResultInfo(200, "Thành công", null, data);
            }
            return new ResultInfo(500, "Không có dữ liệu", null );
        }

        [HttpPost("Coaching/Detail")]
        public ActionResult<DataSet> Coaching_Detail([FromBody] string jsonData)
        {
            DataSet data = Task.Run(() => _service.Coaching_Detail(AccountId, UserId, jsonData)).Result;
            return data;
        }

        [HttpPost("Coaching/Export")]
        public ActionResult<ResultInfo> Coaching_Export ([FromBody] string jsonData)
        {
            return ReportExtends.CoachingReport(AccountId, UserId, jsonData, _service, _webHost, Request.Host, Request.Scheme);
        }

        [HttpGet("Coaching/GetList")]
        public ActionResult<ResultInfo> Coaching_GetList()
        {
            DataTable data = Task.Run(() => _service.Coaching_GetList(AccountId)).Result;
            if (data.Rows.Count > 0)
            {
                return new ResultInfo(200, "Thành công", null, data);
            }
            return new ResultInfo(500, "Không có dữ liệu", null);
        }

        [HttpPost("Coaching/ByEmployee/Filter")]
        public ActionResult<ResultInfo> Coaching_ByEmployee_Filter([FromBody] string JsonData)
        {
            try
            {
                DataTable data = Task.Run(() => _service.Coaching_ByEmployee_Filter(AccountId, UserId, JsonData)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", null, data);
                }
                return new ResultInfo(500, "Không có dữ liệu", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
          
        }
        [HttpPost("Coaching/ByEmployee/Detail")]
        public ActionResult<ResultInfo> Coaching_ByEmployee_Detail([FromBody] string JsonData)
        {
            try
            {
                DataTable data = Task.Run(() => _service.Coaching_ByEmployee_Detail(AccountId, UserId, JsonData)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", null, data);
                }
                return new ResultInfo(500, "Không có dữ liệu", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }

        }
        #endregion

    }
}
