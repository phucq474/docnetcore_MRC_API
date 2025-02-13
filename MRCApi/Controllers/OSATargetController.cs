using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class OSATargetController : SpiralBaseController
    {
        private readonly IOSATargetService _service;
        private readonly ICustomersService _customersService;
        private readonly IProductService _productService;
        private readonly IShopService _shopService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public OSATargetController(OSATargetContext context, IWebHostEnvironment webHost, CustomersContext customers, ProductContext product, ShopContext shopContext)
        {
            _service = new OSATargetService(context);
            _customersService = new CustomersService(customers);
            _shopService = new ShopService(shopContext);
            _productService = new ProductService(product);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("GetList")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetList(accId ?? AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("GetDetail")]
        public ActionResult<DataTable> GetDetail([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDetail(JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/OSATarget";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"SKU Target_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_OSATarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(accId ?? AccountId, UserId, JsonData)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["Target"];

                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);


                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 7], "#9BC2E6", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 8, 3, data.Tables[0].Columns.Count], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);
                        }

                        if (data.Tables[1].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Customer"];

                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#9BC2E6", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 1, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Shop"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[2], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 2, 3, data.Tables[2].Columns.Count + 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 2, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count + 1);

                            sheet.Cells.AutoFitColumns(10);

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
        public async Task<ResultInfo> Template([FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/OSATarget";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"SKU Target_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_OSATarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(accId ?? AccountId, UserId, null)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["Target"];

                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);


                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 7], "#9BC2E6", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 8, 3, data.Tables[0].Columns.Count], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);
                        }

                        if (data.Tables[1].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Customer"];

                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#9BC2E6", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 1, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count);
                            sheet.Cells.AutoFitColumns(10);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Shop"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[2], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 2, 3, data.Tables[2].Columns.Count + 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(sheet, 3, 2, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count + 1);

                            sheet.Cells.AutoFitColumns(10);

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

        public class OSATarget
        {
            public int? ProductId { get; set; }
            public int? CustomerId { get; set; }
            public int? ShopId { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public int? Target { get; set; }

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
                        var listProduct = _productService.GetList(accId ?? AccountId);
                        var listCus = _customersService.GetList(accId ?? AccountId);
                        var lstShop = _shopService.GetList(accId ?? AccountId);
                        List<OSATarget> data_OSATarget = new List<OSATarget>();
                        if (package.Workbook.Worksheets["Target"] != null)
                        {
                            try
                            {
                                ExcelWorksheet sheet = package.Workbook.Worksheets["Target"];
                                if (sheet != null)
                                {
                                    // Check data input
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        var productCode = Convert.ToString(sheet.Cells[row, 4].Value);
                                        var fromDate = Convert.ToString(sheet.Cells[row, 6].Value);
                                        var toDate = Convert.ToString(sheet.Cells[row, 7].Value);
                                        var customerId = Convert.ToString(sheet.Cells[row, 8].Value);
                                        var shopCode = Convert.ToString(sheet.Cells[row, 10].Value);
                                        var value = Convert.ToString(sheet.Cells[row, 12].Value);

                                        if (!string.IsNullOrEmpty(value))
                                        {

                                            OSATarget item = new OSATarget();
                                            if (!string.IsNullOrEmpty(productCode))
                                            {
                                                var checkPro = listProduct.Where(p => p.ProductCode == productCode).FirstOrDefault();
                                                if (checkPro != null)
                                                {
                                                    item.ProductId = checkPro.Id;
                                                }
                                                else
                                                {
                                                    return new ResultInfo(0, "ProductCode : không tồn tại - Cell[" + row + ", 4]", "");
                                                }

                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "ProductCode : không được để trống - Cell[" + row + ", 4]", "");
                                            }

                                            if (!string.IsNullOrEmpty(customerId))
                                            {
                                                int tmpCus = 0;
                                                tmpCus = Convert.ToInt32(customerId);
                                                CustomersEntity check = listCus.Where(p => p.Id == tmpCus).FirstOrDefault();
                                                if (check != null)
                                                {
                                                    item.CustomerId = tmpCus;
                                                }
                                                else
                                                {
                                                    return new ResultInfo(0, "Id Chuỗi : không tồn tại - Cell[" + row + ", 8]", "");
                                                }
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Id Chuỗi : không được để trống - Cell[" + row + ", 8]", "");
                                            }
                                            if (!string.IsNullOrEmpty(shopCode))
                                            {
                                                ShopsEntity check = lstShop.Where(p => p.ShopCode == shopCode).FirstOrDefault();
                                                if (check != null)
                                                {
                                                    item.ShopId = check.Id;
                                                }
                                                else
                                                {
                                                    return new ResultInfo(0, "ShopCode : không tồn tại - Cell[" + row + ", 10]", "");
                                                }
                                            }

                                            DateTime checkDate;

                                            if (!string.IsNullOrEmpty(Convert.ToString(fromDate)))
                                            {
                                                if (!DateTime.TryParseExact(Convert.ToString(fromDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                                {
                                                    return new ResultInfo(0, "FromDate : không đúng định dạng - Cell[" + row + ",6]", "");
                                                }
                                                else
                                                {
                                                    item.FromDate = Convert.ToString(fromDate);
                                                }
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "ToDate : không được để trống - Cell[" + row + ", 6]", "");
                                            }

                                            if (!string.IsNullOrEmpty(Convert.ToString(toDate)))
                                            {
                                                if (!DateTime.TryParseExact(Convert.ToString(toDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                                {
                                                    return new ResultInfo(0, "ToDate : không đúng định dạng - Cell[" + row + ",7]", "");
                                                }
                                                else
                                                {
                                                    item.ToDate = Convert.ToString(toDate);
                                                }
                                            }
                                            item.Target = Convert.ToInt32(value);
                                            data_OSATarget.Add(item);


                                        }
                                    }
                                }
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), ex.StackTrace.ToString());
                            }
                        }
                        var Result = await Task.Run(() => _service.Import(accId ?? AccountId, UserId, JsonConvert.SerializeObject(data_OSATarget)));
                        if (Result > 0)
                        {
                            return new ResultInfo(1, string.Format("Import Thành công: {0} dòng Target", data_OSATarget.Count), "");
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
    }
}
