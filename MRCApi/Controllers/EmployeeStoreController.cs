using Microsoft.AspNetCore.Authorization;
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
using MRCApi.ClientModel;
using MRCApi.Extentions;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.DataProtection;

namespace MRCApi.Controllers
{
    public class EmployeeStoreController : SpiralBaseController
    {
        public readonly IEmployeeStoreService _service;
        public readonly IEmployeeService _employeeSerivce;
        public readonly IShopService _shopService;
        IWebHostEnvironment _FRoot;
        public EmployeeStoreController(EmployeeStoreContext _context, IWebHostEnvironment _hosting, EmployeeContext _employeeContext, ShopContext _shopContext)
        {
            _service = new EmployeeStoreService(_context);
            _FRoot = _hosting;
            _employeeSerivce = new EmployeeService(_employeeContext);
            _shopService = new ShopService(_shopContext);
        }
        [HttpPost("Filter")]
        [Authorize]
        public IActionResult EmployeeStore_Filter([FromBody] EmployeeStoreSearch Params, [FromHeader] int? accId)
        {
            var data = Task.Run(() => _service.EmployeeStore_Filter(accId ?? AccountId, UserId, Params.EmployeeId, Params.CustomerId, Params.Area, Params.ProvinceId, Params.ShopCodes));
            return Ok(data.Result);
        }
        [HttpPost("Save")]
        [Authorize]
        public IActionResult EmployeeStore_Save([FromBody] EmployeeStoreSearch Params, [FromHeader] int? accId)
        {
            var data = Task.Run(() => _service.EmployeeStore_Save(accId ?? AccountId, UserId, Params.EmployeeId, Params.ShopSave, Params.ShopCodes));
            return Ok(data.Result);
        }
        [HttpGet("Export")]
        [Authorize]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                string sWebRootFolder = _FRoot.WebRootPath;
                string subfolder = "export/" + AccountId.ToString() + "/EmployeeShop";
                if (!System.IO.Directory.Exists(Path.Combine(sWebRootFolder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(sWebRootFolder, subfolder));
                }
                using (DataSet ds = await Task.Run(() => _service.GetTempStorePermissionImport(accId ?? AccountId, UserId, JsonData)))
                {
                    if (ds != null && ds.Tables.Count > 0)
                    {
                        if (ds.Tables[0].Rows.Count > 0 || (ds.Tables[1].Rows.Count > 0 && ds.Tables[2].Rows.Count > 0))
                        {
                            string fileName = "StorePermission_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
                            FileInfo fileInfo = new FileInfo(Path.Combine(sWebRootFolder, "Export\\template_VNM\\tmpEmployeePermission.xlsx"));
                            var path = Path.Combine(sWebRootFolder, "Export\\ExportFile\\");
                            if (!System.IO.Directory.Exists(path))
                                Directory.CreateDirectory(path);
                            string fileExport = Path.Combine(sWebRootFolder, subfolder, fileName);
                            FileInfo fileCoppy = fileInfo.CopyTo(fileExport);
                            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                            using (var xls = new ExcelPackage(fileCoppy))
                            {
                                ExcelWorksheet sheet1 = xls.Workbook.Worksheets[0];
                                ExcelWorksheet sheet2 = xls.Workbook.Worksheets[1];
                                ExcelWorksheet sheet3 = xls.Workbook.Worksheets[2];
                                sheet1.Cells[3, 1].LoadFromDataTable(ds.Tables[0], false);
                                ExcelFormats.Border(sheet1, 3, 1, sheet1.Dimension.End.Row, 7);
                                sheet2.Cells[3, 3].LoadFromDataTable(ds.Tables[1], false);
                                ExcelFormats.Border(sheet2, 3, 3, sheet2.Dimension.End.Row, 5);
                                sheet3.Cells[3, 3].LoadFromDataTable(ds.Tables[2], false);
                                ExcelFormats.Border(sheet3, 3, 3, sheet3.Dimension.End.Row, 4);
                                xls.Save();
                                return new ResultInfo(200, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName));
                            }
                        }
                        else
                        {
                            return new ResultInfo(500, "Không có dữ liệu", "");
                        }
                     
                    }
                }
                return new ResultInfo(500, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpGet("EditFromToDate")]
        [Authorize]
        public async Task<ResultInfo> EmployeeStore_SaveEdit([FromHeader] int Id, [FromHeader] int EmployeeId, [FromHeader] int ShopId, [FromHeader] int FromDate, [FromHeader] int? ToDate, [FromHeader] int? accId)
        {
            try
            {
                var result = await Task.Run(() => _service.EmployeeStore_EditDate(Id, accId ?? AccountId, EmployeeId, ShopId, FromDate, ToDate == 0 ? null : ToDate));
                if (result.Rows.Count > 0)
                {
                    string JSONresult;
                    JSONresult = JsonConvert.SerializeObject(result);
                    return new ResultInfo(200, JSONresult, "");
                }
                else
                    return new ResultInfo(0, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpPost("Import")]
        [Authorize]
        public async Task<ResultInfo> Import(IFormFile fileUpload, [FromHeader] int? accId)
        {
            string folder = _FRoot.WebRootPath;
            string subfoler = "upload/error/" + (accId??AccountId).ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            var stream = fileUpload.OpenReadStream();
            ExcelPackage.LicenseContext = LicenseContext.Commercial;
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            string fileName = "issueFile_EmployeeStore_" + string.Format("{0:yyyyMMdd_HHmmss}", DateTime.Now) + ".xlsx";
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, subfoler, fileName));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (var package = new ExcelPackage(stream))
            {
                try
                {
                    ExcelWorkbook workBook = package.Workbook;
                    ExcelWorksheet sheet = workBook.Worksheets[0];
                    int maxIndex = sheet.Dimension.End.Row;
                    DataTable dt = new DataTable();
                    dt.Columns.Add("EmployeeCode", typeof(string));
                    dt.Columns.Add("ShopCode", typeof(string));
                    dt.Columns.Add("FromDate", typeof(int));
                    dt.Columns.Add("ToDate", typeof(int));
                    dt.Columns.Add("TypeAction", typeof(int));
                    List<ShopsEntity> StoreList = _shopService.GetList(accId ?? AccountId);
                    List<EmployeeModel> Emloyees = Task.Run(() => _employeeSerivce.GetByAccount(accId ?? AccountId, UserId, null, null)).Result;
                    int endCol = sheet.Dimension.End.Column + 1;
                    bool isError = false;

                    for (int i = 3; i <= maxIndex; i++)
                    {
                        string listError = "";
                        if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[i, 1])))
                        {
                            listError += " - ShopCode không được để trống";
                            isError = true;
                        }
                        else
                        {
                            if (!StoreList.Any(p => p.ShopCode.ToString() == sheet.Cells[i, 1].Value.ToString()))
                            {
                                listError += " - ShopCode không hợp lệ";
                                isError = true;
                            }

                        }

                        if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[i, 3])))
                        {
                            listError += " - EmployeeCode không được để trống";
                            isError = true;
                        }
                        else
                        {
                            if (!Emloyees.Any(p => p.EmployeeCode.ToString() == sheet.Cells[i, 3].Value.ToString()))
                            {
                                listError += " - EmployeeCode không hợp lệ";
                                isError = true;
                            }
                        }

                        if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[i, 5])))
                        {
                            listError += " - FromDate không được để trống";
                            isError = true;
                        }

                        if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[i, 7])))
                        {
                            listError += " - Action không được để trống";
                            isError = true;
                        }
                    
                        DataRow r = dt.NewRow();
                        r["ShopCode"] = ExcelFormats.cellString(sheet.Cells[i, 1]);
                        r["EmployeeCode"] = ExcelFormats.cellString(sheet.Cells[i, 3]);
                        DateTime from = Convert.ToDateTime(ExcelFormats.cellDatetime(sheet.Cells[i, 5]));
                        r["FromDate"] = Convert.ToInt32(string.Format("{0:yyyyMMdd}", from));
                        if (ExcelFormats.cellDatetime(sheet.Cells[i, 6]) != DBNull.Value)
                        {
                            DateTime to = Convert.ToDateTime(ExcelFormats.cellDatetime(sheet.Cells[i, 6]));
                            r["ToDate"] = Convert.ToInt32(string.Format("{0:yyyyMMdd}", to));
                        }
                        r["TypeAction"] = ExcelFormats.cellInt(sheet.Cells[i, 7]);

                        if (string.IsNullOrEmpty(listError))
                        {
                            dt.Rows.Add(r);

                        }
                        else
                        {
                            sheet.Cells[i, endCol].Value = listError;
                        }
                    }

                    if(isError == true)
                    {
                        sheet.Cells[2, endCol].Value = "ERROR";
                        package.SaveAs(fileInfo);
                        return new ResultInfo(300, "Không thành công, lỗi trong file đính kèm. Vui lòng kiểm tra lại", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName));
                    }
                    else
                    {
                        if (dt.Rows.Count > 0)
                        {
                            int import = await Task.Run(() => _service.EmployeeShop_Import(dt, accId ?? AccountId, UserId));
                            if (import > 0)
                            {
                                return new ResultInfo(200, "Thành công: " + import.ToString(), ""); 
                            }
                            else return new ResultInfo(500, "Không thành công", "");
                        }
                        else
                        {
                            return new ResultInfo(500, "Không thành công", "");
                        }
                    }
                  
                }
                catch (Exception ex)
                {
                    return new ResultInfo(500, ex.Message, "");
                }
            }
        }
    }
}
