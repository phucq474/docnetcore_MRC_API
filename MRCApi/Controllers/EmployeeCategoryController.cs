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
    public class EmployeeCategoryController : SpiralBaseController 
    {
        public readonly IEmployeeCategoryService _service;
        public readonly IEmployeeService _employeeService;
        public readonly IProductCategoriesService _productCategoriesService;
        public readonly IWebHostEnvironment _webHostEnvironment;
        public EmployeeCategoryController (EmployeeCategoryContext employeeCategoryContext, IWebHostEnvironment webHost, EmployeeContext employeeContext, ProductCategoriesContext productCategoriesContext)
        {
            _service = new EmployeeCategoryService (employeeCategoryContext);
            _employeeService = new EmployeeService (employeeContext);
            _productCategoriesService = new ProductCategoriesService (productCategoriesContext);
            this._webHostEnvironment = webHost;
        }
        [HttpPost("Filter")]
        public ActionResult<ResultInfo> Filter([FromBody] string jsonData, [FromHeader] int? accId)
        {
            try
            {
                DataTable data = Task.Run(() => _service.Filter(accId ?? AccountId, UserId, jsonData)).Result;
                if(data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", "", data);
                }
                else
                {
                    return new ResultInfo(500, "Không có dữ liệu", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace );
            }
        }
        [HttpPost("Save")]
        public ActionResult<ResultInfo> Save([FromBody] string jsonData, [FromHeader] int? accId)
        {
            try
            {
                DataTable data = Task.Run(() => _service.Save(accId ?? AccountId, UserId, jsonData)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", "", data);
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] int id, [FromHeader] int? accId)
        {
            try
            {
                int data = Task.Run(() => _service.Delete(accId ?? AccountId, UserId, id)).Result;
                if (data > 0)
                {
                    return new ResultInfo(200, "Thành công", "");
                }
                else
                {
                    return new ResultInfo(500, "Thất bại", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Export")]
        public ActionResult<ResultInfo> Export([FromBody] string jsonData, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"EmployeeCategory_RawData_{AccountId.ToString()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_EmployeeCategory.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var package = new ExcelPackage(file))
                {
                    var sheet = package.Workbook.Worksheets["EmployeeCategory"];
                    if (sheet != null)
                    {
                        DataSet data = Task.Run(() => _service.Template(accId ?? AccountId, UserId, jsonData)).Result;
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            sheet.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);
                            ExcelFormats.Border(sheet,4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                        else
                        {
                            return (new ResultInfo(0, "No data", null));
                        }
                    }
                    package.Save();
                    return (new ResultInfo(200, "Xuất file thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                }
            }
            catch (Exception ex)
            {
                return (new ResultInfo(500, ex.Message, null));
            }
        }
        [HttpPost("Template")]
        public ActionResult<ResultInfo> Template([FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template_EmployeeCategory_{AccountId.ToString()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_EmployeeCategory.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var package = new ExcelPackage(file))
                {
                    
                    DataSet data = Task.Run(() => _service.Template(accId ?? AccountId, UserId, null)).Result;

                    if (data.Tables[1].Rows.Count > 0)
                    {
                        DataTable dt = data.Tables[1];
                        var sheet = package.Workbook.Worksheets.Add("Employee list");
                        sheet.Cells[2, 1].LoadFromDataTable(dt, true);
                        sheet.Row(2).Height = 25;
                        ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#7AD6EC", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        sheet.Cells.AutoFitColumns(9);
                    }

                    if (data.Tables[2].Rows.Count > 0)
                    {
                        DataTable dt = data.Tables[2];
                        var sheet = package.Workbook.Worksheets.Add("Category");
                        sheet.Cells[2, 1].LoadFromDataTable(dt, true);
                        sheet.Row(2).Height = 25;
                        ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#FFD966", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        sheet.Cells.AutoFitColumns(9);
                    }

                    package.Save();
                    return (new ResultInfo(200, "Xuất template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                }
            }
            catch (Exception ex)
            {
                return (new ResultInfo(500, ex.Message, null));
            }
        }
        [HttpPost("Import")]
        public ActionResult<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            if (ifile != null && ifile.Files.Count > 0)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    file.CopyTo(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage packpage = new ExcelPackage(memoryStream))
                    {
                        if (packpage != null && packpage.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                List<EmployeeCategoryModel> dataImport = new List<EmployeeCategoryModel>();
                                List<EmployeesEntity> listEmployeeCode = _employeeService.GetAll(accId ?? AccountId);
                                List<ProductCategoriesEntity> listCategory = _productCategoriesService.GetList(accId ?? AccountId);
                                ExcelWorksheet sheet = packpage.Workbook.Worksheets["EmployeeCategory"];

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        EmployeeCategoryModel item = new EmployeeCategoryModel();
                                        var EmployeeCode = sheet.Cells[row, 4].Value;
                                        var CategoryCode = sheet.Cells[row, 7].Value;
                                        var FromDate = sheet.Cells[row, 9].Value; 
                                        var ToDate = sheet.Cells[row, 10].Value;
 
                                        if (!string.IsNullOrEmpty(Convert.ToString(EmployeeCode)))
                                        {
                                            var tmpEm = listEmployeeCode.Where(p => p.EmployeeCode == Convert.ToString(EmployeeCode)).FirstOrDefault();
                                            if (tmpEm == null)
                                            {
                                                return new ResultInfo(-1, "EmployeeCode không tồn tại. (Row: " + row + " Colum: 4)", null);
                                            }
                                            else
                                            {
                                                item.employeeId = tmpEm.Id;
                                            }
                                        }
                                        else
                                        {
                                            return new ResultInfo(-1, "EmployeeCode không được để trống. (Row: " + row + " Colum: 4)", null);
                                        }
                                       
                                        if (!string.IsNullOrEmpty(Convert.ToString(CategoryCode)))
                                        {
                                            var tmpCat = listCategory.Where(p => p.DivisionId == Convert.ToInt32(CategoryCode)).FirstOrDefault();
                                            if(tmpCat == null)
                                            {
                                                return new ResultInfo(-1, "ID Category không tòn tại. (Row: " + row + " Colum: 7)", null);
                                            }
                                            else
                                            {
                                                item.categoryId = tmpCat.DivisionId;
                                            }

                                        }
                                        else
                                        {
                                            return new ResultInfo(-1, "ID Category không được để trống. (Row: " + row + " Colum: 7)", null);

                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(-1, "FromDate không được để trống. (Row: " + row + " Colum: 9)", null);

                                        }
                                        else
                                        {
                                            item.fromDate = Convert.ToInt32(Convert.ToString(FromDate).Replace("-", ""));
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {
                                            item.toDate = Convert.ToInt32(Convert.ToString(ToDate).Replace("-", ""));
                                        }
                                       
                                        dataImport.Add(item);
                                    }
                                    if (dataImport.Count > 0)
                                    {
                                        string jsonImport = JsonConvert.SerializeObject(dataImport);
                                        var value = Task.Run(() => _service.Import(accId ?? AccountId, UserId, jsonImport)).Result;
                                        if (value > 0)
                                        {
                                            return new ResultInfo(200, "Import data success", null);
                                        }

                                    }
                                }

                                return (new ResultInfo(-1, "Data is empty", null));

                            }
                            catch (Exception ex)
                            {
                                return (new ResultInfo(-2, ex.Message, null));
                            }
                        }
                    }
                }
                return (new ResultInfo(-1, "Data is empty", null));

            }
            else
            {
                return (new ResultInfo(-1, "File not found", null));
            }
        }

    }
}
