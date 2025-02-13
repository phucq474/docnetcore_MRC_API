using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
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
    public class ProductController : SpiralBaseController
    {
        public readonly IProductService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IProductCategoriesService _productCategories;

        public ProductController(ProductContext _productContext, IWebHostEnvironment hostingEnvironment, ProductCategoriesContext productCategories)
        {
            _service = new ProductService(_productContext);
            _productCategories = new ProductCategoriesService(productCategories);
            this._hostingEnvironment = hostingEnvironment;
        }

        [HttpGet("GetList")]
        public ActionResult<List<ProductModel>> GetList()
        {
            List<ProductModel> data = _service.GetList(AccountId);
            return data;
        }

        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }

        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }

        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/Product";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Danh sach san pham _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Products.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet1 = package.Workbook.Worksheets["DS Sản phẩm"];
                            sheet1.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                            ExcelFormats.FormatCell(sheet1.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#4472C4", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet1, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }
                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["DS Ngành SP"];
                            sheet2.Cells[3, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[3, 2, 3, data.Tables[1].Columns.Count + 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet2, 3, 2, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count + 1);
                        }
                        // sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["DS Loại SP"];
                            sheet3.Cells[3, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet3.Cells[3, 2, 3, data.Tables[2].Columns.Count + 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                            sheet3.Cells.AutoFitColumns();
                            ExcelFormats.Border(sheet3, 3, 2, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count + 1);
                        }
                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template()
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/Product";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Dang ky Danh sach san pham_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Products.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, null)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet1 = package.Workbook.Worksheets["DS Sản phẩm"];
                        sheet1.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                        ExcelFormats.FormatCell(sheet1.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#4472C4", true, ExcelHorizontalAlignment.Center);

                        ExcelFormats.Border(sheet1, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);

                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["DS Ngành SP"];
                            sheet2.Cells[3, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[3, 2, 3, data.Tables[1].Columns.Count + 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet2, 3, 2, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count + 1);
                        }
                        // sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["DS Loại SP"];
                            sheet3.Cells[3, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet3.Cells[3, 2, 3, data.Tables[2].Columns.Count + 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                            sheet3.Cells.AutoFitColumns();
                            ExcelFormats.Border(sheet3, 3, 2, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count + 1);
                        }
                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        public class Product_Import
        {
            public string ProductCode { get; set; }
            public string ProductName { get; set; }
            public decimal? Price { get; set; }
            public string Barcode { get; set; }
            public string BarrelBarcode { get; set; }
            public int? BarrelSize { get; set; }
            public string Unit { get; set; }
            public string Status { get; set; }
            public int? OrderBy { get; set; }
            public int? CategoryId { get; set; }
            public int TypeId { get; set; }
            public string ProductNameVN { get; set; }
        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile)
        {
            string folder = _hostingEnvironment.WebRootPath;
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
                        if (package != null && package.Workbook.Worksheets["DS Sản phẩm"] != null)
                        {
                            try
                            {
                                List<Product_Import> dataImport = new List<Product_Import>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["DS Sản phẩm"];

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        Product_Import item = new Product_Import();
                                        var ProductCode = sheet.Cells[row, 2].Value;
                                        var ProductName = sheet.Cells[row, 3].Value;
                                        var Price = sheet.Cells[row, 4].Value;
                                        var Barcode = sheet.Cells[row, 5].Value;
                                        var BarrelBarcode = sheet.Cells[row, 6].Value;
                                        var BarrelSize = sheet.Cells[row, 7].Value;
                                        var Unit = sheet.Cells[row, 8].Value;
                                        var Status = sheet.Cells[row, 9].Value;
                                        var OrderBy = sheet.Cells[row, 10].Value;
                                        var CategoryId = sheet.Cells[row, 11].Value;
                                        var TypeId = sheet.Cells[row, 15].Value;
                                        #region check

                                        List<ProductCategoriesEntity> listCategory = _productCategories.GetList(AccountId);

                                        if (string.IsNullOrEmpty(Convert.ToString(ProductCode)))
                                        {
                                            return new ResultInfo(0, "Mã sản phẩm không được để trống - Cell[" + row + ",2]", "");
                                        }
                                        else
                                        {
                                            item.ProductCode = Convert.ToString(ProductCode);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ProductName)))
                                        {
                                            return new ResultInfo(0, "Tên sản phẩm không được để trống - Cell[" + row + ",3]", "");
                                        }
                                        else
                                        {
                                            item.ProductName = FileExtends.boDau(Convert.ToString(ProductName));
                                            item.ProductNameVN = Convert.ToString(ProductName);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(CategoryId)))
                                        {
                                            var category = listCategory.Where(p => p.Id == Convert.ToInt32(CategoryId));
                                            if (category != null)
                                            {
                                                item.CategoryId = Convert.ToInt32(CategoryId);
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "ID Category không tồn tại - Cell[" + row + ",11]", "");
                                            }
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "ID Category không được để trống - Cell[" + row + ",11]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(TypeId)))
                                        {
                                            item.TypeId = Convert.ToInt32(TypeId);
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "Mã loại SP(kiểu number) không được để trống - Cell[" + row + ",15]", "");
                                        }
                                        #endregion check

                                        if (!string.IsNullOrEmpty(Convert.ToString(Price)))
                                        {
                                            item.Price = Convert.ToDecimal(Price);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Barcode)))
                                        {
                                            item.Barcode = Convert.ToString(Barcode);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(BarrelBarcode)))
                                        {
                                            item.BarrelBarcode = Convert.ToString(BarrelBarcode);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(BarrelSize)))
                                        {
                                            item.BarrelSize = Convert.ToInt32(BarrelSize);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Unit)))
                                        {
                                            item.Unit = Convert.ToString(Unit);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(OrderBy)))
                                        {
                                            item.OrderBy = Convert.ToInt32(OrderBy);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Status)))
                                        {
                                            item.Status = Convert.ToString(Status);
                                        }

                                        dataImport.Add(item);
                                    }
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(AccountId, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} dòng", dataImport.Count), "");
                                        }
                                    }
                                }
                                return new ResultInfo(0, "Dữ liệu trống", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), "");
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "Dữ liệu trống", "");
        }

        [HttpGet("ListProductType")]
        public ActionResult<DataTable> GetListProductType()
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetListProductType(AccountId));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
    }
}