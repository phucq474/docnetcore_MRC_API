using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
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
    public class DigitalMappingController : SpiralBaseController
    {
        public readonly IMappingService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public DigitalMappingController(MappingContext _context, IWebHostEnvironment _hosting)
        {
            _service = new MappingService(_context);
            this._hostingEnvironment = _hosting;
        }
        [HttpGet("mapgetshop")]
        public async Task<ActionResult> MapGetShop([FromHeader] string JsonSearch)
        {
            try
            {
                var data = await _service.MapGetShop(AccountId, UserId, JsonSearch);
                return Ok(data);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        [HttpGet("RouteByEmployee")]
        public async Task<ActionResult> DigitalMapping_RouteByEmployee([FromHeader] string JsonSearch)
        {
            var data = await _service.DigitalMapping_GetRouteByEmployee(AccountId, UserId, JsonSearch);
            return Ok(data);
        }
        [HttpGet("DistanceFromStartPoint")]
        public async Task<ActionResult> DigitalMapping_DistanceFromStartPoint([FromHeader] string JsonSearch)
        {
            var data = await _service.DigitalMapping_DistanceFromStartPoint(AccountId, UserId, JsonSearch);
            return Ok(data);
        }
        [HttpGet("ChartSellOut")]
        public async Task<ActionResult> DigitalMapping_ChartSellOut([FromHeader] int ShopId)
        {
            var FromDate = new DateTime(DateTime.Today.Year, 1, 1);
            var ToDate = new DateTime(DateTime.Today.Year, 12, 31);
            var data = await _service.DigitalMapping_ChartSellOut(AccountId, UserId, FromDate, ToDate, ShopId);
            return Ok(data);
        }
        [HttpPost("SaveCustomerInfo")]
        public IActionResult Customer_SaveInfo([FromBody] CustomerInfoModel Params)
        {
            var data = Task.Run(() => _service.Customer_SaveInfo(AccountId, UserId, Params.EmployeeId, Params.PlanDate, Params.CustomerPhone, Params.CustomerName, Params.CustomerAddress, Params.CustomerDesc, Params.Lat, Params.Lng, Params.TypeSave, Params.CusId));
            return Ok(data.Result);
        }
        [HttpGet("GetListCustomer")]
        public async Task<ActionResult> Customers_GetListCustomer([FromHeader] int? FromDate, [FromHeader] int? ToDate, [FromHeader] int? EmployeeId)
        {
            var data = await _service.Customer_GetListCustomer(AccountId, UserId, FromDate, ToDate, EmployeeId);
            return Ok(data);
        }
        [HttpGet("CustomerTrackingExport")]
        public async Task<ResultInfo> CustomerTracking_Export([FromHeader] int FromDate, [FromHeader] int ToDate, [FromHeader] int? EmployeeId)
        {
            try
            {
                string _CustomerPhone = null;
                int? _EmployeeId = null;
                if (EmployeeId > 0)
                    _EmployeeId = EmployeeId;
                await Task.Yield();
                var data = Task.Run(() => _service.CustomerTracking_Export(AccountId, UserId, FromDate, ToDate, _EmployeeId, null));
                if (data.Result.Rows.Count > 0)
                {
                    DataTable dt = data.Result;
                    string folder = _hostingEnvironment.WebRootPath;
                    string subfoler = "export/" + AccountId.ToString();
                    if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                    {
                        System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                    }
                    string fileName = "CustomerTracking_RawData_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
                    FileInfo file = new FileInfo(Path.Combine(folder, subfoler, fileName));
                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (var xls = new ExcelPackage(file))
                    {
                        var wsData = xls.Workbook.Worksheets.Add("RawData");
                        if (wsData != null)
                        {
                            wsData.Cells[1, 1].Value = "CUSTOMER TRACKING";
                            wsData.Cells[1, 1].Style.Font.Size = 18;
                            wsData.Cells[1, 1].Style.Font.Bold = true;
                            wsData.Row(1).Height = 30;
                            wsData.Cells[1, 1, 1, dt.Columns.Count].Merge = true;
                            ExcelFormats.FormatCell(wsData.Cells[1, 1, 1, dt.Columns.Count], "white", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            wsData.Cells[2, 1].Value = "Từ ngày:";
                            wsData.Cells[2, 2].Value = FromDate.ToString();
                            wsData.Cells[2, 3].Value = "Tới ngày:";
                            wsData.Cells[2, 4].Value = ToDate.ToString();


                            wsData.Cells[4, 1].LoadFromDataTable(dt, true);
                            ExcelFormats.FormatCell(wsData.Cells[4, 1, 4, dt.Columns.Count], "#F06292", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(wsData, 4, 1, dt.Rows.Count + 4, dt.Columns.Count);
                            wsData.Cells[4, 1, dt.Rows.Count + 4, dt.Columns.Count].AutoFitColumns();
                        }
                        var dtAttendant = Task.Run(() => _service.LG_AttendantKTV_Export(AccountId, UserId, FromDate, ToDate, _EmployeeId)).Result;
                        var wsAttendant = xls.Workbook.Worksheets.Add("Attendant");
                        if (wsAttendant != null)
                        {
                            wsAttendant.Cells[1, 1].Value = "Attendant Book";
                            wsAttendant.Cells[1, 1].Style.Font.Size = 18;
                            wsAttendant.Cells[1, 1].Style.Font.Bold = true;
                            wsAttendant.Row(1).Height = 30;
                            wsAttendant.Cells[1, 1, 1, dtAttendant.Columns.Count].Merge = true;
                            ExcelFormats.FormatCell(wsAttendant.Cells[1, 1, 1, dtAttendant.Columns.Count], "white", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            wsAttendant.Cells[2, 1].Value = "Từ ngày:";
                            wsAttendant.Cells[2, 2].Value = FromDate.ToString();
                            wsAttendant.Cells[2, 3].Value = "Tới ngày:";
                            wsAttendant.Cells[2, 4].Value = ToDate.ToString();


                            for (int i = 0; i < dtAttendant.Rows.Count; i++)
                            {
                                for (int j = 0; j < dtAttendant.Columns.Count; j++)
                                {
                                    if (i == 0)
                                    {
                                        var outputDate = new DateTime();
                                        if (DateTime.TryParse(dtAttendant.Columns[j].ColumnName.ToString(), out outputDate))
                                        {
                                            wsAttendant.Cells[5, j + 1].Value = outputDate.ToString("yyyy-MM-dd").Substring(outputDate.ToString("yyyy-MM-dd").Length - 2, 2);
                                            wsAttendant.Cells[4, j + 1].Value = outputDate.DayOfWeek.ToString().Substring(0, 3);
                                        }
                                        else
                                        {
                                            wsAttendant.Cells[4, j + 1].Value = dtAttendant.Columns[j].ColumnName.ToString();
                                            wsAttendant.Cells[4, j + 1, 5, j + 1].Merge = true;
                                        }
                                    }
                                    wsAttendant.Cells[i + 6, j + 1].Value = dtAttendant.Rows[i][j];
                                }
                            }
                            ExcelFormats.FormatCell(wsAttendant.Cells[4, 1, 5, dtAttendant.Columns.Count], "#80A9F0", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(wsAttendant, 4, 1, dtAttendant.Rows.Count + 5, dtAttendant.Columns.Count);
                            wsAttendant.Cells[4, 1, dtAttendant.Rows.Count + 5, dtAttendant.Columns.Count].AutoFitColumns();
                        }

                        xls.Save();
                    }
                    string downloadUrl = string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName);
                    return new ResultInfo(1, "Okey", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName));
                }
                else
                {
                    return new ResultInfo(0, "Nodata", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(0, "Error", ex.Message);
            }
        }
    }
}
