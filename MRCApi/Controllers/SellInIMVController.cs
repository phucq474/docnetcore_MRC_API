using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
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
    public class SellInIMVController : SpiralBaseController
    {
        private readonly ISellInIMVService _service;
        private readonly IShopService _shopService;
        private readonly IEmployeeService _employeeService;
        private readonly IProductCategoriesService _productCategoriesService;
        private readonly IWebHostEnvironment _webHostEnvironment;

        public SellInIMVController(SellInIMVContext context, ShopContext shopContext, EmployeeContext employeeContext, ProductCategoriesContext productCategoriesContext, IWebHostEnvironment webHost)
        {
            _service = new SellInIMVService(context);
            _shopService = new ShopService(shopContext);
            _employeeService = new EmployeeService(employeeContext);
            _productCategoriesService = new ProductCategoriesService(productCategoriesContext);
            this._webHostEnvironment = webHost;
        }

        [HttpGet("GetList")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData, [FromHeader] int? accId)
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
        [HttpGet("GetTemplate")]
        public async Task<ResultInfo> GetTemplate([FromHeader] int? accId)
        {
            try
            {
                //var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);

                string folder = _webHostEnvironment.WebRootPath;
                string subfoler = "export/" + AccountId.ToString() + "/SellIn";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                }
                string fileName = "Data SellIn_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
                string fileExport = Path.Combine(folder, subfoler, fileName);
                FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_IMV/tmp_SellIn.xlsx"));
                FileInfo file = fileInfo.CopyTo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataSet ds = await Task.Run(() => _service.GetTemplate(accId ?? AccountId, UserId, null)))
                {
                    if (ds.Tables.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            ExcelWorksheet wsCate = pk.Workbook.Worksheets.Add("Ngành Hàng");
                            if (wsCate != null)
                            {
                                wsCate.Cells[1, 1].LoadFromDataTable(ds.Tables[0], true);
                                ExcelFormats.FormatCell(wsCate.Cells[1, 1, 1, wsCate.Dimension.Columns], "lightblue", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(wsCate, 1, 1, wsCate.Dimension.Rows, wsCate.Dimension.Columns);
                            }
                            ExcelWorksheet wsCus = pk.Workbook.Worksheets.Add("Customer");
                            if (wsCus != null)
                            {
                                wsCus.Cells[1, 1].LoadFromDataTable(ds.Tables[1], true);
                                ExcelFormats.FormatCell(wsCus.Cells[1, 1, 1, wsCus.Dimension.Columns], "lightblue", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(wsCus, 1, 1, wsCus.Dimension.Rows, wsCus.Dimension.Columns);
                            }
                            pk.Save();
                        }
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", null);
                    }
                }
                return new ResultInfo(200, "Successful", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }
        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);

                string folder = _webHostEnvironment.WebRootPath;
                string subfoler = "export/" + AccountId.ToString() + "/SellIn";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                }
                string fileName = "Data SellIn_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
                string fileExport = Path.Combine(folder, subfoler, fileName);
                FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_IMV/tmp_SellIn.xlsx"));
                FileInfo file = fileInfo.CopyTo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataSet ds = await Task.Run(() => _service.Export (accId ?? AccountId, UserId, JsonData)))
                {
                    if (ds.Tables.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            ExcelWorksheet wsActual = pk.Workbook.Worksheets["Actual"];
                            if (wsActual != null)
                            {
                                wsActual.Cells[4, 1].LoadFromDataTable(ds.Tables[0], false);
                                if (!string.IsNullOrEmpty(Convert.ToString(wsActual.Cells[4, wsActual.Dimension.Columns].Value)))
                                {
                                    wsActual.Cells[1, 2].Value = wsActual.Cells[4, wsActual.Dimension.Columns].Value;
                                    wsActual.DeleteColumn(wsActual.Dimension.Columns);
                                }
                                ExcelFormats.Border(wsActual, 4, 1, wsActual.Dimension.Rows , wsActual.Dimension.Columns);
                            }
                            ExcelWorksheet wsTarget = pk.Workbook.Worksheets["Target"];
                            if (wsTarget != null)
                            {
                                wsTarget.Cells[4, 1].LoadFromDataTable(ds.Tables[1], false);
                                wsTarget.Cells[1, 2].Value = dataJson.Year;
                                wsTarget.Cells[1, 4].Value = dataJson.Month;
                                ExcelFormats.Border(wsTarget, 4, 1, wsTarget.Dimension.Rows, wsTarget.Dimension.Columns);
                            }
                            pk.Save();
                        }
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", null);
                    }
                }
                return new ResultInfo(200, "Successful", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            try
            {
                string folder = _webHostEnvironment.WebRootPath;
                string subfoler = "export/" + AccountId.ToString() + "/Import";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                }
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                string fileName = "SellIn_Import_Error" + string.Format("{0:yyyyMMdd_HHmmss}", DateTime.Now) + ".xlsx";
                FileInfo fileInfo = new FileInfo(Path.Combine(folder, subfoler, fileName));

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
                            bool isError = false;
                            var lstCat = _productCategoriesService.GetList(accId ?? AccountId);
                            var lstShop = _shopService.GetList(accId ?? AccountId);
                            var lstEmployee = _employeeService.GetList(accId ?? AccountId);
                            List<SellInIMVModel> lstActual = new List<SellInIMVModel>();
                            List<SellInIMVModel> lstTarget = new List<SellInIMVModel>();


                            ExcelWorksheet wsActual = package.Workbook.Worksheets["Actual"];
                            if (wsActual != null)
                            {
                                if (wsActual.Dimension.Rows > 3)
                                {
                                    DateTime checkDate;
                                    string UpToDate = Convert.ToString(wsActual.Cells[1, 2].Value);
                                    int colError = wsActual.Dimension.Columns + 1;
                                    if (string.IsNullOrEmpty(UpToDate))
                                    {
                                        return new ResultInfo(0, string.Format("Ngày Up To Date không được để trống"), null);
                                    }
                                    else
                                    {
                                        if (!DateTime.TryParseExact(Convert.ToString(UpToDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                        {
                                            return new ResultInfo(0, string.Format("Ngày Up To Date không đúng định dạng yyyy-MM-dd"), null);
                                        }
                                    }

                                    // Check data input
                                    for (int row = 4; row <= wsActual.Dimension.End.Row; row++)
                                    {
                                        var area = Convert.ToString(wsActual.Cells[row, 1].Value);
                                        var division = Convert.ToString(wsActual.Cells[row, 2].Value);
                                        var brand = Convert.ToString(wsActual.Cells[row, 3].Value);
                                        var customer = Convert.ToString(wsActual.Cells[row, 4].Value);
                                        var shopCode = Convert.ToString(wsActual.Cells[row, 5].Value);
                                        var custCode = Convert.ToString(wsActual.Cells[row, 6].Value);
                                        var shopName = Convert.ToString(wsActual.Cells[row, 7].Value);
                                        var quantity = Convert.ToString(wsActual.Cells[row, 8].Value);
                                        var amount = Convert.ToString(wsActual.Cells[row, 9].Value);
                                        var kamCode = Convert.ToString(wsActual.Cells[row, 10].Value);
                                        var sssCode = Convert.ToString(wsActual.Cells[row, 12].Value);
                                        var ssCode = Convert.ToString(wsActual.Cells[row, 14].Value);
                                        var srCode = Convert.ToString(wsActual.Cells[row, 16].Value);
                                        var pgCode = Convert.ToString(wsActual.Cells[row, 18].Value);

                                        SellInIMVModel sellInIMVModel = new SellInIMVModel();
                                        sellInIMVModel.UpToDate = Convert.ToInt32(string.Format("{0:yyyyMMdd}", checkDate));
                                        sellInIMVModel.Year = checkDate.Year;
                                        sellInIMVModel.Month = checkDate.Month;

                                        if (string.IsNullOrEmpty(area))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 1], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Area không được để trống";
                                        }
                                        else sellInIMVModel.Area = area;

                                        if (string.IsNullOrEmpty(division))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 2], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Ngành hàng tổng không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstCat.Where(c => c.Division == division).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 2], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Ngành hàng tổng không có trên hệ thống";
                                            }
                                            else
                                                sellInIMVModel.DivisionId = item.DivisionId;
                                        }

                                        if (string.IsNullOrEmpty(brand))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 3], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Brand không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstCat.Where(c => c.Brand == brand).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 3], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Brand không có trên hệ thống";
                                            }
                                            else
                                                sellInIMVModel.BrandId = item.BrandId;
                                        }
                                        if (string.IsNullOrEmpty(customer))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 4], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Customer chung không được để trống";
                                        }
                                        else sellInIMVModel.Customer = customer;

                                        if (string.IsNullOrEmpty(shopCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 5], "yellow");
                                            wsActual.Cells[row, colError].Value = "- ShopCode không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstShop.Where(c => c.ShopCode == shopCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 5], "yellow");
                                                wsActual.Cells[row, colError].Value = "- ShopCode không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.ShopId = item.Id;
                                                sellInIMVModel.ShopCode = shopCode;
                                            }
                                        }
                                        if (string.IsNullOrEmpty(custCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 6], "yellow");
                                            wsActual.Cells[row, colError].Value = "- CustCode chung không được để trống";
                                        }
                                        else sellInIMVModel.CustCode = custCode;

                                        if (string.IsNullOrEmpty(shopName))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 7], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Customer name chung không được để trống";
                                        }
                                        else sellInIMVModel.ShopName = shopName;

                                        if (!string.IsNullOrEmpty(quantity))
                                        {
                                            int tmp;
                                            if (Int32.TryParse(quantity, out tmp))
                                            {
                                                sellInIMVModel.Quantity = tmp;
                                            }
                                            else
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 8], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Quantity không hợp lệ";
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(amount))
                                        {
                                            float tmp;
                                            if (float.TryParse(amount, out tmp))
                                            {
                                                sellInIMVModel.Amount = tmp;
                                            }
                                            else
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 9], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Amount không hợp lệ";
                                            }
                                        }
                                        if (string.IsNullOrEmpty(kamCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 10], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Mã KAM không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == kamCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 10], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Mã KAM không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.KAMId = item.Id;
                                                sellInIMVModel.KAMCode = kamCode;
                                                sellInIMVModel.KAMName=item.FullName;
                                            }
                                        }
                                        if (string.IsNullOrEmpty(sssCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsActual.Cells[row, 12], "yellow");
                                            wsActual.Cells[row, colError].Value = "- Mã 3S không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == sssCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 12], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Mã 3S không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.SSSId = item.Id;
                                                sellInIMVModel.SSSCode = item.EmployeeCode;
                                                sellInIMVModel.SSSName = item.FullName;
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(ssCode))
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == ssCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 14], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Mã Sales Sup không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.SSId = item.Id;
                                                sellInIMVModel.SSCode = item.EmployeeCode;
                                                sellInIMVModel.SSName= item.FullName;
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(srCode))
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == srCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 16], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Mã SR không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.SRId = item.Id;
                                                sellInIMVModel.SRCode = item.EmployeeCode;
                                                sellInIMVModel.SRName= item.FullName;
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(pgCode))
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == pgCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsActual.Cells[row, 18], "yellow");
                                                wsActual.Cells[row, colError].Value = "- Mã PG  không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.PGId = item.Id;
                                                sellInIMVModel.PGCode = item.EmployeeCode;
                                                sellInIMVModel.PGName= item.FullName;
                                            }
                                        }
                                        lstActual.Add(sellInIMVModel);
                                    }
                                }
                            }
                            ExcelWorksheet wsTarget = package.Workbook.Worksheets["Target"];
                            if (wsTarget != null)
                            {
                                if (wsTarget.Dimension.Rows > 3)
                                {
                                    int Year=0, Month = 0;
                                    string year = Convert.ToString(wsTarget.Cells[1, 2].Value);
                                    string month = Convert.ToString(wsTarget.Cells[1, 4].Value);
                                    int colError = wsTarget.Dimension.Columns + 1;
                                    if (string.IsNullOrEmpty(year))
                                    {
                                        return new ResultInfo(0, string.Format("Year không được để trống"), null);
                                    }
                                    else
                                    {
                                        int tmp;
                                        if (Int32.TryParse(year, out tmp))
                                        {
                                            Year = tmp;
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, string.Format("Year không hợp lệ"), null);
                                        }
                                    }
                                    if (string.IsNullOrEmpty(month))    
                                    {
                                        return new ResultInfo(0, string.Format("Month không được để trống"), null);
                                    }
                                    else
                                    {
                                        int tmp;
                                        if (Int32.TryParse(month, out tmp))
                                        {
                                            Month = tmp;
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, string.Format("Month không hợp lệ"), null);
                                        }
                                    }
                                    // Check data input
                                    for (int row = 4; row <= wsTarget.Dimension.End.Row; row++)
                                    {
                                        var area = Convert.ToString(wsTarget.Cells[row, 1].Value);
                                        var division = Convert.ToString(wsTarget.Cells[row, 2].Value);
                                        var brand = Convert.ToString(wsTarget.Cells[row, 3].Value);
                                        var customer = Convert.ToString(wsTarget.Cells[row, 4].Value);
                                        var shopCode = Convert.ToString(wsTarget.Cells[row, 5].Value);
                                        var custCode = Convert.ToString(wsTarget.Cells[row, 6].Value);
                                        var shopName = Convert.ToString(wsTarget.Cells[row, 7].Value);
                                        var amount = Convert.ToString(wsTarget.Cells[row, 8].Value);
                                        var kamCode = Convert.ToString(wsTarget.Cells[row, 9].Value);
                                        var sssCode = Convert.ToString(wsTarget.Cells[row, 11].Value);
                                        var ssCode = Convert.ToString(wsTarget.Cells[row, 13].Value);
                                        var srCode = Convert.ToString(wsTarget.Cells[row, 15].Value);
                                        var pgCode = Convert.ToString(wsTarget.Cells[row, 17].Value);

                                        SellInIMVModel sellInIMVModel = new SellInIMVModel();
                                        sellInIMVModel.Year = Year;
                                        sellInIMVModel.Month = Month;

                                        if (string.IsNullOrEmpty(area))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 1], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Area không được để trống";
                                        }
                                        else
                                        {
                                            sellInIMVModel.Area = area;
                                        }
                                        if (string.IsNullOrEmpty(division))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 2], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Ngành hàng tổng không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstCat.Where(c => c.Division == division).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 2], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Ngành hàng tổng không có trên hệ thống";
                                            }
                                            else
                                                sellInIMVModel.DivisionId = item.DivisionId;
                                        }

                                        if (string.IsNullOrEmpty(brand))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 3], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Brand không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstCat.Where(c => c.Brand == brand).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 3], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Brand không có trên hệ thống";
                                            }
                                            else
                                                sellInIMVModel.BrandId = item.BrandId;
                                        }

                                        if (string.IsNullOrEmpty(customer))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 4], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Customer không được để trống";
                                        }
                                        else
                                        {
                                            sellInIMVModel.Customer = customer;
                                        }

                                        if (string.IsNullOrEmpty(shopCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 5], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- ShopCode không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstShop.Where(c => c.ShopCode == shopCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 5], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- ShopCode không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.ShopId = item.Id;
                                                sellInIMVModel.ShopCode = shopCode;
                                            }
                                        }
                                        if (string.IsNullOrEmpty(custCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 6], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- CustCode  không được để trống";
                                        }
                                        else sellInIMVModel.CustCode = custCode;
                                        if (string.IsNullOrEmpty(shopName))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 7], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Customer name không được để trống";
                                        }
                                        else sellInIMVModel.ShopName = shopName;

                                        if (!string.IsNullOrEmpty(amount))
                                        {
                                            float tmp;
                                            if (float.TryParse(amount, out tmp))
                                            {
                                                sellInIMVModel.Amount = tmp;
                                            }
                                            else
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 8], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Amount không hợp lệ";
                                            }
                                        }
                                        if (string.IsNullOrEmpty(kamCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 9], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Mã KAM không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == kamCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 9], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Mã KAM không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.KAMId = item.Id;
                                                sellInIMVModel.KAMCode = kamCode;
                                                sellInIMVModel.KAMName = item.FullName;
                                            }
                                        }
                                        if (string.IsNullOrEmpty(sssCode))
                                        {
                                            isError = true;
                                            ExcelFormats.FormatCell(wsTarget.Cells[row, 11], "yellow");
                                            wsTarget.Cells[row, colError].Value = "- Mã 3S không được để trống";
                                        }
                                        else
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == sssCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 11], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Mã 3S không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.SSSId = item.Id;
                                                sellInIMVModel.SSSCode = item.EmployeeCode;
                                                sellInIMVModel.SSSName= item.FullName;
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(ssCode))
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == ssCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 13], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Mã Sales Sup không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.SSId = item.Id;
                                                sellInIMVModel.SSCode = item.EmployeeCode;
                                                sellInIMVModel.SSName = item.FullName;
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(srCode))
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == srCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 15], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Mã SR không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.SRId = item.Id;
                                                sellInIMVModel.SRCode = item.EmployeeCode;
                                                sellInIMVModel.SRName = item.FullName;
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(pgCode))
                                        {
                                            var item = lstEmployee.Where(c => c.EmployeeCode == pgCode).FirstOrDefault();
                                            if (item == null)
                                            {
                                                isError = true;
                                                ExcelFormats.FormatCell(wsTarget.Cells[row, 17], "yellow");
                                                wsTarget.Cells[row, colError].Value = "- Mã PG  không có trên hệ thống";
                                            }
                                            else
                                            {
                                                sellInIMVModel.PGId = item.Id;
                                                sellInIMVModel.PGCode = item.EmployeeCode;
                                                sellInIMVModel.PGName= item.FullName;
                                            }
                                        }
                                        lstTarget.Add(sellInIMVModel);
                                    }
                                }
                            }
                            if(!isError)
                            {
                                if (lstActual.Count == 0 && lstTarget.Count == 0)
                                {
                                    return new ResultInfo(0, "Không có data để import", null);
                                }
                                else
                                {
                                    var Result = await Task.Run(() => _service.Import(accId ?? AccountId, UserId, JsonConvert.SerializeObject(lstActual), JsonConvert.SerializeObject(lstTarget)));
                                    if (Result > 0)
                                    {
                                        return new ResultInfo(1, string.Format("Import Thành công: {0} dòng", lstActual.Count + lstTarget.Count), null);
                                    }
                                    else
                                    {
                                        return new ResultInfo(0, string.Format("Import Thất bại"), null);
                                    }
                                }
                            }
                            else
                            {
                                package.SaveAs(fileInfo);

                                return new ResultInfo(500, "File Error", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfoler, fileName));
                            }

                        }
                    }
                }
                return new ResultInfo(0, "File rỗng", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message.ToString(), ex.StackTrace.ToString());
            }
        }
    }
}