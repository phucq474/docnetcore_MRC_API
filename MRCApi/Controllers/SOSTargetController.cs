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

namespace MRCApi.Controllers
{
    public class SOSTargetController : SpiralBaseController
    {
        private readonly ISOSTargetService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IShopService _shopService;
        public SOSTargetController(SOSTargetContext context, IWebHostEnvironment webHost, ShopContext shop)
        {
            _service = new SOSTargetService(context);
            _shopService = new ShopService(shop);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/SOS";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Phân quyền SOS _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_SOSTarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, UserId, JsonData)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["DS SOS"];

                            sheet.Cells[6, 1].LoadFromDataTable(data.Tables[0], false);

                                                      
                            ExcelFormats.Border(sheet, 6, 1, data.Tables[0].Rows.Count + 5, data.Tables[0].Columns.Count);
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["Chuỗi"];

                            sheet.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet.Cells[2, 2, 2, data.Tables[1].Columns.Count + 1], "#F4B084", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 2, 2, data.Tables[1].Rows.Count + 2, data.Tables[1].Columns.Count + 1);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["Loại hàng"];

                            sheet.Cells[2, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet.Cells[2, 2, 2, data.Tables[2].Columns.Count + 1], "#70AD47", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 2, 2, data.Tables[2].Rows.Count + 2, data.Tables[2].Columns.Count + 1);
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
        public async Task<ResultInfo> Template([FromHeader] string JsonData)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/SOS";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Đăng ký Phân quyền SOS _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_SOSTarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, UserId, null)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        var sheet = pk.Workbook.Worksheets["DS SOS"];
                        sheet.Cells[6, 1].LoadFromDataTable(data.Tables[0], false);
                        sheet.Cells[1, 1].Value = "ĐĂNG KÝ PHÂN QUYỀN SOS";
                    
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet1 = pk.Workbook.Worksheets["Chuỗi"];

                            sheet1.Cells[2, 2].LoadFromDataTable(data.Tables[1], true);
                            ExcelFormats.FormatCell(sheet1.Cells[2, 2, 2, data.Tables[1].Columns.Count + 1], "#F4B084", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet1, 2, 2, data.Tables[1].Rows.Count + 2, data.Tables[1].Columns.Count + 1);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet2 = pk.Workbook.Worksheets["Loại hàng"];

                            sheet2.Cells[2, 2].LoadFromDataTable(data.Tables[2], true);
                            ExcelFormats.FormatCell(sheet2.Cells[2, 2, 2, data.Tables[2].Columns.Count + 1], "#70AD47", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet2, 2, 2, data.Tables[2].Rows.Count + 2, data.Tables[2].Columns.Count + 1);
                        }

                        pk.Save();
                        return (new ResultInfo(1, "Xuất File mẫu thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }
        
        public class SOSTarget_Import
        {
            public int? CustomerId { get; set; }
            public int? ShopId { get; set; }
            public int? DivisionId { get; set; }
            public int? BrandId { get; set; }
            public int? CategoryId { get; set; }
            public int? RefId { get; set; }
            public string RefName { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string Unit { get; set; }
            public decimal? Standard { get; set; }
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
                        if (package != null && package.Workbook.Worksheets["DS SOS"] != null)
                        {
                            try
                            {
                                List<SOSTarget_Import> dataImport = new List<SOSTarget_Import>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["DS SOS"];
                                var listShop = _shopService.GetList(AccountId);

                                if (sheet != null)
                                {
                                    // Check data input
                                    #region Check data input
                                    for (int row = 6; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        SOSTarget_Import item = new SOSTarget_Import();
                                        var CustomerId = sheet.Cells[row, 2].Value;
                                        var ShopCode = sheet.Cells[row, 4].Value;
                                        var DivisionId = sheet.Cells[row, 6].Value;
                                        var BrandId = sheet.Cells[row, 8].Value;
                                        var CategoryId = sheet.Cells[row, 10].Value;
                                        var Unit = sheet.Cells[row, 12].Value;
                                        var FromDate = sheet.Cells[row, 13].Value;
                                        var ToDate = sheet.Cells[row, 14].Value;
                                        var Standard = sheet.Cells[row, 15].Value;

                                        #region check
                                        DateTime checkDate;
                                        int? ShopId = 0;
                                
                                        if (string.IsNullOrEmpty(Convert.ToString(CustomerId)))
                                        {
                                            return new ResultInfo(0, "Id Chuỗi : không được để trống - Cell[" + row + ",2]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                                        {
                                            var shop = listShop.Where(c => c.ShopCode == Convert.ToString(ShopCode).Trim()).FirstOrDefault();
                                            if(shop != null)
                                            {
                                                ShopId = shop.Id;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã điểm bán : không tồn tại - Cell[" + row + ",4]", "");
                                            }
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(BrandId).Trim()) && string.IsNullOrEmpty(Convert.ToString(CategoryId).Trim()) && string.IsNullOrEmpty(Convert.ToString(DivisionId).Trim()))
                                        {
                                            return new ResultInfo(0, "Id Ngành hàng : không được để trống - Cell[" + row + ",6]", "");
                                        }
                                      
                                        if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(0, "Ngày bắt đầu : không được để trống - Cell[" + row + ",13]", "");
                                        }
                                        else
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(FromDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(0, "Ngày bắt đầu : không đúng định dạng - Cell[" + row + ",13]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {                                      
                                            if (!DateTime.TryParseExact(Convert.ToString(ToDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(0, "Ngày kết thúc : không đúng định dạng - Cell[" + row + ",14]", "");
                                            }
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Unit)))
                                        {
                                            return new ResultInfo(0, "Quy cách đo : không được để trống - Cell[" + row + ",12]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Standard)) && !string.IsNullOrWhiteSpace(Convert.ToString(Standard)))
                                        {
                                            item.Standard = Convert.ToDecimal(Standard);
                                        }

                                        #endregion check

                                        #region add
                                        item.Unit = Convert.ToString(Unit);
                                        item.CustomerId = Convert.ToInt32(CustomerId);
                                        if (ShopId > 0) { item.ShopId = ShopId; }
                                        if (!string.IsNullOrEmpty(Convert.ToString(DivisionId))) item.DivisionId = Convert.ToInt32(DivisionId);
                                        if (!string.IsNullOrEmpty(Convert.ToString(BrandId))) item.BrandId = Convert.ToInt32(BrandId);
                                        if (!string.IsNullOrEmpty(Convert.ToString(CategoryId))) item.CategoryId = Convert.ToInt32(CategoryId);

                                        if (string.IsNullOrEmpty(Convert.ToString(CategoryId).Trim()))
                                        {
                                            item.RefId = Convert.ToInt32(BrandId);
                                            item.RefName = "BrandId";
                                        }
                                        else if (string.IsNullOrEmpty(Convert.ToString(BrandId).Trim()))
                                        {
                                            item.RefId = Convert.ToInt32(DivisionId);
                                            item.RefName = "DivisionId";
                                        }
                                        else
                                        {
                                            item.RefId = Convert.ToInt32(CategoryId);
                                            item.RefName = "CategoryId";
                                        }

                                        item.FromDate = Convert.ToString(FromDate);
                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate))) { item.ToDate = Convert.ToString(ToDate); }

                                        #endregion add
                                        dataImport.Add(item);
                                    }
                                    #endregion Check data input

                                    // Send data import
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(AccountId, UserId, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import Thành công: {0} dòng", dataImport.Count), "");
                                        }
                                    }

                                }
                                return new ResultInfo(0, "File rỗng", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), ex.StackTrace.ToString());
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "File rỗng", "");
        }
    }
}
