using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;
using SpiralEntity.Models;

namespace MRCApi.Controllers
{
    public class ProductPriceController : SpiralBaseController
    {
        private readonly IProductPriceService _service;
        private readonly IProductService _productService;
        //private readonly ICustomersService _customersService;
        //private readonly IShopService _shopService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProductPriceController(ProductPriceContext context, ProductContext productContext, IWebHostEnvironment webHost)
        {
            _service = new ProductPriceService(context);
            _productService = new ProductService(productContext);
            this._webHostEnvironment = webHost;
        }

        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(JsonData, AccountId));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
                return BadRequest(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
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
                return BadRequest(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Update([FromHeader] int id)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Delete(id));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(1, "Xóa thành công", "");
                }
                return new ResultInfo(0, "Xóa thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(0, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("Save")]
        public ActionResult<DataTable> Save([FromHeader] string Action, [FromBody]  string JsonData) 
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Save(Action, JsonData, AccountId));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest(-1);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] string AccountName)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/Product";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Danh sách Giá sản phẩm _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ProductPrice.xlsx"));
            if(AccountName == "Fonterra")
            {
                fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ProductPrice_FTR.xlsx"));
            }
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, JsonData)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["Giá SP"];
                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#4472C4", true, ExcelHorizontalAlignment.Center);
                           
                            ExcelFormats.Border(sheet, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);

                            if(AccountName == "Fonterra")
                            {
                                sheet.Cells[4, 7 , sheet.Dimension.End.Row, sheet.Dimension.Columns].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            }
                            else
                            {
                                sheet.Cells[4, 7, sheet.Dimension.Rows, sheet.Dimension.Columns].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            }
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["DS Sản phẩm"];
                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 1, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count);
                        }

                        pk.Save();
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template([FromHeader] string AccountName)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/Product";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Đăng ký Giá sản phẩm _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ProductPrice.xlsx"));
            if (AccountName == "Fonterra")
            {
                fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ProductPrice_FTR.xlsx"));
            }
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, null)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        var sheet = pk.Workbook.Worksheets["Giá SP"];
                        sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                        ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#4472C4", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);
  
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet1 = pk.Workbook.Worksheets["DS Sản phẩm"];
                            sheet1.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet1.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet1, 3, 1, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count);
                        }

                        pk.Save();
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        public class ProductPrice_Import
        {
            //public int? CustomerId { get; set; }
            //public int? ShopId { get; set; }
            public int? ProductId { get; set; }
            public decimal? Price { get; set; }
            public decimal? BarrelPrice { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public int? RecommendShelfPrice { get; set; }
            public int RetailerPrice { get; set; }
            public int? RetailerPriceNonVAT { get; set; }

        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] string AccountName)
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
                        var listProduct = _productService.GetList(AccountId);
                        //var listCustomers = _customersService.GetList(AccountId);
                        //var listShop = _shopService.GetList(AccountId);
                        List<ProductPrice_Import> data_Import= new List<ProductPrice_Import>();
                        if (package != null && package.Workbook.Worksheets["Giá SP"] != null)
                        {
                            try
                            {
                                ExcelWorksheet sheet = package.Workbook.Worksheets["Giá SP"];
                                if (sheet != null)
                                {
                                    // Check data input
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        //var CustomerCode = sheet.Cells[row, 3].Value;
                                        //var ShopCode = sheet.Cells[row, 5].Value;
                                        var ProductCode = sheet.Cells[row, 5].Value;
                                        var Price = sheet.Cells[row, 7].Value;
                                        var BarrelPrice = sheet.Cells[row, 8].Value;
                                        var FromDate = sheet.Cells[row, 9].Value;
                                        var ToDate = sheet.Cells[row, 10].Value;

                                        var RecommendShelfPrice = Price;
                                        var RetailerPrice = Price; 
                                        var RetailerPriceNonVAT = Price;

                                        if (AccountName == "Fonterra")
                                        {
                                            RecommendShelfPrice = sheet.Cells[row, 7].Value;
                                            RetailerPrice = sheet.Cells[row, 8].Value;
                                            RetailerPriceNonVAT = sheet.Cells[row, 9].Value;
                                            BarrelPrice = sheet.Cells[row, 10].Value;
                                            FromDate = sheet.Cells[row, 11].Value;
                                            ToDate = sheet.Cells[row, 12].Value;
                                        }

                                        ProductPrice_Import item = new ProductPrice_Import();

                                        //if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode)))
                                        //{
                                        //    var checkCustomer = listCustomers.Where(c => c.CustomerCode == Convert.ToString(CustomerCode)).FirstOrDefault();
                                        //    if (checkCustomer != null)
                                        //    {
                                        //        item.CustomerId = checkCustomer.Id;
                                        //    }
                                        //    else
                                        //    {
                                        //        return new ResultInfo(0, "Mã Khách hàng : không tồn tại - Cell[" + row + ", 3]", "");
                                        //    }

                                        //}
                                        //else
                                        //{
                                        //    return new ResultInfo(0, "Mã Khách hàng : không được để trống - Cell[" + row + ", 3]", "");
                                        //}
                                        //if (!string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                                        //{
                                        //    var checkShop  = listShop.Where(s => s.ShopCode ==  Convert.ToString(ShopCode)).FirstOrDefault();
                                        //    if (checkShop != null)
                                        //    {
                                        //        item.CustomerId = checkShop.Id;
                                        //    }
                                        //    else
                                        //    {
                                        //        return new ResultInfo(0, "Mã Cửa Hàng : không tồn tại - Cell[" + row + ", 5]", "");
                                        //    }

                                        //}
                                        //else
                                        //{
                                        //    return new ResultInfo(0, "Mã Cửa Hàng : không được để trống - Cell[" + row + ", 5]", "");
                                        //}

                                        if (!string.IsNullOrEmpty(Convert.ToString(ProductCode)))
                                        {
                                            var checkPro = listProduct.Where(p => p.ProductCode == Convert.ToString(ProductCode)).FirstOrDefault();
                                            if (checkPro != null)
                                            {
                                                item.ProductId = checkPro.Id;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Sản phẩm : không tồn tại - Cell[" + row + ", 5]", "");
                                            }

                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "Mã Sản phẩm : không được để trống - Cell[" + row + ", 5]", "");
                                        }

                                        if (AccountName == "Fonterra")
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(RetailerPrice)))
                                            {
                                                item.RetailerPrice = Convert.ToInt32(RetailerPrice);
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Giá Bán lẻ : không được để trống - Cell[" + row + ", 7]", "");
                                            }

                                            if (!string.IsNullOrEmpty(Convert.ToString(RecommendShelfPrice)))
                                            {
                                                item.RecommendShelfPrice = Convert.ToInt32(RecommendShelfPrice);
                                            }

                                            if (!string.IsNullOrEmpty(Convert.ToString(RetailerPriceNonVAT)))
                                            {
                                                item.RetailerPriceNonVAT = Convert.ToInt32(RetailerPriceNonVAT);
                                            }

                                            if (!string.IsNullOrEmpty(Convert.ToString(BarrelPrice)))
                                            {
                                                item.BarrelPrice = Convert.ToInt32(BarrelPrice);
                                            }
                                        }
                                        else
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(Price)))
                                            {
                                                item.Price = Convert.ToDecimal(Price);
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Giá/SP : không được để trống - Cell[" + row + ", 7]", "");
                                            }

                                            if (!string.IsNullOrEmpty(Convert.ToString(BarrelPrice)))
                                            {
                                                item.BarrelPrice = Convert.ToDecimal(BarrelPrice);
                                            }
                                        }

                                        
                                        DateTime checkDate;

                                        if (!string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(FromDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                if (AccountName == "Fonterra")
                                                {
                                                    return new ResultInfo(0, "Từ ngày : không đúng định dạng - Cell[" + row + ",11]", "");
                                                }
                                                else
                                                {
                                                    return new ResultInfo(0, "Từ ngày : không đúng định dạng - Cell[" + row + ",9]", "");
                                                }
                                                    
                                            }
                                            else
                                            {
                                                item.FromDate = Convert.ToString(FromDate);
                                            }
                                        }
                                        else
                                        {
                                            if (AccountName == "Fonterra")
                                                return new ResultInfo(0, "Từ ngày : không được để trống - Cell[" + row + ", 11]", "");
                                            else
                                                return new ResultInfo(0, "Từ ngày : không được để trống - Cell[" + row + ", 9]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(ToDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                if (AccountName == "Fonterra")
                                                    return new ResultInfo(0, "Đến ngày : không đúng định dạng - Cell[" + row + ",12]", "");
                                                else
                                                    return new ResultInfo(0, "Đến ngày : không đúng định dạng - Cell[" + row + ",10]", "");
                                            }
                                            else
                                            {
                                                item.ToDate = Convert.ToString(ToDate);
                                            }
                                        }
                                        data_Import.Add(item);
                                    }
                                }  
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), ex.StackTrace.ToString());
                            }
                        }

                        // Send data import
                        string json = null;
                        if (data_Import.Count > 0)
                        {
                            json = JsonConvert.SerializeObject(data_Import);

                        }
                        var Result = await Task.Run(() => _service.Import(AccountId, json));
                        if (Result > 0)
                        {
                            return new ResultInfo(1, string.Format("Import Thành công: {0} dòng", data_Import.Count), "");
                        }
                        else
                        {
                            return new ResultInfo(0, string.Format("Import Thất bại"), "");
                        }
                    }
                }
            }
            return new ResultInfo(0, "File rỗng", "");
        }
    }
}
