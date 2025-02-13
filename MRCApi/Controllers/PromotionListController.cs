using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
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
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class PromotionListController : SpiralBaseController
    {
        private readonly IPromotionListService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public PromotionListController(PromotionListContext context, IWebHostEnvironment webHost)
        {
            _service = new PromotionListService(context);
            this._webHostEnvironment = webHost;
        }

        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, JsonData));
                return data.Result;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(AccountId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest("Thất bại");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
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
                return BadRequest("Thất bại");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] int Id)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Delete(Id));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Xóa thành công", "");
                }
                return new ResultInfo(500, "Xóa thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/Promotion";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Promotion List_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_PromotionList_V2.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export_PromotionList(AccountId, JsonData)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["PromotionList"];

                            sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], false);

                            //ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[3,1, sheet.Dimension.End.Row, 6].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        if (data.Tables[1].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Account"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[1], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Division"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[2], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }

                        if (data.Tables[3].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Promotion Type"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[3], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
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
        public async Task<ResultInfo> Template()
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/Promotion";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Đăng ký Chương trình khuyến mãi _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_PromotionList_V2.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export_PromotionList(AccountId, null)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        var sheet = pk.Workbook.Worksheets["PromotionList"];

                        //ExcelFormats.FormatCell(sheet.Cells[2, 1, 2, sheet.Dimension.End.Column], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                        //ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        //sheet.Cells[2, 1, 2, 9].AutoFitColumns();

                        if (data.Tables[1].Rows.Count > 0)
                        {

                            var sheet1 = pk.Workbook.Worksheets["Account"];

                            sheet1.Cells[3, 2].LoadFromDataTable(data.Tables[1], false);
                            sheet1.Cells[3, 2, sheet1.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet1.Cells[2, 2, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet1, 3, 2, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {

                            var sheet2 = pk.Workbook.Worksheets["Division"];

                            sheet2.Cells[3, 2].LoadFromDataTable(data.Tables[2], false);
                            sheet2.Cells[3, 2, sheet2.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet2.Cells[2, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet2, 3, 2, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column);
                        }

                        if (data.Tables[3].Rows.Count > 0)
                        {

                            var sheet3 = pk.Workbook.Worksheets["Promotion Type"];

                            sheet3.Cells[3, 2].LoadFromDataTable(data.Tables[3], false);
                            sheet3.Cells[3, 2, sheet3.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet3.Cells[2, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet3, 3, 2, sheet3.Dimension.End.Row, sheet3.Dimension.End.Column);
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

        public class PromotionList_Import
        {
            public string PromotionCode { get; set; }
            public string PromotionName { get; set; }
            public int? DivisionId { get; set; }
            public int? account_Id { get; set; }
            public string FromDate { get; set; }
            public string ToDate { get; set; }
            public string PromotionType { get; set; }
            public int? BrandId { get; set; }
            public int? CategoryId { get; set; }
            public string GroupName { get; set; }
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
                        if (package != null && package.Workbook.Worksheets["PromotionList"] != null)
                        {
                            try
                            {
                                List<PromotionList_Import> dataImport = new List<PromotionList_Import>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["PromotionList"];

                                if (sheet != null)
                                {
                                    // Check data input
                                    #region Check data input
                                    for (int row = 3; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        PromotionList_Import item = new PromotionList_Import();

                                        var account_Id = sheet.Cells[row, 2].Value;
                                        var DivisionId = sheet.Cells[row, 4].Value;
                                        var BrandId = sheet.Cells[row, 6].Value;
                                        var CategoryId = sheet.Cells[row, 8].Value;
                                        var GroupName = sheet.Cells[row, 10].Value;
                                        var PromotionCode = sheet.Cells[row, 11].Value;
                                        var PromotionName = sheet.Cells[row, 12].Value;
                                        var FromDate = sheet.Cells[row, 13].Value;
                                        var ToDate = sheet.Cells[row, 14].Value;
                                        var PromotionType = sheet.Cells[row, 15].Value;

                                        #region check
                                        DateTime checkDate;

                                        if (string.IsNullOrEmpty(Convert.ToString(account_Id)))
                                        {
                                            return new ResultInfo(0, "AccountCode : không được để trống - Cell[" + row + ",2]", "");
                                        }
                                        if (string.IsNullOrEmpty(Convert.ToString(DivisionId)))
                                        {
                                            return new ResultInfo(0, "DivisionCode: không được để trống - Cell[" + row + ",4]", "");
                                        }
                                        if (string.IsNullOrEmpty(Convert.ToString(PromotionCode)))
                                        {
                                            return new ResultInfo(0, "PromotionCode : không được để trống - Cell[" + row + ",11]", "");
                                        }
                                        if (string.IsNullOrEmpty(Convert.ToString(PromotionName)))
                                        {
                                            return new ResultInfo(0, "PromotionName : không được để trống - Cell[" + row + ",12]", "");
                                        }
                                        
                                        if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(0, "FromDate : không được để trống - Cell[" + row + ",13]", "");
                                        }
                                        else
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(FromDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(0, "FromDate : không đúng định dạng - Cell[" + row + ",13]", "");
                                            }
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {
                                            //return new ResultInfo(0, "Ngày kết thúc : không được để trống - Cell[" + row + ",22]", "");
                                        }
                                        else
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(ToDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(0, "ToDate : không đúng định dạng - Cell[" + row + ",14]", "");
                                            }
                                        }

                                        #endregion check

                                        #region add
                                        if (!string.IsNullOrEmpty(Convert.ToString(account_Id))) item.account_Id = Convert.ToInt32(account_Id);
                                        if (!string.IsNullOrEmpty(Convert.ToString(DivisionId))) item.DivisionId = Convert.ToInt32(DivisionId);
                                        item.PromotionCode = Convert.ToString(PromotionCode);
                                        item.PromotionName = Convert.ToString(PromotionName);
                                        item.FromDate = Convert.ToString(FromDate);
                                        item.ToDate = Convert.ToString(ToDate);
                                        item.PromotionType = Convert.ToString(PromotionType);
                                        if (!string.IsNullOrEmpty(Convert.ToString(BrandId))) item.BrandId = Convert.ToInt32(BrandId);
                                        if (!string.IsNullOrEmpty(Convert.ToString(CategoryId))) item.CategoryId = Convert.ToInt32(CategoryId);
                                        item.GroupName = Convert.ToString(GroupName);

                                        #endregion add
                                        dataImport.Add(item);
                                    }
                                    #endregion Check data input

                                    // Send data import
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(AccountId, json));
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

        [HttpGet("GetDivisionList")]
        public ActionResult<DataTable> GetDivisionList()
        {
            var data = _service.GetDivisionList(AccountId);
            return data.Result;
        }

        [HttpGet("GetListPromotionType")]
        public ActionResult<DataTable> GetListPromotionType()
        {
            var data = _service.GetListPromotionType(AccountId);
            return data.Result;
        }
    }
}
