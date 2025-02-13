using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
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
using Newtonsoft.Json;

namespace MRCApi.Controllers
{
    public class CompetitorController : SpiralBaseController
    {
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ICompetitorService _service;
        public CompetitorController(CompetitorContext _context, IWebHostEnvironment hostingEnvironment)
        {
            _service = new CompetitorService(_context);
            this._hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] int? Id)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, Id));
                return data.Result;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(AccountId,UserId, JsonData));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return Ok(-1);
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
                    return data.Result;
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        // excel
        [HttpGet("Export_Competitor")]
        public async Task<ResultInfo> Export_Competitor([FromHeader] int? Id)
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Competitor_RawData_{AccountId.ToString()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_Competitor_RawData.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = _service.Export_Competitor(AccountId, Id).Result)
                {
                    if (data != null && data.Tables.Count > 0)
                    {
                        using (var package = new ExcelPackage(file))
                        {
                            var sheet1 = package.Workbook.Worksheets["Competitor"];
                            var sheet2 = package.Workbook.Worksheets["Category"];
                            if (sheet1 != null)
                            {
                                await Task.Yield();
                                ExcelFormatTimeShift.BorderCell(sheet1.Cells[4, 1, data.Tables[0].Rows.Count + 3, data.Tables[0].Columns.Count]);
                                //load data
                                sheet1.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);
                                sheet1.Cells[3, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column].AutoFitColumns();
                                sheet1.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            }
                            if (sheet2 != null)
                            {
                                await Task.Yield();
                                ExcelFormatTimeShift.BorderCell(sheet2.Cells[3, 1, data.Tables[1].Rows.Count + 2, data.Tables[1].Columns.Count]);
                                //load data
                                sheet2.Cells[3, 1].LoadFromDataTable(data.Tables[1], false);
                                sheet2.Cells[2, 1, sheet2.Dimension.End.Row, sheet2.Dimension.End.Column].AutoFitColumns();

                            }
                            package.Save();
                        }
                        return (new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));

                    }
                    else
                    {
                        return (new ResultInfo(-1, "No data", null));
                    }
                }
            }
            catch (Exception ex)
            {
                return (new ResultInfo(-2, ex.Message, null));
            }
        }
        [HttpPost("Import_Competitor")]
        public async Task<ActionResult<ResultInfo>> Import_Competitor([FromForm] IFormCollection ifile)
        {
            string folder = _hostingEnvironment.WebRootPath;
            if (ifile != null && ifile.Files.Count > 0)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage packpage = new ExcelPackage(memoryStream))
                    {
                        if (packpage != null && packpage.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                List<CompetitorModel> dataImport = new List<CompetitorModel>();
                                ExcelWorksheet sheet = packpage.Workbook.Worksheets["Competitor"];

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        CompetitorModel item = new CompetitorModel();
                                        var BrandCode = sheet.Cells[row, 2].Value;
                                        var BrandName = sheet.Cells[row, 3].Value;
                                        var Competitor = sheet.Cells[row, 4].Value;
                                        var ListCate = sheet.Cells[row, 5].Value;

                                        if (string.IsNullOrEmpty(Convert.ToString(BrandCode)) && string.IsNullOrEmpty(Convert.ToString(BrandName)) &&
                                            string.IsNullOrEmpty(Convert.ToString(Competitor)) && string.IsNullOrEmpty(Convert.ToString(ListCate))
                                            )
                                        {
                                            continue;
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(BrandCode)))
                                        {
                                            return new ResultInfo(-1, "BrandCode không được để trống. (Row: " + row + " Colum: 2 )", null);

                                        }
                                        if (string.IsNullOrEmpty(Convert.ToString(BrandName)))
                                        {
                                            return new ResultInfo(-1, "BrandName không được để trống. (Row: " + row + " Colum: 3 )", null);
                                        }
                                        if (string.IsNullOrEmpty(Convert.ToString(Competitor)))
                                        {
                                            return new ResultInfo(-1, "Competitor không được để trống. (Row: " + row + " Colum: 4 )", null);
                                        }

                                        // Add data                                        
                                        item.BrandCode = Convert.ToString(BrandCode);
                                        item.BrandName = Convert.ToString(BrandName);
                                        item.Competitor = Convert.ToString(Competitor);
                                        if (string.IsNullOrEmpty(Convert.ToString(ListCate)))
                                        {
                                            item.ListCate = null;
                                        }
                                        else
                                        {
                                            item.ListCate = Convert.ToString(ListCate);
                                        }
                                        dataImport.Add(item);
                                    }
                                    if (dataImport.Count > 0)
                                    {
                                        var value = Task.Run(() => _service.Import_Competitor(AccountId, UserId, JsonConvert.SerializeObject(dataImport))).Result;
                                        if (value > 0)
                                        {
                                            return new ResultInfo(1, "Import data success", null);
                                        }
                                    }
                                }

                                return (new ResultInfo(-1, "Data is empty", null));
                            }
                            catch (Exception ex)
                            {
                                return (new ResultInfo(-2, ex.Message, null));
                            }
                        }
                    }
                }
                return (new ResultInfo(-1, "Data is empty", null));
            }
            else
            {
                return (new ResultInfo(-1, "File not found", null));
            }
        }

        [HttpGet("Filter_CompetitorResult")]
        public ActionResult<DataTable> FilterResult([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter_Competitor_Result(AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception err)
            {
                return BadRequest(err.Message);
            }
        }

        [HttpGet("Export_CompetitorResult")]
        public async Task<ResultInfo> ExportResult([FromHeader] string JsonData)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
                string folder = _hostingEnvironment.WebRootPath;
                string subFolder = "export/Visibility";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subFolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subFolder));
                }
                FileInfo file = null;
                string fileName = $"Competitor_Promotion_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subFolder, fileName);
                file = new FileInfo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var dt = await Task.Run(() => _service.Export_Competitor_Result(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets.Add("Competitor");
                        if (sheet != null)
                        {
                            if (dt.Rows.Count > 0)
                            {
                                // load data
                                sheet.Row(4).Height = 30;
                                sheet.Row(1).Height = 30;
                                sheet.Cells[4, 1].LoadFromDataTable(dt, true);
                                sheet.Cells[1, 1].Value = "COMPETITOR PROMOTION";
                                sheet.Cells[1, 1, 1, dt.Columns.Count].Merge = true;
                                ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, dt.Columns.Count], "#BDD7EE", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                sheet.Cells[2, 1].Value = "Từ ngày: ";
                                sheet.Cells[2, 2].Value = dataJson.fromdate;
                                sheet.Cells[2, 3].Value = "Tới ngày: ";
                                sheet.Cells[2, 4].Value = dataJson.todate;
                                ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, sheet.Dimension.End.Column], "#2F75B5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                sheet.Row(4).Style.Font.Color.SetColor(color: System.Drawing.Color.White);
                                ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[5,sheet.Dimension.End.Column-1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                                sheet.Cells.AutoFitColumns();
                            }
                            else
                                return new ResultInfo(0, "Không có dữ liệu", "");
                        }
                        package.Save();
                    }
                    return (new ResultInfo(200, "Xuất báo cáo thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subFolder, fileName)));
                }
            }
            catch (Exception err)
            {
                return new ResultInfo(500, err.Message, null);
            }
        }

        [HttpGet("Detail_CompetitorResult")]
        public ActionResult<DataTable> DetailResult([FromHeader] int EmployeeId, [FromHeader] int ShopId, [FromHeader] int WorkDate)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Detail_Competitor_Result(EmployeeId, ShopId, WorkDate));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("FilterCompeDetail")]
        public ActionResult<ResultInfo> FilterCompeDetail([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.FilterCompeDetail(AccountId, UserId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No data!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public class CompetitorDetailModel
        {
            public int categoryId { get; set; }
            public string contentName { get; set; }
            public string contentList { get; set; }
            public string fromDate { get; set; }
            public string toDate { get; set; }
        }

        [HttpPost("InsertCompDetail")]
        public ActionResult<ResultInfo> InsertCompDetail([FromBody] CompetitorDetailModel param)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.InsertCompDetail(AccountId, UserId, param.categoryId, param.contentName, param.contentList, param.fromDate, param.toDate));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Insert Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "Failed!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("DeleteCompDetail")]
        public ActionResult<ResultInfo> DeleteCompDetail([FromHeader] int Id)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.DeleteCompDetail(AccountId, UserId, Id));
                if (data.Result > 0)
                {
                    return new ResultInfo(200, "Delete Successfully!", null);
                }
                else
                {
                    return new ResultInfo(500, "Failed!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpGet("GetListCategory")]
        public ActionResult<ResultInfo> GetListCategory()
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetListCategory(AccountId, UserId));
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
    }
}
