using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;
using System.IO.Packaging;
using System.Drawing;
using Microsoft.AspNetCore.Http;
using SpiralEntity;
using System.Globalization;

namespace MRCApi.Controllers
{
    public class StockOutController : SpiralBaseController
    {
        private readonly IStockOutService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IShopService _shopService;
        private readonly IProductService _productService;
        private readonly IEmployeeService _employeeService;
        public StockOutController(StockOutContext context, IWebHostEnvironment webHost, ShopContext shopContext, ProductContext productContext, EmployeeContext employeeContext)
        {
            _service = new StockOutService(context);
            _shopService = new ShopService(shopContext);
            _productService = new ProductService(productContext);
            _employeeService = new EmployeeService(employeeContext);
            this._webHostEnvironment = webHost;
        }

        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(accId ?? AccountId, UserId, JsonData));
                return data.Result;
            } 
            catch(Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpGet("Detail")]
        public ActionResult<DataTable> Detail([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Detail(accId ?? AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpPost("Export")]
        public  async Task<ResultInfo> Export([FromBody] string JsonData, [FromHeader] int? accId)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
         
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/StockOut";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Báo cáo Tồn kho_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_StockOut_Rawdata.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(accId ?? AccountId, UserId, JsonData)))
                {
                    if (data.Tables[0].Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            var sheet = pk.Workbook.Worksheets[0];
                            
                            sheet.Cells[2, 5].Value = string.Format("Từ ngày: {0} - Đến ngày: {1}", dataJson.fromdate, dataJson.todate);

                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#305496", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 3, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count);

                            if (dataJson.accountName == "MARICO MT")
                            {
                                if (data.Tables[1].Rows.Count > 0)
                                {
                                    var sheet2 = pk.Workbook.Worksheets.Add("STORE NON VISIBILITY");
                                    sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                                    ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, sheet2.Dimension.End.Column], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                    ExcelFormats.Border(sheet2, 2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                                    sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                                    sheet2.Column(2).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                                }
                            }

                            pk.Save();
                        }
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        [HttpPost("UpdateDetail")]
        public async Task<ResultInfo> UpdateDetail([FromBody] string JsonData)
        {
            try
            {
                DataTable result = await Task.Run(() => _service.UpdateDetail(AccountId, UserId, JsonData));
                if (result.Rows.Count > 0)
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

        [HttpPost("Template")]
        public ActionResult<ResultInfo> Template([FromBody] string JsonData, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/StockOut";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template Import Inventory_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo file = new FileInfo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var pk = new ExcelPackage(file))
                {
                    DataSet data = Task.Run(() => _service.StockOut_GetTemplate(accId ?? AccountId, UserId, JsonData)).Result;

                    var sheetTemplate = pk.Workbook.Worksheets.Add("Data");

                    sheetTemplate.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);
                    sheetTemplate.Row(3).Height = 30;
                    ExcelFormats.FormatCell(sheetTemplate.Cells[3, 1, 3, sheetTemplate.Dimension.End.Column], "#4472C4", true, ExcelHorizontalAlignment.Center, "white");

                    sheetTemplate.Cells[1, 1].Value = "INVENTORY";
                    sheetTemplate.Cells[1, 1].Style.Font.Size = 16;
                    sheetTemplate.Row(3).Height = 30;
                    sheetTemplate.Cells[1, 1, 1, sheetTemplate.Dimension.End.Column].Merge = true;
                    ExcelFormats.FormatCell(sheetTemplate.Cells[1, 1, 1, sheetTemplate.Dimension.End.Column], "#BDD7EE", true, ExcelHorizontalAlignment.Center);

                    ExcelFormats.Border(sheetTemplate, 3, 1, sheetTemplate.Dimension.End.Row, sheetTemplate.Dimension.End.Column);

                    sheetTemplate.Cells[3, 1, sheetTemplate.Dimension.End.Row, sheetTemplate.Dimension.End.Column].AutoFitColumns(9);

                    if (data.Tables[1].Rows.Count > 0)
                    {
                        var sheet = pk.Workbook.Worksheets.Add("Product List");
                        sheet.Cells[1, 1].Value = "PRODUCT LIST";
                        sheet.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                        sheet.Cells[1, 1].Style.Font.Size = 15;
                        sheet.Cells[1, 1, 1, 5].Merge = true;
                        ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 5], "#305496", true, ExcelHorizontalAlignment.Center);

                        sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                        sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                        ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, sheet.Dimension.End.Column], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                    }

                    if (data.Tables[2].Rows.Count > 0)
                    {
                        var sheet = pk.Workbook.Worksheets.Add("Employee Shop");
                        sheet.Cells[1, 1].Value = "EMPLOYEE SHOP";
                        sheet.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                        sheet.Cells[1, 1].Style.Font.Size = 15;
                        sheet.Cells[1, 1, 1, 5].Merge = true;
                        ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 5], "#305496", true, ExcelHorizontalAlignment.Center);

                        sheet.Cells[3, 1].LoadFromDataTable(data.Tables[2], true);

                        sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                        ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, sheet.Dimension.End.Column], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                    }

                    pk.Save();
                }
                return (new ResultInfo(200, "Xuất Template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
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

                    string subfoler = "upload/import";
                    if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                    {
                        System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                    }
                    string fileName = "File_Error_Invetory_" + string.Format("{0:yyyyMMdd_HHmmss}", DateTime.Now) + ".xlsx";
                    FileInfo fileInfo = new FileInfo(Path.Combine(folder, subfoler, fileName));

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        if (package != null && package.Workbook.Worksheets["Data"] != null)
                        {
                            int row = 5;
                            try
                            {
                                ExcelWorksheet sheet = package.Workbook.Worksheets["Data"];
                                 
                                if (sheet != null)
                                {
                                    List<StockOutModel> dataImport = new List<StockOutModel>();
                                    List<ShopsEntity> listShop = _shopService.GetList(accId ?? AccountId);
                                    List<EmployeesEntity> listEmployee = _employeeService.GetAll(accId ?? AccountId);
                                    List<ProductModel> listProduct = _productService.GetList(accId ?? AccountId);
                                    List<EmployeeShopModel> list_es = _employeeService.EmployeeShopPermission(accId ?? AccountId, UserId).Result;

                                    int endCol = sheet.Dimension.End.Column + 1;
                                    bool checkError = false;
                                    // Check data input
                                    // #region Check data input
                                    for (row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        StockOutModel item = new StockOutModel();
                                        var ShopCode = sheet.Cells[row, 2].Value;
                                        var EmployeeCode = sheet.Cells[row, 4].Value;
                                        var WorkDate = sheet.Cells[row, 7].Value;
                                        var ProductCode = sheet.Cells[row, 9].Value;
                                        var Quantity = sheet.Cells[row, 11].Value;
                                        var Price = sheet.Cells[row, 12].Value;
                                        #region check
                                        string listError = "";

                                        if (string.IsNullOrEmpty(Convert.ToString(ShopCode).Trim()))
                                        {
                                             listError +=  " - ShopCode: không được để trống";
                                             checkError = true;
                                        }
                                        else
                                        {
                                            var shop = listShop.Where(p => p.ShopCode == Convert.ToString(ShopCode).Trim()).FirstOrDefault();
                                            if (shop == null)
                                            {
                                                listError += " - ShopCode : không tồn tại";
                                                checkError = true;
                                            }
                                            else
                                            {
                                                item.ShopId = shop.Id;
                                            }
                                        }

                                        DateTime checkDate;

                                        if (string.IsNullOrEmpty(Convert.ToString(WorkDate).Trim()))
                                        {
                                            listError += " - Work Date: không được để trống";
                                            checkError = true;
                                        }
                                        else
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(WorkDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                listError += " - Work Date : không đúng định dạng";
                                                checkError = true;
                                            }
                                            else
                                            {
                                                item.WorkDate = Convert.ToString(WorkDate).Trim();
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(EmployeeCode).Trim()) && !string.IsNullOrWhiteSpace(EmployeeCode.ToString().Trim()))
                                        {
                                            var employee = listEmployee.Where(p => p.EmployeeCode == Convert.ToString(EmployeeCode).Trim()).FirstOrDefault();
                                            if (employee == null)
                                            {
                                                listError += " - EmployeeCode : không tồn tại";
                                                checkError = true;
                                            }
                                            else
                                            {
                                                item.EmployeeId = employee.Id;

                                                // Check PQ Shop
                                                #region  Check PQ Shop
                                                if (list_es.Count > 0 && IsAdmin == false)
                                                {
                                                    var tmpes = list_es.Where(p => p.EmployeeId == item.EmployeeId && p.ShopId == item.ShopId
                                                             && (p.FromDate <= Convert.ToDateTime(item.WorkDate))
                                                            && (p.ToDate == null || (p.ToDate >= Convert.ToDateTime(item.WorkDate)))
                                                        ).FirstOrDefault();
                                                     
                                                    if (tmpes == null)
                                                    {
                                                        listError += " - Employee và Shop: không được phân quyền";
                                                        checkError = true;
                                                    }
                                                }
                                                #endregion  Check PQ Shop
                                            }
                                        }
                                        else
                                        {
                                            // Check PQ Shop
                                            #region  Check PQ Shop
                                            if (list_es.Count > 0 && IsAdmin == false)
                                            {
                                                var tmpes = list_es.Where(p => p.ShopId == item.ShopId
                                                            && (p.FromDate <= Convert.ToDateTime(item.WorkDate))
                                                        && (p.ToDate == null || (p.ToDate >= Convert.ToDateTime(item.WorkDate)))
                                                    ).FirstOrDefault();

                                                if (tmpes == null)
                                                {
                                                    listError += " - Shop: không được phân quyền";
                                                    checkError = true;
                                                }
                                            }
                                            #endregion  Check PQ Shop
                                        }


                                        if (string.IsNullOrEmpty(Convert.ToString(ProductCode).Trim()))
                                        {
                                            listError += " - Barcode : không được để trống";
                                            checkError = true;
                                        }
                                        else
                                        {
                                            var pro = listProduct.Where(p => p.ProductCode == Convert.ToString(ProductCode).Trim()).FirstOrDefault();
                                            if (pro != null)
                                            {
                                                 item.ProductId = pro.Id;
                                            }
                                            else
                                            {
                                                listError += " - ProductCode : không tồn tại";
                                                checkError = true;
                                            }
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Quantity).Trim()))
                                        {
                                            listError += " - Quantity : không được để trống";
                                            checkError = true;
                                        }
                                        else
                                        {
                                            item.Quantity = Convert.ToInt32(Quantity);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Price).Trim()))
                                        {
                                            item.Price = Convert.ToDecimal(Convert.ToString(Price));
                                        }

                                        if(listError != "")
                                        {
                                            sheet.Cells[row, endCol].Value = listError;
                                        }

                                        dataImport.Add(item);
                                    }
                                    #endregion Check data input
                                    if(checkError == true)
                                    {
                                        sheet.Cells[3, endCol].Value = "Error";
                                        package.SaveAs(fileInfo);
                                        return new ResultInfo(300, "Không thành công, lỗi trong file đính kèm. Vui lòng kiểm tra lại", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName));
                                    }
                                    else
                                    {
                                        // Send data import
                                        if (dataImport.Count > 0)
                                        {
                                            string json = JsonConvert.SerializeObject(dataImport);
                                            var Result = await Task.Run(() => _service.StockOut_Import(accId ?? AccountId, UserId, json));
                                            if (Result > 0)
                                            {
                                                return new ResultInfo(200, string.Format("Import Thành công: {0} dòng", dataImport.Count), "");
                                            }
                                        }

                                    }

                                }
                                return new ResultInfo(0, "File rỗng", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString() + ",Dòng: " + row.ToString(), ex.StackTrace.ToString());
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "File rỗng", "");
        }
    }
}
