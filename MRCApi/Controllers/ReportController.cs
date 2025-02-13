using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralEntity;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using System.IO;
using SpiralEntity.Models;
using DocumentFormat.OpenXml.Wordprocessing;

namespace MRCApi.Controllers
{
    public class ReportController : SpiralBaseController
    {
        public readonly IReportService _service;
        public readonly ICalendarService _calendarService;
        public readonly IShiftListService _shiftListService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public ReportController(ReportContext context, CalendarContext calendarContext, ShiftListContext shiftListContext, IWebHostEnvironment webHost)
        {
            _service = new ReportService(context);
            _calendarService = new CalendarService(calendarContext);
            _shiftListService = new ShiftListService(shiftListContext);
            this._hostingEnvironment = webHost;
        }
        [HttpGet("GetReportList")]
        public ActionResult<DataTable> GetReportList()
        {
            Task<DataTable> data = Task.Run(() => _service.GetList(AccountId, UserId));
            return data.Result;
        }
        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string ReportType, [FromHeader] string JsonData)
        {
            try
            {
                switch (ReportType)
                {
                    case "Address Survey":
                        return new ResultInfo(0, "Error", "[{File:Results}]");
                    case "OOS Report":
                        return Task.Run(() => ReportExtends.Report_OOS_Fonterra(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "New Customer Report":
                        return Task.Run(() => ReportExtends.Report_New_Customer_Fonterra(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "Sales Report":
                        return Task.Run(() => ReportExtends.Report_Sales_Report_Fonterra(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "Store Cover Report":
                        return Task.Run(() => ReportExtends.Report_Store_Cover_Fonterra(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "OSA Report":
                        return Task.Run(() => ReportExtends.Report_OSA_Fonterra(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "PLANOGRAM (POG) Report":
                        return Task.Run(() => ReportExtends.Report_PLANOGRAM_Fonterra(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "OSA":
                        return Task.Run(() => ReportExtends.Report_OSA_MRC(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "ATTENDANT":
                        return Task.Run(() => ReportExtends.Report_ATTENDANT_MRC(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;
                    case "Promotion":
                        return Task.Run(() => ReportExtends.Report_Promotion(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme)).Result;

                    default:
                        return new ResultInfo(0, "Error", "[{File:Results}]");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(0, ex.Message, ex.StackTrace);
            }

        }

        public class ShopAddress
        {
            public int No { get; set; }
            public string ShopName { get; set; }
            public string Address { get; set; }
            public double Latitude { get; set; }
            public double Longitude { get; set; }
            public string FullAddress { get; set; }
            public string Stress { get; set; }
            public string Town { get; set; }
            public string District { get; set; }
            public string Province { get; set; }
        }
        public class ResultItem
        {
            public List<address_component> address_components { get; set; }
            public string formatted_address { get; set; }
        }
        public class content
        {
            public List<ResultItem> results { get; set; }
            public string status { get; set; }
        }
        public class address_component
        {
            public string long_name { get; set; }
            public string short_name { get; set; }
        }

        [HttpPost("GetAddress")]
        public async Task<ResultInfo> GetAddress([FromBody] string latLong)
        {
            //string latLong = "20.990483900,105.7998145";
            string result = await GetAddressFromLatLong.GetAddress1(latLong);
            var content = JsonConvert.DeserializeObject<content>(result);
            var detail1 = content.results[0];
            return new ResultInfo(0, JsonConvert.SerializeObject(detail1), "");
        }



        [HttpPost("GetAddressFromFile")]
        public async Task<ResultInfo> Import()
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/";
            string fileName = "Data_" + string.Format("{0:yyyyMMdd_HHmmss}", DateTime.Now) + ".xlsx";
            FileInfo fileInfo = new FileInfo(Path.Combine(@"C:\Users\minhn\Desktop\Zalo\Danh sách Revisit HN.xlsx"));
            string fileExport = Path.Combine(folder, subfoler, fileName);

            FileInfo file = fileInfo.CopyTo(fileExport);

            //await file.(memoryStream);
            //var fileBytes = memoryStream.ToArray();
            //memoryStream.Write(fileBytes, 0, fileBytes.Length);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (ExcelPackage package = new ExcelPackage(file))
            {
                if (package.Workbook.Worksheets[0] != null)
                {
                    ExcelWorksheet ws = package.Workbook.Worksheets[0];
                    for (int row = 5992; row < ws.Dimension.Rows+1; row++)
                    {
                        if (string.IsNullOrEmpty(Convert.ToString(ws.Cells[row, 7].Value)))
                        {
                            //await Task.Delay(100);
                            string result = await GetAddressFromLatLong.GetAddress1(string.Format("{0},{1}", Convert.ToString(ws.Cells[row, 5].Value), Convert.ToString(ws.Cells[row, 6].Value)));
                            var content = JsonConvert.DeserializeObject<content>(result);
                            int flag = 0;
                            for (int i = 0; i < content.results.Count; i++)
                            {
                                if (flag == 0 && content.results[i].address_components.Count>3)
                                {
                                    var detail1 = content.results[i];
                                    ws.Cells[row, 7].Value = detail1.formatted_address;
                                    ws.Cells[row, 8].Value = detail1.address_components[detail1.address_components.Count - 4].long_name;
                                    ws.Cells[row, 9].Value = detail1.address_components[detail1.address_components.Count - 3].long_name;
                                    ws.Cells[row, 10].Value = detail1.address_components[detail1.address_components.Count - 2].long_name;
                                    ws.Cells[row, 11].Value = detail1.address_components[detail1.address_components.Count - 1].long_name;
                                    flag = 1;
                                }
                                
                            }

                            package.Save();
                        }
                    }
                }
                package.Save();
                //package.SaveAs(fileInfo);
            }


            return new ResultInfo(0, Convert.ToString(fileInfo), "");
        }
    }
}
