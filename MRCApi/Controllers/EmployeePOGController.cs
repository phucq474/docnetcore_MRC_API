using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
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
using static MRCApi.Controllers.ShopByCustomerController;

namespace MRCApi.Controllers
{
    public class EmployeePOGController : SpiralBaseController
    {
        public readonly IEmployeePOGService _service;
        public readonly IEmployeeService _employeeSerivce;
        IWebHostEnvironment _FRoot;
        public EmployeePOGController(EmployeePOGContext _context, IWebHostEnvironment _hosting, EmployeeContext _employeeContext)
        {
            _service = new EmployeePOGService(_context);
            _FRoot = _hosting;
            _employeeSerivce = new EmployeeService(_employeeContext);
        }

        [HttpPost("Filter")]
        public async Task<ResultInfo> Filter([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, UserId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No Data", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }

        }
        [HttpPost("Save")]
        public async Task<ResultInfo> Save([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Save(AccountId, UserId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Successfully!", null);
                }
                else
                {
                    return new ResultInfo(500, "Failed", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }

        }
        [HttpPost("Delete")]
        public async Task<ResultInfo> Delete([FromHeader] string ListId)
        {
            try
            {
                var data = await _service.Delete(AccountId, UserId, ListId);
                if (data > 0)
                {
                    return new ResultInfo(200, "Delete Successfully!", null);

                }
                else
                {
                    return new ResultInfo(500, "Delete Failed!", null);

                }

            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _FRoot.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Employee_POG_Result_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Employee_POG_Result.xlsx"));

            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet1 = package.Workbook.Worksheets["RawData"];
                            sheet1.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);
                            ExcelFormats.Border(sheet1, 4, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column);
                            sheet1.Cells[4, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column].AutoFitColumns();
                            sheet1.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        else
                        {
                            return new ResultInfo(500, "Không có dữ liệu", "");
                        }

                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["Employees"];
                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template()
        {
            string folder = _FRoot.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Employee_POG_Result_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Employee_POG_Result.xlsx"));

            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, UserId, null)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["Employees"];
                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        public class EmployeePOGModel
        {
            public int EmployeeId { get; set; }
            public int Year { get; set; }
            public int Month { get; set; }
            public int Week { get; set; }
            public int Pass { get; set; }
            public int Fail { get; set; }
            public int IsDelete { get; set; }

        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile)
        {
            string folder = _FRoot.WebRootPath;
            if (ifile != null && ifile.Files[0] != null)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        if (package != null && package.Workbook.Worksheets["RawData"] != null)
                        {
                            try
                            {
                                List<EmployeePOGModel> dataImport = new List<EmployeePOGModel>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["RawData"];

                                List<EmployeesEntity> lstEmp = _employeeSerivce.GetList(AccountId);

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        EmployeePOGModel item = new EmployeePOGModel();

                                        var EmployeeCode = sheet.Cells[row, 4].Value;
                                        var Week = sheet.Cells[row, 7].Value;
                                        var Month = sheet.Cells[row, 8].Value;
                                        var Year = sheet.Cells[row, 9].Value;
                                        var Pass = sheet.Cells[row, 10].Value;
                                        var Fail = sheet.Cells[row, 11].Value;
                                        var IsDelete = sheet.Cells[row, 12].Value;

                                        if (string.IsNullOrEmpty(Convert.ToString(EmployeeCode)))
                                        {
                                            return new ResultInfo(0, "EmployeeCode: không được để trống - Cell[" + row + ",4]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Week)))
                                        {
                                            return new ResultInfo(0, "Week: không được để trống - Cell[" + row + ",7]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Month)))
                                        {
                                            return new ResultInfo(0, "Month: không được để trống - Cell[" + row + ",8]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Year)))
                                        {
                                            return new ResultInfo(0, "Year: không được để trống - Cell[" + row + ",9]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(EmployeeCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(EmployeeCode)))
                                        {
                                            var tmp = lstEmp.Where(p => p.EmployeeCode == Convert.ToString(EmployeeCode)).FirstOrDefault();

                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "EmployeeCode: không tồn tại - Cell[" + row + ",4]", "");
                                            }
                                            else
                                            {
                                                item.EmployeeId = tmp.Id;
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Week)))
                                        {
                                            item.Week = Convert.ToInt32(Week);
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Month)))
                                        {
                                            item.Month = Convert.ToInt32(Month);
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Year)))
                                        {
                                            item.Year = Convert.ToInt32(Year);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Pass)))
                                        {
                                            item.Pass = Convert.ToInt32(Pass);
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Fail)))
                                        {
                                            item.Fail = Convert.ToInt32(Fail);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(IsDelete)))
                                        {
                                            item.IsDelete = Convert.ToString(IsDelete).Trim().ToLower() == "delete" ? 1 : 0;
                                        }

                                        dataImport.Add(item);
                                    }


                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(AccountId, UserId, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(200, string.Format("Import thành công: {0} dòng", dataImport.Count), "");
                                        }
                                    }
                                }
                                return new ResultInfo(500, "Dữ liệu rỗng", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), "");
                            }
                        }
                    }
                }
            }
            return new ResultInfo(500, "Dữ liệu rỗng", "");
        }
    }
}
