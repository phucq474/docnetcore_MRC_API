using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralService;
using System.Threading.Tasks;
using System;
using System.Data;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Http;
using MRCApi.Extentions;
using OfficeOpenXml;
using SpiralEntity.Models;
using SpiralEntity;
using System.Collections.Generic;
using System.IO;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Linq;

namespace MRCApi.Controllers
{
    public class SyncDataController : SpiralBaseController
    {
        private readonly ISyncDataService _service;
        private readonly IEmployeeService _employeeService;
        private readonly IEmployeeTypesService _employeeTypesService;
        IWebHostEnvironment _webHostEnvironment;
        public SyncDataController(SyncDataContext context, EmployeeContext employeeContext, EmployeeTypeContext employeeTypeContext, IWebHostEnvironment webHostEnvironment)
        {
            _service = new SyncDataService(context);
            _employeeService = new EmployeeService(employeeContext);
            _employeeTypesService = new EmployeeTypesService(employeeTypeContext);
            _webHostEnvironment = webHostEnvironment;
        }
        private class RecordModel
        {
            public string Report { get; set; }
            public int TotalRows { get; set; }
            public int UserId { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
        }
        private class EmployeeModel
        {
            public int Year { get; set; }
            public int Month { get; set; }
            public int EmployeeId { get; set; }
            public string EmployeeCode { get; set; }
            public string ICPCode { get; set; }
            public string EmployeeName { get; set; }
            public DateTime? DateJoin { get; set; }
            public DateTime? DateQuit { get; set; }
        }
        private class WorkingModel
        {
            public int Year { get; set; }
            public int Month { get; set; }
            public int EmployeeId { get; set; }
            public string EmployeeCode { get; set; }
            public string OrgStuctureCode { get; set; }
            public int PositionId { get; set; }
            public string PositionCode { get; set; }
            public string RouteCode { get; set; }
            public int SaleSupId { get; set; }
            public string SaleSupCode { get; set; }
            public int KAMId { get; set; }
            public string KAMCode { get; set; }
        }
        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection files)
        {
            string folder = _webHostEnvironment.WebRootPath;
            if (files != null && files.Files[0] != null)
            {
                var file = files.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        ExcelWorkbook workBook = package.Workbook;
                        if (workBook != null)
                        {
                            try
                            {
                                var lstEmployee = _employeeService.GetAll(AccountId);
                                var lstPosition = _employeeTypesService.GetDynamic();

                                EmployeesEntity employee = new EmployeesEntity();
                                EmployeeTypesEntity employeeType = new EmployeeTypesEntity();

                                List<EmployeeModel> employees = new List<EmployeeModel>();
                                List<WorkingModel> workings = new List<WorkingModel>();

                                ExcelWorksheet wsE = package.Workbook.Worksheets["DATE JOIN-DATE QUIT"];
                                if (wsE != null)
                                {
                                    if (wsE.Dimension.Rows > 2)
                                    {
                                        for (int row = 3; row < wsE.Dimension.Rows + 1; row++)
                                        {
                                            string year = Convert.ToString(wsE.Cells[row, 1].Value);
                                            string month = Convert.ToString(wsE.Cells[row, 2].Value);
                                            string employeeCode = Convert.ToString(wsE.Cells[row, 3].Value);
                                            string icpCode = Convert.ToString(wsE.Cells[row, 4].Value);
                                            string employeeName = Convert.ToString(wsE.Cells[row, 5].Value);
                                            string dateJoin = Convert.ToString(wsE.Cells[row, 6].Value);
                                            string dateQuit = Convert.ToString(wsE.Cells[row, 7].Value);

                                            if (string.IsNullOrEmpty(year))
                                                return new ResultInfo(500, string.Format("Year: không được để trống - Dòng {0}", row), "");
                                            if (string.IsNullOrEmpty(month))
                                                return new ResultInfo(500, string.Format("Month: không được để trống - Dòng {0}", row), "");
                                            if (string.IsNullOrEmpty(employeeCode))
                                                return new ResultInfo(500, string.Format("EmployeeCode: không được để trống - Dòng {0}", row), "");
                                            else
                                            {
                                                employee = lstEmployee.Where(e => e.EmployeeCode == employeeCode).ToList().FirstOrDefault();
                                                if (employee == null)
                                                {
                                                    return new ResultInfo(500, string.Format("EmployeeCode không tìm thấy trên hệ thống - Dòng {0}", row), "");
                                                }
                                            }
                                            if (string.IsNullOrEmpty(employeeName))
                                                return new ResultInfo(500, string.Format("EmployeeName: không được để trống - Dòng {0}", row), "");
                                            else if (employee.FullName != employeeName)
                                            {
                                                return new ResultInfo(500, string.Format("EmployeeName không đúng với EmployeeCode - Dòng {0}", row), "");
                                            }
                                            if (string.IsNullOrEmpty(dateJoin))
                                            {
                                                return new ResultInfo(500, string.Format("DateJoin: không được để trống - Dòng {0}", row), "");
                                            }

                                            EmployeeModel employeeModel = new EmployeeModel
                                            {
                                                Year = Convert.ToInt32(year),
                                                Month = Convert.ToInt32(month),
                                                EmployeeId = employee.Id,
                                                EmployeeCode = employee.EmployeeCode,
                                                EmployeeName = employee.FullName,
                                                ICPCode = string.IsNullOrEmpty(icpCode) ? null : icpCode,
                                                DateJoin = Convert.ToDateTime(dateJoin)
                                            };
                                            if (!string.IsNullOrEmpty(dateQuit))
                                                employeeModel.DateQuit = Convert.ToDateTime(dateQuit);

                                            employees.Add(employeeModel);
                                        }
                                    }
                                }
                                ExcelWorksheet wsW = package.Workbook.Worksheets["WORKING HISTORY"];
                                if (wsW != null)
                                {
                                    if (wsW.Dimension.Rows > 2)
                                    {
                                        for (int row = 3; row < wsW.Dimension.Rows + 1; row++)
                                        {
                                            WorkingModel workingModel = new WorkingModel();

                                            string year = Convert.ToString(wsW.Cells[row, 1].Value);
                                            string month = Convert.ToString(wsW.Cells[row, 2].Value);
                                            string employeeCode = Convert.ToString(wsW.Cells[row, 3].Value);
                                            string orgStuctureCode = Convert.ToString(wsW.Cells[row, 4].Value);
                                            string positionCode = Convert.ToString(wsW.Cells[row, 5].Value);
                                            string routeCode = Convert.ToString(wsW.Cells[row, 6].Value);
                                            string saleSupCode = Convert.ToString(wsW.Cells[row, 7].Value);
                                            string kamCode = Convert.ToString(wsW.Cells[row, 8].Value);

                                            if (string.IsNullOrEmpty(year))
                                                return new ResultInfo(500, string.Format("Year: không được để trống - Dòng {0}", row), "");
                                            if (string.IsNullOrEmpty(month))
                                                return new ResultInfo(500, string.Format("Month: không được để trống - Dòng {0}", row), "");
                                            if (string.IsNullOrEmpty(employeeCode))
                                                return new ResultInfo(500, string.Format("EmployeeCode: không được để trống - Dòng {0}", row), "");
                                            else
                                            {
                                                employee = lstEmployee.Where(e => e.EmployeeCode == employeeCode).ToList().FirstOrDefault();
                                                if (employee == null)
                                                {
                                                    return new ResultInfo(500, string.Format("EmployeeCode không tìm thấy trên hệ thống - Dòng {0}", row), "");
                                                }
                                                else
                                                {
                                                    workingModel.EmployeeId = employee.Id;
                                                    workingModel.EmployeeCode = employee.EmployeeCode;
                                                }
                                            }

                                            if (string.IsNullOrEmpty(positionCode))
                                                return new ResultInfo(500, string.Format("PositionCode: không được để trống - Dòng {0}", row), "");
                                            else
                                            {
                                                employeeType = lstPosition.Where(e => e.TypeName == positionCode.Trim()).ToList().FirstOrDefault();
                                                if (employeeType == null)
                                                {
                                                    return new ResultInfo(500, string.Format("PositionCode không tìm thấy trên hệ thống - Dòng {0}", row), "");
                                                }
                                                else
                                                {
                                                    workingModel.PositionId = employeeType.Id;
                                                    workingModel.PositionCode = employeeType.TypeName;
                                                }
                                            }
                                            if (!string.IsNullOrEmpty(saleSupCode))
                                            {
                                                employee = lstEmployee.Where(e => e.EmployeeCode == saleSupCode).ToList().FirstOrDefault();
                                                if (employee == null)
                                                {
                                                    return new ResultInfo(500, string.Format("SaleSupCode không tìm thấy trên hệ thống - Dòng {0}", row), "");
                                                }
                                                else
                                                {
                                                    workingModel.SaleSupId = employee.Id;
                                                    workingModel.SaleSupCode = employee.EmployeeCode;
                                                }
                                            }
                                            if (!string.IsNullOrEmpty(kamCode))
                                            {
                                                employee = lstEmployee.Where(e => e.EmployeeCode == kamCode).ToList().FirstOrDefault();
                                                if (employee == null)
                                                {
                                                    return new ResultInfo(500, string.Format("KAMCode không tìm thấy trên hệ thống - Dòng {0}", row), "");
                                                }
                                                else
                                                {
                                                    workingModel.KAMId = employee.Id;
                                                    workingModel.KAMCode = employee.EmployeeCode;
                                                }
                                            }

                                            workingModel.Year = Convert.ToInt32(year);
                                            workingModel.Month = Convert.ToInt32(month);
                                            workingModel.OrgStuctureCode = string.IsNullOrEmpty(orgStuctureCode) ? null: orgStuctureCode;
                                            workingModel.RouteCode = string.IsNullOrEmpty(routeCode) ? null : routeCode; 
                                            workingModel.PositionId=employeeType.Id;
                                            workingModel.PositionCode = positionCode;

                                            workings.Add(workingModel);
                                        }
                                    }
                                }

                                if (employees.Count == 0 && workings.Count == 0)
                                return new ResultInfo(0, "No data for import", "");
                                else
                                {
                                    string jsonEmployees = JsonConvert.SerializeObject(employees);
                                    string jsonWorkings = JsonConvert.SerializeObject(workings);

                                    var Result = await Task.Run(() => _service.WorkingHistory_Import(UserId, jsonEmployees, jsonWorkings));
                                    if (Result > 0)
                                    {
                                        return new ResultInfo(200, string.Format("Import thành công: {0} dòng", employees.Count + workings.Count), "");
                                    }
                                    else
                                    {
                                        return new ResultInfo(500, "Import fail", "");
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), "");
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "File Is Empty", "");
        }

        [HttpGet("GetData")]
        public ActionResult<DataTable> GetData([FromHeader] string TypeReport, [FromHeader] string FromDate, [FromHeader] string ToDate)
        {
            try
            {
                DataTable data = new DataTable();
                switch (TypeReport.ToUpper())
                {

                    case "STAFF_INFORMATION":
                        data = Task.Run(() => _service.STAFF_INFORMATION(FromDate, ToDate)).Result;
                        break;
                    case "STORE_LIST":
                        data = Task.Run(() => _service.STORE_LIST(FromDate, ToDate)).Result;
                        break;
                    case "OSA":
                        data = Task.Run(() => _service.OSA(FromDate, ToDate)).Result;
                        break;
                    case "VISIBILITY":
                        data = Task.Run(() => _service.VISIBILITY(FromDate, ToDate)).Result;
                        break;
                    case "MCP":
                        data = Task.Run(() => _service.MCP(FromDate, ToDate)).Result;
                        break;
                    case "ATTENDANCE":
                        data = Task.Run(() => _service.ATTENDANCE(FromDate, ToDate)).Result;
                        break;
                    case "SALESBYMONTH":
                        data = Task.Run(() => _service.SALESBYMONTH(FromDate, ToDate)).Result;
                        break;
                    case "DATEJOIN-DATEQUIT":
                        data = Task.Run(() => _service.DATEJOIN(FromDate, ToDate)).Result;
                        break;
                    case "WORKING-HISTORY":
                        data = Task.Run(() => _service.WORKING_HISTORY(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_ATTENDANCE":
                        data = Task.Run(() => _service.MTDashboard_ATTENDANCE(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_COVERAGE":
                        data = Task.Run(() => _service.MTDashboard_Coverage(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_INVENTORY":
                        data = Task.Run(() => _service.MTDashboard_Inventory(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_MCP":
                        data = Task.Run(() => _service.MTDashboard_MCP(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_OSA":
                        data = Task.Run(() => _service.MTDashboard_OSA(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_STAFF_INFORMATION":
                        data = Task.Run(() => _service.MTDashboard_STAFF_INFORMATION(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_STORE_LIST":
                        data = Task.Run(() => _service.MTDashboard_STORE_LIST(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_VISIBILITY":
                        data = Task.Run(() => _service.MTDashboard_Visibility(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_PLANCALL":
                        data = Task.Run(() => _service.MTDashboard_PlanCall(FromDate, ToDate)).Result;
                        break;
                    default:
                        return BadRequest("TypeReport is not correct");
                }
                RecordModel record = new RecordModel
                {
                    Report = TypeReport.ToUpper(),
                    FromDate = FromDate,
                    ToDate = ToDate,
                    UserId = UserId,
                    TotalRows = data.Rows.Count
                };
                var result = Task.Run(() => _service.Record(JsonConvert.SerializeObject(record))).Result;
                return data;

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("Export")]
        public ActionResult<ResultInfo> Export([FromHeader] string TypeReport, [FromHeader] string FromDate, [FromHeader] string ToDate)
        {
            try
            {
                string folder = _webHostEnvironment.WebRootPath;
                string subfolder = "export/SyncData";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                FileInfo file = null;
                string fileName = $"{TypeReport.ToUpper()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);
                file = new FileInfo(fileExport);

                DataTable data = new DataTable();
                switch (TypeReport.ToUpper())
                {

                    case "STAFF_INFORMATION":
                        data = Task.Run(() => _service.STAFF_INFORMATION(FromDate, ToDate)).Result;
                        break;
                    case "STORE_LIST":
                        data = Task.Run(() => _service.STORE_LIST(FromDate, ToDate)).Result;
                        break;
                    case "OSA":
                        data = Task.Run(() => _service.OSA(FromDate, ToDate)).Result;
                        break;
                    case "VISIBILITY":
                        data = Task.Run(() => _service.VISIBILITY(FromDate, ToDate)).Result;
                        break;
                    case "MCP":
                        data = Task.Run(() => _service.MCP(FromDate, ToDate)).Result;
                        break;
                    case "ATTENDANCE":
                        data = Task.Run(() => _service.ATTENDANCE(FromDate, ToDate)).Result;
                        break;
                    case "SALESBYMONTH":
                        data = Task.Run(() => _service.SALESBYMONTH(FromDate, ToDate)).Result;
                        break;
                    case "DATEJOIN_DATEQUIT":
                        data = Task.Run(() => _service.DATEJOIN(FromDate, ToDate)).Result;
                        break;
                    case "WORKING_HISTORY":
                        data = Task.Run(() => _service.WORKING_HISTORY(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_ATTENDANCE":
                        data = Task.Run(() => _service.MTDashboard_ATTENDANCE(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_COVERAGE":
                        data = Task.Run(() => _service.MTDashboard_Coverage(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_INVENTORY":
                        data = Task.Run(() => _service.MTDashboard_Inventory(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_MCP":
                        data = Task.Run(() => _service.MTDashboard_MCP(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_OSA":
                        data = Task.Run(() => _service.MTDashboard_OSA(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_STAFF_INFORMATION":
                        data = Task.Run(() => _service.MTDashboard_STAFF_INFORMATION(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_STORE_LIST":
                        data = Task.Run(() => _service.MTDashboard_STORE_LIST(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_VISIBILITY":
                        data = Task.Run(() => _service.MTDashboard_Visibility(FromDate, ToDate)).Result;
                        break;
                    case "MTDASHBOARD_PLANCALL":
                        data = Task.Run(() => _service.MTDashboard_PlanCall(FromDate, ToDate)).Result;
                        break;
                    default:
                        return BadRequest("TypeReport is not correct");
                }

                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets.Add(TypeReport.ToUpper());
                        if (sheet != null)
                        {
                            if (data.Rows.Count > 0)
                            {
                                //load data
                                sheet.Row(4).Height = 30;
                                sheet.Row(1).Height = 30;
                                sheet.Cells[4, 1].LoadFromDataTable(data, true);

                                sheet.Cells[1, 1].Value = TypeReport.ToUpper();
                                sheet.Cells[1, 1, 1, data.Columns.Count].Merge = true;
                                ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, data.Columns.Count], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                sheet.Cells[2, 1].Value = "Từ ngày: ";
                                sheet.Cells[2, 2].Value = FromDate;
                                sheet.Cells[2, 3].Value = "Tới ngày: ";
                                sheet.Cells[2, 4].Value = ToDate;
                                ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, data.Columns.Count], "#5B9BD5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 4, 1, data.Rows.Count + 4, data.Columns.Count);
                                sheet.Cells.AutoFitColumns();
                            }
                            else
                                return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        package.Save();
                    }

                return (new ResultInfo(200, "Xuất báo cáo thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception err)
            {
                return (new ResultInfo(500, err.Message, null));
            }
        }

    }
}
