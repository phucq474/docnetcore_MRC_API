using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class EmployeeAnnualLeaveController : SpiralBaseController
    {
        private readonly IEmployeeAnnualLeaveService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public EmployeeAnnualLeaveController(EmployeeAnnualLeaveContext context, IWebHostEnvironment hostingEnvironment)
        {
            _service = new EmployeeAnnualLeaveService(context);
            this._hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("Filter")]
        public ActionResult<DataSet> EmployeeAnnualLeave_Filter([FromHeader] string JsonData)
        {
            return _service.EmployeeAnnualLeave_Filter(AccountId, UserId, JsonData).Result;
        }
        [HttpGet("Save")]
        public async Task<ResultInfo> EmployeeAnnualLeave_Save([FromHeader] string JsonData)
        {
            try
            {
                int result = await Task.Run(() => _service.EmployeeAnnualLeave_Save(AccountId, UserId, JsonData));
                if (result > 0)
                {
                    return new ResultInfo(200, "Thành công", null);
                }
                else
                    return new ResultInfo(500, "Không thành công", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }
        [HttpPost("Update")]
        public async Task<ResultInfo> EmployeeAnnualLeave_Update([FromHeader] string JsonData)
        {
            try
            {
                int result = await Task.Run(() => _service.EmployeeAnnualLeave_Update(AccountId, UserId, JsonData));
                if (result > 0)
                {
                    return new ResultInfo(200, "Thành công", null);
                }
                else
                    return new ResultInfo(500, "Không thành công", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }
        [HttpGet("Export")]
        public async Task<ResultInfo> EmployeeAnnualLeave_Export([FromHeader] string JsonData, [FromHeader] int Year, [FromHeader] string accountName)
        {
            try
            {
                string folder = _hostingEnvironment.WebRootPath;
                string subfolder = "export/EmployeeAnnualLeave";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                string fileName = $"Phép tồn nhân viên_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);

                FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_EmployeeAnnualLeave.xlsx"));
                if(accountName == "Fonterra")
                {
                    fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_EmployeeAnnualLeave_Fonterra.xlsx"));
                }
                FileInfo file = fileInfo.CopyTo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataSet dt = await Task.Run(() => _service.EmployeeAnnualLeave_Template(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        int dem = 0;
                        if(dt.Tables[0].Rows.Count > 0)
                        {
                            var wsExport = package.Workbook.Worksheets[0];
                            if (wsExport != null)
                            {
                                wsExport.Cells[3, 3].Value = Year;
                                if (dt.Tables[0].Rows.Count > 0)
                                {
                                    wsExport.Cells[8, 1].LoadFromDataTable(dt.Tables[0], false);

                                    ExcelFormats.Border(wsExport, 6, 1, wsExport.Dimension.End.Row, wsExport.Dimension.End.Column);
                                    wsExport.Cells[6, 1, wsExport.Dimension.End.Row, wsExport.Dimension.End.Column].AutoFitColumns();
                                }
                            }

                        }
                        else
                        {
                            dem += 1;
                        }

                        if (dt.Tables[1].Rows.Count > 0)
                        {
                            var waNB = package.Workbook.Worksheets[1];
                            if (waNB != null)
                            {
                                waNB.Cells[3, 3].Value = Year;
                                if (dt.Tables[1].Rows.Count > 0)
                                {
                                    waNB.Cells[8, 1].LoadFromDataTable(dt.Tables[1], false);

                                    ExcelFormats.Border(waNB, 6, 1, waNB.Dimension.End.Row, waNB.Dimension.End.Column);
                                    waNB.Cells[6, 1, waNB.Dimension.End.Row, waNB.Dimension.End.Column].AutoFitColumns();
                                }
                            }
                        }
                        else
                        {
                            dem += 1;
                        }

                        if(dem == 2)
                        {
                            return new ResultInfo(500, "Không có dữ liệu", "");
                        }
                        
                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Xuất file thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpPost("Import")]
        public async Task<ResultInfo> EmployeeAnnualLeave_Import([FromForm] IFormFile fileUpload, [FromHeader] string accountName)   
        {
            try
            {
                string folder = _hostingEnvironment.WebRootPath;
                var stream = fileUpload.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(stream))
                {
                    ExcelWorkbook workBook = package.Workbook;
                    List<EmployeeAnnualLeaveModel> dataImport = new List<EmployeeAnnualLeaveModel>();
                    List<EmployeeAnnualLeaveModel> dataNB = new List<EmployeeAnnualLeaveModel>();
                    var wsData = workBook.Worksheets["Phép tồn nhân viên"];
                 
                    if (wsData != null)
                    {
                        var endRow = wsData.Dimension.End.Row;
                        var endColumn = wsData.Dimension.End.Column;
                        if (endRow >= 8)
                        {
                            string Year = Convert.ToString(wsData.Cells[3, 3].Value).Trim();
                            if (string.IsNullOrEmpty(Year) || string.IsNullOrWhiteSpace(Year))
                                return new ResultInfo(500, "Năm không được để trống. Dòng: 3; Cột: 3", null);
                            for (int i = 8; i <= endRow; i++)
                            {
                                string EmployeeCode = Convert.ToString(wsData.Cells[i, 4].Value).Trim();
                                for (int j = 6; j <= endColumn; j++)
                                {
                                    if (j <= 17)
                                    {
                                        var countAL = Convert.ToString(wsData.Cells[i, j].Value).Trim();
                                        var Month = Convert.ToString(wsData.Cells[7, j].Value).Trim();
                                        int outMonth;
                                        if (!int.TryParse(Month, out outMonth))
                                        {
                                            return new ResultInfo(500, "Tháng không đúng định dạng. Dòng: 7; Cột: " + j, null);
                                        }
                                        if (!string.IsNullOrEmpty(countAL) && !string.IsNullOrWhiteSpace(countAL))
                                        {
                                            EmployeeAnnualLeaveModel item = new EmployeeAnnualLeaveModel();
                                            decimal outCountAL;
                                            if (!decimal.TryParse(countAL, out outCountAL))
                                            {
                                                return new ResultInfo(500, "Không đúng định dạng. Dòng: " + i + "; Cột: " + j, null);
                                            }
                                            item.EmployeeCode = EmployeeCode;
                                            item.Year = Convert.ToInt16(Year);
                                            item.AL = outCountAL;
                                            item.Month = Convert.ToInt16(Month);

                                            var tmp = dataImport.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year 
                                                                        && p.Month == item.Month
                                                                ).FirstOrDefault();
                                            if(tmp != null)
                                            {
                                                dataImport.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).ToList().ForEach(i => i.AL = item.AL);
                                            }
                                            else
                                            {
                                                dataImport.Add(item);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var countAL = Convert.ToString(wsData.Cells[i, j].Value).Trim();
                                        var Month = Convert.ToString(wsData.Cells[7, j].Value).Trim();
                                        int outMonth;
                                        if (!int.TryParse(Month, out outMonth))
                                        {
                                            return new ResultInfo(500, "Tháng không đúng định dạng. Dòng: 7; Cột: " + j, null);
                                        }
                                        if (!string.IsNullOrEmpty(countAL) && !string.IsNullOrWhiteSpace(countAL))
                                        {
                                            EmployeeAnnualLeaveModel item = new EmployeeAnnualLeaveModel();
                                            decimal outCountAL;
                                            if (!decimal.TryParse(countAL, out outCountAL))
                                            {
                                                return new ResultInfo(500, "Không đúng định dạng. Dòng: " + i + "; Cột: " + j, null);
                                            }
                                            item.EmployeeCode = EmployeeCode;
                                            item.Year = Convert.ToInt16(Year);
                                            item.MonthAL = outCountAL;
                                            item.Month = Convert.ToInt16(Month);

                                            var tmp = dataImport.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).FirstOrDefault();
                                            if (tmp != null)
                                            {
                                                dataImport.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).ToList().ForEach(i => i.MonthAL = item.MonthAL);
                                            }
                                            else
                                            {
                                                dataImport.Add(item);
                                            }
                                        }
                                    }
                                   

                                }
                            }
                        }
                     
                    }

                    var wsNB = workBook.Worksheets["NB nhân viên"];
                    if(accountName == "Fonterra")
                    {
                        wsNB = workBook.Worksheets["CL nhân viên"];
                    }
                    if (wsNB != null)
                    {
                        var endRow = wsNB.Dimension.End.Row;
                        var endColumn = wsNB.Dimension.End.Column;
                        if (endRow >= 8)
                        {
                            string Year = Convert.ToString(wsNB.Cells[3, 3].Value).Trim();
                            if (string.IsNullOrEmpty(Year) || string.IsNullOrWhiteSpace(Year))
                                return new ResultInfo(500, "Năm không được để trống. Dòng: 3; Cột: 3", null);
                            for (int i = 8; i <= endRow; i++)
                            {
                                string EmployeeCode = Convert.ToString(wsNB.Cells[i, 4].Value).Trim();
                                for (int j = 6; j <= endColumn; j++)
                                {
                                    if (j <= 17)
                                    {
                                        var countAL = Convert.ToString(wsNB.Cells[i, j].Value).Trim();
                                        var Month = Convert.ToString(wsNB.Cells[7, j].Value).Trim();
                                        int outMonth;
                                        if (!int.TryParse(Month, out outMonth))
                                        {
                                            return new ResultInfo(500, "Tháng không đúng định dạng. Dòng: 7; Cột: " + j, null);
                                        }
                                        if (!string.IsNullOrEmpty(countAL) && !string.IsNullOrWhiteSpace(countAL))
                                        {
                                            EmployeeAnnualLeaveModel item = new EmployeeAnnualLeaveModel();
                                            decimal outCountAL;
                                            if (!decimal.TryParse(countAL, out outCountAL))
                                            {
                                                return new ResultInfo(500, "Không đúng định dạng. Dòng: " + i + "; Cột: " + j, null);
                                            }
                                            item.EmployeeCode = EmployeeCode;
                                            item.Year = Convert.ToInt16(Year);
                                            item.NB = outCountAL;
                                            item.Month = Convert.ToInt16(Month);

                                            var tmp = dataNB.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).FirstOrDefault();
                                            if (tmp != null)
                                            {
                                                dataNB.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).ToList().ForEach(i => i.NB = item.NB);
                                            }
                                            else
                                            {
                                                dataNB.Add(item);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        var countAL = Convert.ToString(wsNB.Cells[i, j].Value).Trim();
                                        var Month = Convert.ToString(wsNB.Cells[7, j].Value).Trim();
                                        int outMonth;
                                        if (!int.TryParse(Month, out outMonth))
                                        {
                                            return new ResultInfo(500, "Tháng không đúng định dạng. Dòng: 7; Cột: " + j, null);
                                        }
                                        if (!string.IsNullOrEmpty(countAL) && !string.IsNullOrWhiteSpace(countAL))
                                        {
                                            EmployeeAnnualLeaveModel item = new EmployeeAnnualLeaveModel();
                                            decimal outCountAL;
                                            if (!decimal.TryParse(countAL, out outCountAL))
                                            {
                                                return new ResultInfo(500, "Không đúng định dạng. Dòng: " + i + "; Cột: " + j, null);
                                            }
                                            item.EmployeeCode = EmployeeCode;
                                            item.Year = Convert.ToInt16(Year);
                                            item.MonthNB = outCountAL;
                                            item.Month = Convert.ToInt16(Month);

                                            var tmp = dataNB.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).FirstOrDefault();
                                            if (tmp != null)
                                            {
                                                dataNB.Where(p => p.EmployeeCode == item.EmployeeCode && p.Year == item.Year
                                                                        && p.Month == item.Month
                                                                ).ToList().ForEach(i => i.MonthNB = item.MonthNB);
                                            }
                                            else
                                            {
                                                dataNB.Add(item);
                                            }
                                        }
                                    }

                                }
                            }
                        }

                    }

                    if ((dataImport.Count + dataNB.Count) > 0)
                    {
                        string dataJson = null;
                        string NBJson = null;
                        if (dataImport.Count > 0)
                        {
                            dataJson = JsonConvert.SerializeObject(dataImport);
                        }
                        if (dataNB.Count > 0)
                        {
                            NBJson = JsonConvert.SerializeObject(dataNB);
                        }

                        var resultImport = await Task.Run(() => _service.EmployeeAnnualLeave_Import( AccountId, UserId, dataJson, NBJson));
                        if (resultImport > 0)
                        {
                            return new ResultInfo(200, "Thành công", "");
                        }
                        else
                            return new ResultInfo(500, "Không thành công", "");
                    }
                    else
                        return new ResultInfo(500, "Không có dữ liệu để import", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }
        [HttpGet("Template")]
        public async Task<ResultInfo> EmployeeAnnualLeave_Template([FromHeader] string JsonData, [FromHeader] int Year, [FromHeader] string accountName)
        {
            try
            {
                string folder = _hostingEnvironment.WebRootPath;
                string subfolder = "export/EmployeeAnnualLeave";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                string fileName = $"Phép tồn nhân viên_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);

                FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_EmployeeAnnualLeave.xlsx"));
                if(accountName == "Fonterra")
                {
                    fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_EmployeeAnnualLeave_Fonterra.xlsx"));
                }
                FileInfo file = fileInfo.CopyTo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataSet dt = await Task.Run(() => _service.EmployeeAnnualLeave_Template(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var wsTemplate = package.Workbook.Worksheets[0];
                        if (wsTemplate != null)
                        {
                            wsTemplate.Cells[3, 3].Value = Year;
                            if (dt.Tables[0].Rows.Count > 0)
                            {
                                wsTemplate.Cells[8, 1].LoadFromDataTable(dt.Tables[0], false);

                                ExcelFormats.Border(wsTemplate, 6, 1, wsTemplate.Dimension.End.Row, wsTemplate.Dimension.End.Column);
                                wsTemplate.Cells[6, 1, wsTemplate.Dimension.End.Row, wsTemplate.Dimension.End.Column].AutoFitColumns();
                            }
                        }

                        var waNB = package.Workbook.Worksheets[1];
                        if (waNB != null)
                        {
                            waNB.Cells[3, 3].Value = Year;
                            if (dt.Tables[1].Rows.Count > 0)
                            {
                                waNB.Cells[8, 1].LoadFromDataTable(dt.Tables[1], false);

                                ExcelFormats.Border(waNB, 6, 1, waNB.Dimension.End.Row, waNB.Dimension.End.Column);
                                waNB.Cells[6, 1, waNB.Dimension.End.Row, waNB.Dimension.End.Column].AutoFitColumns();
                            }
                        }
                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Tạo template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
    }
}
