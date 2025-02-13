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
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;
using DocumentFormat.OpenXml.VariantTypes;
using iText.StyledXmlParser.Node;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Office2016.Excel;
using iText.Commons.Bouncycastle.Asn1.X509;
using Microsoft.IdentityModel.Tokens;

namespace MRCApi.Controllers
{
    public class OOLTargetsController : SpiralBaseController
    {
        private readonly IOOLTargetsService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IProductCategoriesService _productCategories;
        private readonly IMasterListDataService _masterListDataService;
        private readonly IOOLListsService _oolService;
        private readonly IShopService _shopService;
        public OOLTargetsController(OOLTargetsContext context, IWebHostEnvironment hostingEnvironment, ProductCategoriesContext productCategories, OOLListsContext oolListContext, ShopContext shopContext)
        {
            _service = new OOLTargetsService(context);
            _productCategories = new ProductCategoriesService(productCategories);
            _oolService = new OOLListsService(oolListContext);
            _shopService = new ShopService(shopContext);
            this._hostingEnvironment = hostingEnvironment;
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> OOLTarget_Template([FromHeader] string JsonData)
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/OOLTarget";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"OOLTarget_Teamplate_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo file = new FileInfo(Path.Combine(folder, subfolder, fileName));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.OOLTargets_CreateTemplate(AccountId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var wsOOLTarget = package.Workbook.Worksheets.Add("Visibility");
                        var wsCat = package.Workbook.Worksheets.Add("Category");
                        var wsshop = package.Workbook.Worksheets.Add("Shop");
                        var dtOOL = data.Tables[0];
                        var dtCat = data.Tables[1];
                        var dtshop = data.Tables[2];
                        if (wsOOLTarget != null)
                        {
                            wsOOLTarget.Cells[2, 1, 2, 5].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            wsOOLTarget.Cells[4, 1].Value = "Action(N/D)";
                            wsOOLTarget.Cells[4, 2].Value = "Division";
                            wsOOLTarget.Cells[4, 3].Value = "Brand";
                            wsOOLTarget.Cells[4, 4].Value = "ShopCode";
                            wsOOLTarget.Cells[4, 5].Value = "ShopName";
                            wsOOLTarget.Cells[4, 6].Value = "FromDate (yyyy-MM-dd)";
                            wsOOLTarget.Cells[4, 7].Value = "Todate (yyyy-MM-dd)";

                            wsOOLTarget.Cells[3, 1, 3, 7].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            wsOOLTarget.Cells[3, 1, 3, 7].Style.Font.Size = 13;
                            wsOOLTarget.Cells[3, 1, 3, 7].Style.Font.Bold = true;
                            for (int i = 1; i <= 7; i++)
                            {
                                wsOOLTarget.Cells[3, i].Value = wsOOLTarget.Cells[4, i].Value;
                                wsOOLTarget.Cells[3, i].Style.WrapText = true;
                                wsOOLTarget.Cells[3, i, 4, i].Merge = true;
                                ExcelFormats.FormatCell(wsOOLTarget.Cells[3, i, 4, i], "#2F75B5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            }
                            if (wsOOLTarget != null)
                            {
                                for (int r = 0; r < dtOOL.Rows.Count; r++)
                                {
                                    wsOOLTarget.Cells[2, r + 8].Value = dtOOL.Rows[r][0];
                                }
                                for (int r = 0; r < dtOOL.Rows.Count; r++)
                                {
                                    wsOOLTarget.Cells[4, r + 8].Value = dtOOL.Rows[r][1];
                                }
                                wsOOLTarget.Row(3).Height = 30;
                                wsOOLTarget.Row(4).Height = 30;

                                wsOOLTarget.Cells[3, 8].Value = "Hạng mục";
                                wsOOLTarget.Cells[3, 8, 3, wsOOLTarget.Dimension.End.Column].Merge = true;
                                wsOOLTarget.Cells[3, 8, 3, wsOOLTarget.Dimension.End.Column].Style.Font.Size = 15;
                                wsOOLTarget.Cells[3, 8, 3, wsOOLTarget.Dimension.End.Column].Style.Font.Bold = true;
                                wsOOLTarget.Cells[3, 1, 4, wsOOLTarget.Dimension.End.Column].Style.WrapText = true;
                                wsOOLTarget.Cells[3, 1, 3, dtOOL.Columns.Count].Style.Font.Size = 13;
                                wsOOLTarget.Cells[3, 1, 3, dtOOL.Columns.Count].Style.Font.Bold = true;
                                wsOOLTarget.Cells[4, 1, 4, dtOOL.Columns.Count].Style.Font.Size = 13;
                                wsOOLTarget.Cells[4, 1, 4, dtOOL.Columns.Count].Style.Font.Bold = true;

                                ExcelFormats.FormatCell(wsOOLTarget.Cells[3, 8, 3, wsOOLTarget.Dimension.End.Column], "yellow", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.FormatCell(wsOOLTarget.Cells[4, 8, 4, wsOOLTarget.Dimension.End.Column], "#2e8b57", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(wsOOLTarget, 3, 1, wsOOLTarget.Dimension.End.Row, wsOOLTarget.Dimension.End.Column);
                                wsOOLTarget.Cells[3, 1, wsOOLTarget.Dimension.End.Row, wsOOLTarget.Dimension.End.Column].AutoFitColumns();
                                wsOOLTarget.Columns[1, wsOOLTarget.Dimension.End.Column].Width = 12;
                                if (wsCat != null)
                                {
                                    wsCat.Cells[2, 1].LoadFromDataTable(dtCat, true);
                                    wsCat.Row(2).Height = 30;
                                    wsCat.Cells[2, 1, 2, dtCat.Columns.Count].Style.Font.Bold = true;
                                    wsCat.Cells[2, 1, 2, dtCat.Columns.Count].Style.Font.Size = 14;
                                    ExcelFormats.Border(wsCat, 2, 1, dtCat.Rows.Count + 2, dtCat.Columns.Count);
                                    ExcelFormats.FormatCell(wsCat.Cells[2, 1, 2, wsCat.Dimension.Columns], "#6495ed", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                    wsCat.Cells[2, 1, wsCat.Dimension.Rows, wsCat.Dimension.Columns].AutoFitColumns();
                                }
                                if (wsshop != null)
                                {
                                    wsshop.Cells[2, 1].LoadFromDataTable(dtshop, true);
                                    wsshop.Row(2).Height = 30;
                                    wsshop.Cells[2, 1, 2, dtshop.Columns.Count].Style.Font.Bold = true;
                                    wsshop.Cells[2, 1, 2, dtshop.Columns.Count].Style.Font.Size = 14;
                                    ExcelFormats.Border(wsshop, 2, 1, dtshop.Rows.Count + 2, dtshop.Columns.Count);
                                    ExcelFormats.FormatCell(wsshop.Cells[2, 1, 2, wsshop.Dimension.Columns], "#32cd32", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                    wsshop.Cells[2, 1, dtshop.Rows.Count + 4, dtshop.Columns.Count].AutoFitColumns();
                                }
                                package.Save();
                            }
                        }
                    }
                    return (new ResultInfo(200, "Tạo template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpGet("Filter")]
        public async Task<DataTable> OOLTarget_Filter([FromHeader] string JsonData)
        {
            DataTable dt = await Task.Run(() => _service.OOLTarget_Filter(AccountId, JsonData));
            return dt;
        }
        [HttpPost("Save")]
        public ActionResult<DataTable> Save([FromHeader] string Action, [FromForm] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Save(Action, AccountId, JsonData));
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
        //[HttpPost("Save")]
        //public ActionResult<DataTable> Save([FromHeader] string Action, [FromBody] string JsonData)
        //{
        //    try
        //    {
        //        Task<DataTable> data = Task.Run(() => _service.Save(Action, AccountId, JsonData));
        //        if (data.Result.Rows.Count > 0)
        //        {
        //            return data.Result;
        //        }
        //        return BadRequest(-1);
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(ex.Message);
        //    }
        //    //Task<DataTable> data =  Task.Run(() => _service.Save(Action, AccountId, JsonData));
        //    //if (data.Rows.Count > 0)
        //    //{
        //    //    if (Convert.ToString(data.Rows[0]["Response"]) == "1")
        //    //    {
        //    //        return new ResultInfo(1, "Thành công", null, data);
        //    //    }
        //    //    else
        //    //    {
        //    //        return new ResultInfo(0, Convert.ToString(data.Rows[0]["Response"]), null);
        //    //    }
        //    //}
        //    //else
        //    //{
        //    //    return new ResultInfo(0, "Không có data", null);
        //    //}
        //}
        [HttpGet("ExportTarget")]
        public async Task<ResultInfo> OOLTarget_Export([FromHeader] string JsonData)
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/OOLTarget";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"OOLTarget_Export_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo file = new FileInfo(Path.Combine(folder, subfolder, fileName));
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.OOLTargets_Export(AccountId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets.Add("Visibility");
                        if (sheet != null)
                        {
                            sheet.Cells[4, 1].LoadFromDataTable(data, true);
                            //sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            sheet.Row(3).Height = 35;
                            sheet.Row(4).Height = 30;
                            sheet.Cells[3, 1, 3, 11].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            sheet.Cells[3, 1, 3, 11].Style.Font.Size = 13;
                            sheet.Cells[3, 1, 3, 11].Style.Font.Bold = true;
                            for (int i = 1; i <= 11; i++)
                            {
                                sheet.Cells[3, i].Value = sheet.Cells[4, i].Value;
                                sheet.Cells[3, i, 4, i].Merge = true;
                                ExcelFormats.FormatCell(sheet.Cells[3, i, 4, i], "#2F75B5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            }
                            sheet.Cells[3, 12].Value = "Hạng mục";
                            sheet.Cells[3, 12, 3, sheet.Dimension.End.Column].Merge = true;
                            sheet.Cells[3, 12, 3, sheet.Dimension.End.Column].Style.Font.Size = 15;
                            sheet.Cells[3, 12, 3, sheet.Dimension.End.Column].Style.Font.Bold = true;
                            sheet.Cells[3, 1, 4, sheet.Dimension.End.Column].Style.WrapText = true;
                            ExcelFormats.FormatCell(sheet.Cells[3, 12, 3, sheet.Dimension.End.Column], "yellow", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[4, 12, 4, 13], "#87ceeb", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[4, 14, 4, sheet.Dimension.End.Column], "#2e8b57", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Columns[1, sheet.Dimension.End.Column].Width = 13;
                            sheet.Column(8).Width = 50;
                        }
                        else
                        {
                            return new ResultInfo(500, "Không có worksheets", null);
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

        public class OOLTagertImport
        {
            public string Action { get; set; }
            public int DivisionId { get; set; }
            public int? BrandId { get; set; }
            public string Brand { get; set; }
            public int? ShopId { get; set; }
            public DateTime FromDate { get; set; }
            public DateTime ToDate { get; set; }
            public int LocationId { get; set; }
            public int? Target { get; set; }
            public int? Type { get; set; }
        }
        [HttpPost("ImportTagertOOL")]
        public async Task<ResultInfo> OOLTarget_ImportOOL([FromForm] IFormCollection fileUpload)
        {
            try
            {
                string folder = _hostingEnvironment.WebRootPath;
                //var stream = fileUpload.OpenReadStream();
                var file = fileUpload.Files[0];
                using (var stream = new MemoryStream())
                {
                    await file.CopyToAsync(stream);
                    var fileBytes = stream.ToArray();
                    stream.Write(fileBytes, 0, fileBytes.Length);
                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage package = new ExcelPackage(stream))
                    {
                        ExcelWorkbook workBook = package.Workbook;
                        var wsOOL = workBook.Worksheets["Visibility"];
                        if (wsOOL != null)
                        {
                            List<OOLTagertImport> dataImport = new List<OOLTagertImport>();
                            var endRow = wsOOL.Dimension.Rows;
                            var endColumn = wsOOL.Dimension.Columns;
                            if (endRow >= 5)
                            {
                                List<ProductCategoriesEntity> productCate = _productCategories.GetList(AccountId);
                                List<ShopsEntity> Shops = _shopService.GetList(AccountId);
                                for (int r = 5; r <= endRow; r++)
                                {
                                    var action = Convert.ToString(wsOOL.Cells[r, 1].Value ?? "N");
                                    var Division = Convert.ToString(wsOOL.Cells[r, 2].Value);
                                    var Brand = Convert.ToString(wsOOL.Cells[r, 3].Value);
                                    var ShopCode = Convert.ToString(wsOOL.Cells[r, 4].Value);
                                    var FromDate = Convert.ToString(wsOOL.Cells[r, 6].Value);
                                    var ToDate = Convert.ToString(wsOOL.Cells[r, 7].Value);

                                    DateTime nfromDate, ntoDate;
                                    int DivisionId = 0;
                                    int ShopId = 0;
                                    int? BrandId = null;
                                    int Targets;
                                    List<int> lstLocation = new List<int>();
                                    List<int> lstTarget = new List<int>();

                                    if (string.IsNullOrEmpty(Convert.ToString(Division)) || string.IsNullOrWhiteSpace(Convert.ToString(Division)))
                                    {
                                        return new ResultInfo(500, "Divison Không được để trống - Dòng: " + r + ", Cột: " + 2, "");
                                    }
                                    else
                                    {
                                        var Divisions = productCate.Where(p => p.Division == Division).FirstOrDefault();
                                        if (Divisions != null)
                                        {
                                            DivisionId = Divisions.DivisionId;
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "Division không tồn tại - Cell[" + r + ",2]", "");
                                        }
                                    }
                                    if (string.IsNullOrEmpty(Convert.ToString(Brand)) || string.IsNullOrWhiteSpace(Convert.ToString(Brand)))
                                    {
                                        return new ResultInfo(500, "Brand không được để trống  - Dòng: " + r + ", Cột: " + 3, "");
                                    }
                                    else
                                    {
                                        //var CheckBrand = Convert.ToString(wsOOL.Cells[r, 2].Value);
                                        var Brands = productCate.Where(p => p.Brand == Brand).FirstOrDefault();
                                        if (Convert.ToString(Brand) == "X-Men & X-Men For Boss")
                                        {
                                            var Brandss = productCate.Where(p => p.BrandId == 8881).FirstOrDefault();
                                            if(Brandss != null)
                                            {
                                                BrandId = Brands.BrandId;
                                                DivisionId = Brandss.DivisionId;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Brand Không tồn tại - Cell[" + r + ",3]", "");
                                            }
                                        }
                                        else 
                                        {
                                            if (Brands != null)
                                            {
                                                BrandId = Brands.BrandId;
                                                DivisionId = Brands.DivisionId;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Brand Không tồn tại - Cell[" + r + ",3]", "");
                                            }
                                        }
                                    }

                                    if (string.IsNullOrEmpty(Convert.ToString(ShopCode)) || string.IsNullOrWhiteSpace(Convert.ToString(ShopCode)))
                                    {
                                        return new ResultInfo(500, "Mã cửa hàng không được để trống - Dòng: " + r + ", Cột: " + 4, "");
                                    }
                                    else
                                    {
                                        var Shop = Shops.Where(s => s.ShopCode == ShopCode).FirstOrDefault();
                                        if (Shop != null)
                                        {
                                            ShopId = Shop.Id;
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "Shop code không tồn tại - Cell[" + r + ",4]", "");
                                        }
                                    }

                                    if (string.IsNullOrWhiteSpace(Convert.ToString(FromDate)) || string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                    {
                                        return new ResultInfo(500, "FromDate không được để trống - Dòng:" + r + ", Cột: " + 6, "");
                                    }
                                    else if (!DateTime.TryParse(Convert.ToString(FromDate), out nfromDate))
                                    {
                                        return new ResultInfo(500, "FromDate không đúng định dạng yyyy-MM-dd - Dòng: " + r + ", Cột: " + 6, "");
                                    }


                                    if (string.IsNullOrEmpty(Convert.ToString(ToDate)) || string.IsNullOrWhiteSpace(Convert.ToString(ToDate)))
                                    {
                                        return new ResultInfo(500, "ToDate không được để trống - Dòng:" + r + ", Cột:" + 7, "");
                                    }
                                    else if (!DateTime.TryParse(Convert.ToString(ToDate), out ntoDate))
                                    {
                                        return new ResultInfo(500, "ToDate không đúng định dạng yyyy-MM-dd - Dòng: " + r + ", Cột: " + 7, "");
                                    }

                                    for (int j = 8; j <= endColumn; j++)
                                    {
                                        if (!string.IsNullOrEmpty(Convert.ToString(wsOOL.Cells[r, j].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(wsOOL.Cells[r, j].Value)))
                                        {
                                            if (!Int32.TryParse(Convert.ToString(wsOOL.Cells[r, j].Value), out Targets))
                                            {
                                                return new ResultInfo(500, "Target không đúng địng dạng - Dòng: " + r + ", Cột:" + j + " Định Dạng của target là numbers", "");
                                            }
                                            int locationId = Convert.ToInt32(wsOOL.Cells[2, j].Value);
                                            lstLocation.Add(locationId);
                                            lstTarget.Add(Targets);
                                        }
                                    }
                                    for (int t = 0; t < lstLocation.Count; t++)
                                    {
                                        OOLTagertImport item = new OOLTagertImport();
                                        item.Action = action;
                                        item.DivisionId = DivisionId;
                                        item.BrandId = BrandId;
                                        item.Brand = Brand;
                                        item.ShopId = ShopId;
                                        item.LocationId = lstLocation[t];
                                        item.Target = lstTarget[t];
                                        item.Type = 3;
                                        item.FromDate = nfromDate;
                                        item.ToDate = ntoDate;
                                        dataImport.Add(item);
                                    }
                                }
                                if (dataImport.Count > 0)
                                {
                                    string dataJson = JsonConvert.SerializeObject(dataImport);
                                    int resultImport = await Task.Run(() => _service.OOLTarget_Import(AccountId, dataJson));
                                    if (dataJson != null)
                                    {
                                        return new ResultInfo(200, string.Format("Import thành công: {0} dòng", dataImport.Count), "");
                                    }
                                    else
                                        return new ResultInfo(500, "Không thành công : {0} dòng", "");
                                }
                                return new ResultInfo(500, "Object Không có dữ liệu", "");
                            }
                            return new ResultInfo(500, "Sheet Visibility Không có data : {0} dòng", "");
                        }
                        else
                        {
                            return new ResultInfo(500, "Không tồn tại sheet Visibility", "");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        //[HttpGet("Template")]
        //public async Task<ResultInfo> OOLTarget_Template([FromHeader] string JsonData)
        //{
        //    string folder = _hostingEnvironment.WebRootPath;
        //    string subfolder = "export/OOLTarget";
        //    if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
        //    {
        //        System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
        //    }
        //    string fileName = $"OOLTarget_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
        //    string fileExport = Path.Combine(folder, subfolder, fileName);
        //    FileInfo file = new FileInfo(Path.Combine(folder, subfolder, fileName));
        //    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        //    try
        //    {
        //        using (DataSet data = await Task.Run(() => _service.OOLTargets_CreateTemplate(AccountId, JsonData)))
        //        {
        //            using (var package = new ExcelPackage(file))
        //            {
        //                var wsOOLTarget = package.Workbook.Worksheets.Add("Visibility");
        //                var wsCat = package.Workbook.Worksheets.Add("Category");
        //                var wsshop = package.Workbook.Worksheets.Add("Shop");
        //                var dtOOL = data.Tables[0];
        //                var dtCat = data.Tables[1];
        //                var dtshop = data.Tables[2];
        //                if (wsOOLTarget != null)
        //                {
        //                    wsOOLTarget.Cells[2, 1, 2, 5].Style.Font.Color.SetColor(System.Drawing.Color.White);
        //                    wsOOLTarget.Cells[4, 1].Value = "STT";
        //                    wsOOLTarget.Cells[4, 2].Value = "Division";
        //                    wsOOLTarget.Cells[4, 3].Value = "Channel";
        //                    wsOOLTarget.Cells[4, 4].Value = "Shop code";
        //                    wsOOLTarget.Cells[4, 5].Value = "Shop Name";

        //                    for (int i = 1; i <= 5; i++)
        //                    {
        //                        wsOOLTarget.Cells[2, i].Value = wsOOLTarget.Cells[4, i].Value;
        //                        wsOOLTarget.Cells[2, i].Style.WrapText = true;
        //                        wsOOLTarget.Cells[2, i, 4, i].Merge = true;
        //                        wsOOLTarget.Cells[2, i, 4, i].Style.Font.Size = 13;
        //                        wsOOLTarget.Cells[2, i, 4, i].Style.Font.Bold = true;
        //                        ExcelFormats.FormatCell(wsOOLTarget.Cells[2, i, 4, i], "#2F75B5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                    }
        //                    if(wsOOLTarget != null)
        //                    {

        //                        if (dtOOL.Rows.Count > 0 && dtOOL.Columns.Count > 1) 
        //                        {
        //                            int startCol = 6;
        //                            int indexcolors = 0;
        //                            wsOOLTarget.Cells[2, startCol].Value = "THUE NGAN HAN";
        //                            for (int r = 0; r < dtOOL.Rows.Count; r++)
        //                            {
        //                                string group = dtOOL.Rows[r][0]?.ToString();

        //                                if (!string.IsNullOrEmpty(group))
        //                                {
        //                                    int groupColStart = startCol; 
        //                                    int groupColEnd = startCol + dtOOL.Columns.Count; 

        //                                    wsOOLTarget.Cells[3, groupColStart, 3, groupColEnd].Merge = true;
        //                                    wsOOLTarget.Cells[3, groupColStart].Value = group;
        //                                    string[] color = new string[] { "#bcbcbc", "#8fce00", "#a2c4c9", "#8e7cc3", "#a64d79", "#c90076", "#fff2cc", "#66cdaa", "#cd853f" };
        //                                    ExcelFormats.FormatCell(wsOOLTarget.Cells[3, groupColStart, 3, groupColEnd], color[indexcolors].ToString(), true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                                    indexcolors++;

        //                                    wsOOLTarget.Cells[4, startCol].Value = "FromDate(*) (yyyy-MM-dd)";
        //                                    wsOOLTarget.Cells[4, startCol+ 1].Value = "ToDate(*) (yyyy-MM-dd)";

        //                                    ExcelFormats.FormatCell(wsOOLTarget.Cells[4, startCol, 4, startCol + 1], "#6fa8dc", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                                    startCol += 2;

        //                                    for (int c = 1; c < dtOOL.Columns.Count; c++) 
        //                                    {
        //                                        wsOOLTarget.Cells[4, startCol].Value = dtOOL.Columns[c].ColumnName;
        //                                        wsOOLTarget.Cells[1, startCol].Value = dtOOL.Rows[r][c]; 
        //                                        startCol++;
        //                                    }
        //                                }
        //                            }
        //                            wsOOLTarget.Cells[2, 6, 2, startCol -1].Merge = true;
        //                            wsOOLTarget.Cells[2, 6, 4, startCol -1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
        //                            wsOOLTarget.Cells[2, 6, 4, startCol -1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;
        //                            ExcelFormats.FormatCell(wsOOLTarget.Cells[2, 6, 2, startCol - 1], "yellow", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

        //                            int startColumn = startCol;
        //                            int indexcolor = 0;
        //                            wsOOLTarget.Cells[2, startColumn].Value = "THUE DAI HAN";

        //                            int indexColumn = startColumn;
        //                            for (int r = 0; r < dtOOL.Rows.Count; r++) 
        //                            {
        //                                string group = dtOOL.Rows[r][0]?.ToString();

        //                                if (!string.IsNullOrEmpty(group))
        //                                {
        //                                    int grColStart = indexColumn;
        //                                    int grColEnd = indexColumn + dtOOL.Columns.Count; 

        //                                    wsOOLTarget.Cells[3, grColStart, 3, grColEnd].Merge = true;
        //                                    wsOOLTarget.Cells[3, grColStart].Value = group;

        //                                    string[] color = new string[] { "#bcbcbc", "#8fce00", "#a2c4c9", "#8e7cc3", "#a64d79", "#c90076", "#fff2cc", "#66cdaa", "#cd853f" };
        //                                    ExcelFormats.FormatCell(wsOOLTarget.Cells[3, grColStart, 3,grColEnd], color[indexcolor].ToString(), true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                                    indexcolor++;

        //                                    wsOOLTarget.Cells[4, indexColumn].Value = "FromDate(*) (yyyy-MM-dd)";
        //                                    wsOOLTarget.Cells[4, indexColumn + 1].Value = "ToDate(*) (yyyy-MM-dd)";
        //                                    ExcelFormats.FormatCell(wsOOLTarget.Cells[4, indexColumn, 4, indexColumn + 1], "#6fa8dc", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                                    indexColumn += 2;

        //                                    for (int c = 1; c < dtOOL.Columns.Count; c++) 
        //                                    {
        //                                        wsOOLTarget.Cells[4, indexColumn].Value = dtOOL.Columns[c].ColumnName;
        //                                        wsOOLTarget.Cells[1, indexColumn].Value = dtOOL.Rows[r][c];
        //                                        indexColumn++; 
        //                                    }
        //                                }
        //                            }
        //                            wsOOLTarget.Cells[4, 6, 4, indexColumn - 1].Style.WrapText = true;
        //                            wsOOLTarget.Cells[3, 6, 3, indexColumn - 1].Style.Font.Size = 13;
        //                            wsOOLTarget.Cells[3, 6, 3, indexColumn - 1].Style.Font.Bold = true;
        //                            wsOOLTarget.Cells[2, 6, 2, indexColumn - 1].Style.Font.Bold = true;
        //                            wsOOLTarget.Cells[2, 6, 2, indexColumn - 1].Style.Font.Size = 14;
        //                            wsOOLTarget.Cells[2, startColumn, 2, indexColumn - 1].Merge = true;
        //                            wsOOLTarget.Cells[1, startColumn, 4, indexColumn - 1].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
        //                            wsOOLTarget.Cells[1, startColumn, 4, indexColumn - 1].Style.VerticalAlignment = OfficeOpenXml.Style.ExcelVerticalAlignment.Center;   
        //                            ExcelFormats.FormatCell(wsOOLTarget.Cells[2, startColumn, 2, indexColumn - 1], "red", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                        }

        //                    }
        //                    wsOOLTarget.Row(1).Height = 20;
        //                    wsOOLTarget.Row(2).Height = 20;
        //                    wsOOLTarget.Row(3).Height = 20;
        //                    wsOOLTarget.Row(4).Height = 50;
        //                    //wsOOLTarget.Columns[1, wsOOLTarget.Dimension.Columns].Width = 13;
        //                    wsOOLTarget.DefaultColWidth = 13;
        //                    ExcelFormats.Border(wsOOLTarget, 2, 1, wsOOLTarget.Dimension.End.Row, wsOOLTarget.Dimension.End.Column);
        //                    wsOOLTarget.Cells[4, 1, wsOOLTarget.Dimension.End.Row, wsOOLTarget.Dimension.End.Column].AutoFitColumns();
        //                }
        //                if (wsCat != null)  
        //                {
        //                    wsCat.Cells[2, 1].LoadFromDataTable(dtCat, true);
        //                    wsCat.Row(2).Height = 30;
        //                    wsCat.Cells[2, 1, 2, dtCat.Columns.Count].Style.Font.Bold = true;
        //                    wsCat.Cells[2, 1, 2, dtCat.Columns.Count].Style.Font.Size = 14;
        //                    ExcelFormats.Border(wsCat, 2, 1, dtCat.Rows.Count + 2, dtCat.Columns.Count);
        //                    ExcelFormats.FormatCell(wsCat.Cells[2, 1, 2, wsCat.Dimension.Columns], "#6495ed", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                    wsCat.Cells[2, 1, wsCat.Dimension.Rows, wsCat.Dimension.Columns].AutoFitColumns();
        //                }
        //                if (wsshop != null)
        //                {
        //                    wsshop.Cells[2, 1].LoadFromDataTable(dtshop, true);
        //                    wsshop.Row(2).Height = 30;
        //                    wsshop.Cells[2, 1, 2, dtshop.Columns.Count].Style.Font.Bold = true;
        //                    wsshop.Cells[2, 1, 2, dtshop.Columns.Count].Style.Font.Size = 14;
        //                    ExcelFormats.Border(wsshop, 2, 1, dtshop.Rows.Count + 2, dtshop.Columns.Count);
        //                    ExcelFormats.FormatCell(wsshop.Cells[2, 1, 2, wsshop.Dimension.Columns], "#32cd32", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
        //                    wsshop.Cells[2, 1, dtshop.Rows.Count + 4, dtshop.Columns.Count].AutoFitColumns();
        //                }
        //                package.Save();
        //            }
        //        }
        //        return (new ResultInfo(200, "Tạo template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
        //    }
        //    catch (Exception ex)
        //    {
        //        return new ResultInfo(500, ex.Message, "");
        //    }
        //}

        //[HttpPost("ImportTarget")]
        //public async Task<ResultInfo> OOLTarget_Import([FromForm] IFormFile fileUpload)
        //{
        //    try
        //    {
        //        string folder = _hostingEnvironment.WebRootPath;
        //        var stream = fileUpload.OpenReadStream();
        //        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        //        using (var package = new ExcelPackage(stream))
        //        {
        //            ExcelWorkbook workBook = package.Workbook;
        //            var wsOOL = workBook.Worksheets["Visibility"];
        //            if (wsOOL != null)
        //            {
        //                List<OOLTargetsModel> dataImport = new List<OOLTargetsModel>();
        //                var endRow = wsOOL.Dimension.End.Row;
        //                var endColumn = wsOOL.Dimension.End.Column;
        //                if (endRow >= 5)
        //                {
        //                    List<ProductCategoriesEntity> productCate = _productCategories.GetList(AccountId);
        //                    List<ShopsEntity> Shops = _shopService.GetList(AccountId);
        //                    for (int i = 5; i <= endRow; i++)
        //                    {
        //                        var ShopCode = wsOOL.Cells[i, 3].Value;
        //                        var Division = wsOOL.Cells[i, 5].Value;
        //                        var Brand = wsOOL.Cells[i, 6].Value;
        //                        var FromDate = wsOOL.Cells[i, 7].Value;
        //                        var ToDate = wsOOL.Cells[i, 8].Value;
        //                        DateTime _FromDate, _ToDate;
        //                        int DivisionId = 0;
        //                        int ShopId = 0;
        //                        int? BrandId = null;
        //                        int TargetValue;
        //                        List<string> listLocation = new List<string>();
        //                        List<int> listTargetValue = new List<int>();
        //                        if (string.IsNullOrEmpty(Convert.ToString(ShopCode)) || string.IsNullOrWhiteSpace(Convert.ToString(ShopCode)))
        //                        {
        //                            return new ResultInfo(500, "Mã cửa hàng không được để trống - Dòng: " + i + ", Cột: " + 3, "");
        //                        }
        //                        else
        //                        {
        //                            foreach (ShopsEntity s in Shops)
        //                            {
        //                                if (s.ShopCode == Convert.ToString(ShopCode))
        //                                {
        //                                    ShopId = s.Id;
        //                                    break;
        //                                }
        //                            }
        //                            if (ShopId == 0)
        //                            {
        //                                return new ResultInfo(500, "Mã cửa hàng không tồn tại - Dòng: " + i + ", Cột: " + 3, "");
        //                            }
        //                        }
        //                        if (!string.IsNullOrEmpty(Convert.ToString(Division)) && !string.IsNullOrWhiteSpace(Convert.ToString(Division)))
        //                        {
        //                            foreach (ProductCategoriesEntity p in productCate)
        //                            {
        //                                if (Division.ToString() == p.Division.ToString())
        //                                {
        //                                    DivisionId = p.DivisionId;
        //                                    break;
        //                                }
        //                            }
        //                            if (DivisionId == 0)
        //                            {
        //                                return new ResultInfo(500, "Cat không tồn tại - Dòng: " + i + ",Cột: " + 5, "");
        //                            }
        //                        }
        //                        if (!string.IsNullOrEmpty(Convert.ToString(Brand)) && !string.IsNullOrWhiteSpace(Convert.ToString(Brand)))
        //                        {
        //                            ProductCategoriesEntity objCheck = new ProductCategoriesEntity();
        //                            foreach (ProductCategoriesEntity p in productCate)
        //                            {
        //                                if (Brand.ToString() == p.Brand.ToString())
        //                                {
        //                                    BrandId = p.BrandId;
        //                                    objCheck = p;
        //                                    break;
        //                                }
        //                            }
        //                            if (BrandId == null)
        //                            {
        //                                return new ResultInfo(500, "SubCat không tồn tại - Dòng: " + i + ",Cột: " + 6, "");
        //                            }
        //                            else if (objCheck.DivisionId != DivisionId)
        //                            {
        //                                return new ResultInfo(500, "SubCat không thuộc cấp của Cat- Dòng " + i + ",Cột: " + 6, "");
        //                            }
        //                        }
        //                        if (string.IsNullOrWhiteSpace(Convert.ToString(FromDate)) || string.IsNullOrEmpty(Convert.ToString(FromDate)))
        //                        {
        //                            return new ResultInfo(500, "FromDate không được để trống - Dòng: " + i + ", Cột: " + 7, "");
        //                        }
        //                        else if (!DateTime.TryParse(Convert.ToString(FromDate), out _FromDate))
        //                        {
        //                            return new ResultInfo(500, "FromDate không đúng định dạng - Dòng: " + i + ", Cột: " + 7, "");
        //                        }
        //                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)) && !string.IsNullOrWhiteSpace(Convert.ToString(ToDate)))
        //                        {
        //                            if (!DateTime.TryParse(Convert.ToString(ToDate), out _ToDate))
        //                            {
        //                                return new ResultInfo(500, "ToDate không đúng định dạng - Dòng: " + i + ", Cột:" + 7, "");
        //                            }
        //                        }
        //                        for (int j = 9; j <= endColumn; j++)
        //                        {
        //                            if (!string.IsNullOrEmpty(Convert.ToString(wsOOL.Cells[i, j].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(wsOOL.Cells[i, j].Value)))
        //                            {
        //                                if (!int.TryParse(wsOOL.Cells[i, j].Value.ToString(), out TargetValue))
        //                                {
        //                                    return new ResultInfo(500, "Target không đúng địng dạng - Dòng: " + i + ", Cột:" + j, "");
        //                                }
        //                                var locationName = Convert.ToString(wsOOL.Cells[4, j].Value).Trim();
        //                                listLocation.Add(locationName);
        //                                listTargetValue.Add(TargetValue);
        //                            }
        //                        }
        //                        for (int t = 0; t < listLocation.Count; t++)
        //                        {

        //                            var itemOOLTarget = new OOLTargetsModel();
        //                            itemOOLTarget.ShopId = ShopId;
        //                            itemOOLTarget.ShopCode = Convert.ToString(ShopCode).Trim();
        //                            itemOOLTarget.Division = Convert.ToString(Division).Trim();
        //                            itemOOLTarget.DivisionId = DivisionId;
        //                            itemOOLTarget.BrandId = BrandId;
        //                            itemOOLTarget.Brand = (string.IsNullOrEmpty(Convert.ToString(Brand)) || string.IsNullOrWhiteSpace(Convert.ToString(Brand))) ? null : Convert.ToString(Brand);
        //                            itemOOLTarget.LocationName = listLocation[t];
        //                            itemOOLTarget.Target = listTargetValue[t];
        //                            itemOOLTarget.Type = 2;
        //                            itemOOLTarget.FromDate = _FromDate;
        //                            itemOOLTarget.ToDate = (string.IsNullOrEmpty(ToDate.ToString()) || string.IsNullOrWhiteSpace(ToDate.ToString())) ? null : (DateTime?)Convert.ToDateTime(ToDate);
        //                            dataImport.Add(itemOOLTarget);
        //                        }

        //                    }
        //                    if (dataImport.Count > 0)
        //                    {
        //                        string dataJson = JsonConvert.SerializeObject(dataImport);
        //                        int resultImport = await Task.Run(() => _service.OOLTarget_Import(UserId, AccountId, dataJson));
        //                        if (resultImport > 0)
        //                        {
        //                            return new ResultInfo(200, "Thành công", "");
        //                        }
        //                        else
        //                            return new ResultInfo(500, "Không thành công", "");
        //                    }
        //                    else
        //                        return new ResultInfo(500, "Không có dữ liệu để import", "");
        //                }
        //                return new ResultInfo(500, "Không thành công", "");
        //            }
        //            else
        //            {
        //                return new ResultInfo(500, "Không tồn tại sheet Visibility", "");
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return new ResultInfo(500, ex.Message, "");
        //    }
        //}


    }
}
