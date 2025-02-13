using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using SpiralData;
using SpiralService;
using System.Threading.Tasks;
using System;
using System.Data;
using OfficeOpenXml;
using static iText.StyledXmlParser.Jsoup.Select.Evaluator;
using System.IO;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using SpiralEntity;
using static MRCApi.Controllers.TargetCoverController;
using System.Collections.Generic;
using System.Linq;
using SpiralEntity.Models;

namespace MRCApi.Controllers
{
    public class ShopByCustomerController : SpiralBaseController
    {
        private readonly IShopByCustomerService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IShopService _shopService;
        private readonly ICustomersService _customersService;
        public ShopByCustomerController(ShopByCustomerContext context,IWebHostEnvironment webHost, ShopContext shopContext, CustomersContext customersContext)
        {
            _service = new ShopByCustomerService(context);
            this._webHostEnvironment = webHost;
            _shopService = new ShopService(shopContext);
            _customersService = new CustomersService(customersContext);
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
                Task<int> data = Task.Run(() => _service.Delete(AccountId, UserId, ListId));

                return new ResultInfo(200, "Delete Successfully!", null);

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
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Shop Permission By Customer_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Shop_By_Customer.xlsx"));

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
                            var sheet1 = package.Workbook.Worksheets["ShopByCustomer"];
                            sheet1.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);
                            sheet1.Cells[2, 3].Value = dataJson.fromdate.ToString();
                            sheet1.Cells[2, 5].Value = dataJson.todate.ToString();
                            ExcelFormats.Border(sheet1, 4, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column);
                            sheet1.Cells[4, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column].AutoFitColumns();
                            sheet1.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            sheet1.Cells[4, sheet1.Dimension.End.Column - 2, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                        }
                        else
                        {
                            return new ResultInfo(500, "Không có dữ liệu", "");
                        }

                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["Shop"];
                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

                        }

                        //sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["Customer"];
                            sheet3.Cells[2, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet3.Cells[2, 2, 2, sheet3.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet3, 2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column);
                            sheet3.Cells[2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column].AutoFitColumns();
                            sheet3.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
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
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template Shop Permission By Customer_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Shop_By_Customer.xlsx"));

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
                            var sheet2 = package.Workbook.Worksheets["Shop"];
                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;

                        }

                        //sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["Customer"];
                            sheet3.Cells[2, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet3.Cells[2, 2, 2, sheet3.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet3, 2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column);
                            sheet3.Cells[2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column].AutoFitColumns();
                            sheet3.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
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

        public class ShopByCustomerModel
        {
            public int ShopId { get; set; }
            public int CustomerId { get; set; }
            public int FromDate { get; set; }
            public int ToDate { get; set; }
            public int IsDelete { get; set; }
            public int Id { get; set; }

        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile)
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
                        if (package != null && package.Workbook.Worksheets["ShopByCustomer"] != null)
                        {
                            try
                            {
                                List<ShopByCustomerModel> dataImport = new List<ShopByCustomerModel>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["ShopByCustomer"];

                                List<ShopsEntity> lstShop = _shopService.GetList(AccountId);
                                List<CustomersEntity> lstCustomer = _customersService.GetList(AccountId);

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        ShopByCustomerModel item = new ShopByCustomerModel();

                                        var Id = sheet.Cells[row, 2].Value;
                                        var ShopCode = sheet.Cells[row, 4].Value;
                                        var CustomerCode = sheet.Cells[row, 6].Value;
                                        var AccountCode = sheet.Cells[row, 8].Value;
                                        var FromDate = sheet.Cells[row, 10].Value;
                                        var ToDate = sheet.Cells[row, 11].Value;
                                        var IsDelete = sheet.Cells[row, 12].Value;

                                        if (string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                                        {
                                            return new ResultInfo(0, "ShopCode: không được để trống - Cell[" + row + ",2]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(CustomerCode)))
                                        {
                                            return new ResultInfo(0, "CustomerCode: không được để trống - Cell[" + row + ",6]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(AccountCode)))
                                        {
                                            return new ResultInfo(0, "AccountCode: không được để trống - Cell[" + row + ",8]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(FromDate)) && Convert.ToString(FromDate).Length != 10)
                                        {
                                            {
                                                return new ResultInfo(0, "FromDate: không đúng định dạng (yyyy-MM-dd) - Cell[" + row + ",10]", "");
                                            }
                                        }
                                        else if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(0, "FromDate: không được để trống - Cell[" + row + ",10]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Id)) && !string.IsNullOrWhiteSpace(Convert.ToString(Id)))
                                        {
                                            item.Id = Convert.ToInt32(Id);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ShopCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(ShopCode)))
                                        {
                                            var tmp = lstShop.Where(p => p.ShopCode == Convert.ToString(ShopCode)).FirstOrDefault();

                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "ShopCode: không tồn tại - Cell[" + row + ",4]", "");
                                            }
                                            else
                                            {
                                                item.ShopId = tmp.Id;
                                            }
                                        }


                                        if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(CustomerCode)))
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(AccountCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(AccountCode))) {
                                                var tmp = lstCustomer.Where(p => p.CustomerCode == Convert.ToString(CustomerCode).Trim() 
                                                                        && p.AccountCode == Convert.ToString(AccountCode).Trim()).FirstOrDefault();

                                                if (tmp == null)
                                                {
                                                    return new ResultInfo(0, "Customer: không tồn tại - Cell[" + row + ",6]", "");
                                                }
                                                else
                                                {
                                                    item.CustomerId = tmp.Id;
                                                }
                                            }
                                            
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            var key = Convert.ToString(FromDate).Trim().Split("-");
                                            if(key.Length == 3) { 
                                                var temp = key[0] + key[1] + key[2];
                                                item.FromDate = Convert.ToInt32(temp);
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "FromDate: không đúng định dạng (yyyy-MM-dd)  - Cell[" + row + ",10]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)) && Convert.ToString(ToDate).Length != 10)
                                        {
                                            return new ResultInfo(0, "ToDate: không đúng định dạng (yyyy-MM-dd) - Cell[" + row + ",11]", "");

                                        }
                                        else
                                        {
                                            var key = Convert.ToString(ToDate).Trim().Split("-");
                                            if (key.Length == 3)
                                            {
                                                var temp = key[0] + key[1] + key[2];
                                                item.ToDate = Convert.ToInt32(temp);
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(IsDelete)))
                                        {
                                            item.IsDelete = Convert.ToString(IsDelete).Trim().ToLower() == "active" ? 0 : 1;
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
