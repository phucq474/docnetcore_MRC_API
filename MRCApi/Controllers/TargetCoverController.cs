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

namespace MRCApi.Controllers
{
    public class TargetCoverController : SpiralBaseController
    {
        public readonly ITargetCoverService _service;
        public readonly IEmployeeService _employeeSerivce;
        public readonly IShopService _shopService;
        IWebHostEnvironment _FRoot;
        public TargetCoverController(TargetCoverContext _context, IWebHostEnvironment _hosting, EmployeeContext _employeeContext, ShopContext _shopContext)
        {
            _service = new TargetCoverService(_context);
            _FRoot = _hosting;
            _employeeSerivce = new EmployeeService(_employeeContext);
            _shopService = new ShopService(_shopContext);
        }
        [HttpPost("Filter")]
        public async Task<ResultInfo> Filter([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, UserId, JsonData));
                if(data.Result.Rows.Count > 0)
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

        [HttpPost("Update")]
        public async Task<ResultInfo> Update([FromBody] string JsonData)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Update(AccountId, UserId, JsonData));
                if (data.Result > 0)
                {
                    return new ResultInfo(200, "Update Successfully!", null);
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
        public async Task<ResultInfo> Delete([FromHeader] int Id)
        {
            try
            {
                var data = await _service.Delete(AccountId, UserId, Id);
                if(data > 0)
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
            string folder = _FRoot.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Report Target Cover_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Target_Cover.xlsx"));

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
                            var sheet1 = package.Workbook.Worksheets["Target"];
                            sheet1.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);
                            ExcelFormats.Border(sheet1, 4, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column);
                            sheet1.Cells[4, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column].AutoFitColumns();
                            sheet1.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(4).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(6).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(7).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(9).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(10).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(11).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["Employee"];
                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet2.Column(3).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet2.Column(5).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet2.Column(7).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

                        }
                        // sheet 3
                        //if (data.Tables[2].Rows.Count > 0)
                        //{
                        //    var sheet3 = package.Workbook.Worksheets["Shop"];
                        //    sheet3.Cells[2, 2].LoadFromDataTable(data.Tables[2], true);
                        //    ExcelFormats.FormatCell(sheet3.Cells[2, 2, 2, sheet3.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                        //    ExcelFormats.Border(sheet3, 2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column);
                        //    sheet3.Cells[2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column].AutoFitColumns();
                        //    sheet3.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        //    sheet3.Column(3).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        //}

                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
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
            string fileName = $"Report Target Cover_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Target_Cover.xlsx"));

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
                            var sheet2 = package.Workbook.Worksheets["Employee"];
                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet2.Column(3).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet2.Column(5).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet2.Column(7).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

                        }
                        // sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["Shop"];
                            sheet3.Cells[2, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet3.Cells[2, 2, 2, sheet3.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet3, 2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column);
                            sheet3.Cells[2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column].AutoFitColumns();
                            sheet3.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet3.Column(3).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        public class TargetCoverModel
        {
            public int EmployeeId { get; set; }
            public int ShopId { get; set; }
            public int Target { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] string accountName)
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
                        if (package != null && package.Workbook.Worksheets["Target"] != null)
                        {
                            try
                            {
                                List<TargetCoverModel> dataImport = new List<TargetCoverModel>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["Target"];

                                List<ShopsEntity> lstShop = _shopService.GetList(AccountId);
                                List<EmployeesEntity> lstEmployee = _employeeSerivce.GetList(AccountId);

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        TargetCoverModel item = new TargetCoverModel();
                                        //var SupplierCode = sheet.Cells[row, 2].Value;
                                        var EmployeeCode = sheet.Cells[row, 4].Value;
                                        //var ShopCode = sheet.Cells[row, 7].Value;
                                        var Target = sheet.Cells[row, 6].Value;
                                        var FromDate = sheet.Cells[row, 7].Value;
                                        var ToDate = sheet.Cells[row, 8].Value;

                                        if (string.IsNullOrEmpty(Convert.ToString(EmployeeCode)))
                                        {
                                            return new ResultInfo(0, "EmployeeCode: không được để trống - Cell[" + row + ",4]", "");
                                        }

                                        //if (string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                                        //{
                                        //    return new ResultInfo(0, "ShopCode: không được để trống - Cell[" + row + ",7]", "");
                                        //}

                                        if (!string.IsNullOrEmpty(Convert.ToString(FromDate)) && Convert.ToString(FromDate).Length != 10)
                                        {
                                            {
                                                return new ResultInfo(0, "FromDate: không đúng định dạng (yyyy-MM-dd) - Cell[" + row + ",7]", "");
                                            }
                                        }else if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(0, "FromDate: không được để trống - Cell[" + row + ",7]", "");
                                        }


                                        if (!string.IsNullOrEmpty(Convert.ToString(EmployeeCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(EmployeeCode)))
                                        {
                                            var tmp = lstEmployee.Where(p => p.EmployeeCode == Convert.ToString(EmployeeCode)).FirstOrDefault();

                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "EmployeeCode: không tồn tại - Cell[" + row + ",4]", "");
                                            }
                                            else
                                            {
                                                item.EmployeeId = tmp.Id;
                                            }
                                        }

                                        //if (!string.IsNullOrEmpty(Convert.ToString(ShopCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(ShopCode)))
                                        //{
                                        //    var tmp = lstShop.Where(p => p.ShopCode == Convert.ToString(ShopCode)).FirstOrDefault();
                                        //    if (tmp == null)
                                        //    {
                                        //        return new ResultInfo(0, "ShopCode: không tồn tại - Cell[" + row + ",7]", "");
                                        //    }
                                        //    else
                                        //    {
                                        //        item.ShopId = tmp.Id;
                                        //    }
                                        //}

                                        // add
                                        if (!string.IsNullOrEmpty(Convert.ToString(Target)))
                                        {
                                            item.Target = Convert.ToInt32(Target);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            item.FromDate = Convert.ToString(FromDate);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)) && Convert.ToString(ToDate).Length != 10)
                                        {
                                            return new ResultInfo(0, "ToDate: không đúng định dạng (yyyy-MM-dd) - Cell[" + row + ",8]", "");

                                        }
                                        else
                                        {
                                            item.ToDate = Convert.ToString(ToDate);
                                        }

                                        dataImport.Add(item);
                                    }

                                
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(AccountId, UserId, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} dòng", dataImport.Count), "");
                                        }
                                    }
                                }
                                return new ResultInfo(0, "Dữ liệu rỗng", "");
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
    }
}
