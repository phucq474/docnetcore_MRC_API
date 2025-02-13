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
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class SellInController : SpiralBaseController
    {
        private readonly ISellInService _service;
        private readonly IProductService _productService;
        private readonly IShopService _shopService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEmployeeService _employeeService;
        public SellInController(SellInContext context, IWebHostEnvironment webHost, ProductContext product, ShopContext shop, EmployeeContext employee)
        {
            _service = new SellInService(context);
            this._webHostEnvironment = webHost;
            _productService = new ProductService(product);
            _shopService = new ShopService(shop);
            _employeeService = new EmployeeService(employee);
        }

        [HttpPost("Filter")]
        public ActionResult<ResultInfo> Filter([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(accId ?? AccountId, UserId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No Data!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpGet("Detail")]
        public ActionResult<ResultInfo> GetDetail([FromHeader] int Id, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDetail(accId ?? AccountId, UserId, Id));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No Data!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Export")]
        public ActionResult<ResultInfo> Export([FromBody] string JsonData, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/SellIn";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"SellIn Report_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_SellIn.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = Task.Run(() => _service.Export(accId ?? AccountId, UserId, JsonData)).Result)
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["SellIn"];

                            sheet.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);

                            ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Cells[4, sheet.Dimension.End.Column - 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet.Column(3).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet.Column(5).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Shop List");

                            sheet.Cells[2, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Product List");

                            sheet.Cells[2, 1].LoadFromDataTable(data.Tables[2], true);

                            ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#F4B084", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        pk.Save();
                        return (new ResultInfo(200, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpGet("Template")]
        public ActionResult<ResultInfo> Template([FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/SellIn";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template SellIn Report_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_SellIn.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = Task.Run(() => _service.Export(accId ?? AccountId, UserId, null)).Result)
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Shop List");

                            sheet.Cells[2, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Product List");

                            sheet.Cells[2, 1].LoadFromDataTable(data.Tables[2], true);

                            ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#F4B084", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        pk.Save();
                        return (new ResultInfo(200, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public class SellInModel
        {
            public int Year { get; set; }
            public int Week { get; set; }
            public string SellInDate { get; set; }
            public string ShopCode { get; set; }
            public int? ProductId { get; set; }
            public int Quantity { get; set; }
            public double Price { get; set; }

        }
        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
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
                        if (package != null && package.Workbook.Worksheets["SellIn"] != null)
                        {
                            try
                            {
                                List<SellInModel> dataImport = new List<SellInModel>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["SellIn"];

                                List<ProductModel> productList = _productService.GetList(accId ?? AccountId);
                                List<ShopsEntity> shopList = _shopService.GetList(accId ?? AccountId);

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        SellInModel item = new SellInModel();

                                        var Year = sheet.Cells[row, 1].Value;
                                        var SellInDate = sheet.Cells[row, 2].Value;
                                        var ShopCode = sheet.Cells[row, 3].Value;
                                        var ShopName = sheet.Cells[row, 4].Value;
                                        var ProductCode = sheet.Cells[row, 5].Value;
                                        var ProductName = sheet.Cells[row, 6].Value;
                                        var Quantity = sheet.Cells[row, 7].Value;
                                        var Price = sheet.Cells[row, 8].Value;

                                        if (!string.IsNullOrEmpty(Convert.ToString(Year)) && !string.IsNullOrWhiteSpace(Convert.ToString(Year)))
                                        {
                                            item.Year = Convert.ToInt32(Year);
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "Year: không được trống - Cell[" + row + ",1]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(SellInDate)) && Convert.ToString(SellInDate).Length != 10)
                                        {
                                            return new ResultInfo(0, "SellInDate: không đúng định dạng (yyyy-MM-dd) - Cell[" + row + ",2]", "");
                                        }
                                        else
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(SellInDate)) && Convert.ToString(SellInDate).Length == 10)
                                            {
                                                item.SellInDate = Convert.ToString(SellInDate);
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "SellInDate: không được để trống (yyyy-MM-dd) - Cell[" + row + ",2]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ShopCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(ShopCode)))
                                        {
                                            var tmp = shopList.Where(p => p.ShopCode == Convert.ToString(ShopCode)).FirstOrDefault();
                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "ShopCode: không tồn tại - Cell[" + row + ",3]", "");
                                            }
                                            else
                                            {
                                                item.ShopCode = tmp.ShopCode;
                                            }
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "ShopCode: không được trống - Cell[" + row + ",3]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ProductCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(ProductCode)))
                                        {
                                            var tmp = productList.Where(p => p.ProductCode == Convert.ToString(ProductCode)).FirstOrDefault();
                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "ProductCode: không tồn tại - Cell[" + row + ",5]", "");
                                            }
                                            else
                                            {
                                                item.ProductId = tmp.Id;
                                            }
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "ProductCode: không được trống - Cell[" + row + ",5]", "");
                                        }


                                        if (!string.IsNullOrEmpty(Convert.ToString(Quantity)) && !string.IsNullOrWhiteSpace(Convert.ToString(Quantity)))
                                        {
                                            item.Quantity = Convert.ToInt32(Quantity);
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "Quantity: không được trống - Cell[" + row + ",1]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Price)) && !string.IsNullOrWhiteSpace(Convert.ToString(Price)))
                                        {
                                            item.Price = Convert.ToInt32(Price);
                                        }

                                        dataImport.Add(item);
                                    }
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(accId ?? AccountId, UserId, json));
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
