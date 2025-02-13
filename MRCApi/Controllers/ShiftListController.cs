using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
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
    public class ShiftListController : SpiralBaseController
    {
        private readonly IShiftListService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ShiftListController(ShiftListContext context, IWebHostEnvironment webHost)
        {
            _service = new ShiftListService(context);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("GetList")]
        public ActionResult<List<ShiftListEntity>> GetList([FromHeader] int? accId)
        {
            List<ShiftListEntity> data = _service.GetList(accId ?? AccountId);
            return data;
        }
        [HttpGet("GetShiftGroup")]
        public ActionResult<DataTable> GetShiftGroup([FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetShiftGroup(accId ?? AccountId));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex);
            }
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(accId ?? AccountId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(accId ?? AccountId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                {
                    return Ok(-1);
                }
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(accId ?? AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                {
                    return Ok(-1);
                }
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
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"ShiftList_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_ShiftList.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.Export(accId ?? AccountId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets["ShiftList"];
                        if (sheet != null)
                        {
                            if (data.Rows.Count > 0)
                            {
                                ExcelFormatTimeShift.BorderCell(sheet.Cells[4, 1, data.Rows.Count + 3, data.Columns.Count]);
                                //load data
                                sheet.Cells[4, 1].LoadFromDataTable(data, false);
                            }
                            else
                            {
                                return (new ResultInfo(-1, "No data", null));
                            }
                        }
                       
                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return (new ResultInfo(-2, ex.Message, null));
            }
        }
        [HttpGet("Template")]
        public ResultInfo Template()
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template_ShiftList_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_ShiftList.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            return (new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
        }
        public class ShiftListImport{
            public string ShiftGroup { get; set; }
            public string GroupName { get; set; }
            public string RefCode { get; set; }
            public string ShiftCode { get; set; }
            public string ShiftName { get; set; }
            public string From { get; set; }
            public string To { get; set; }
            public decimal? Value { get; set; }
            public string Note { get; set; }
            public int? Order { get; set; }
            public string Status { get; set; }
        }
        [HttpPost("Import")]
        public async Task<ActionResult<ResultInfo>> EmployeeKPI_Target_Import([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            if (ifile != null && ifile.Files.Count > 0)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage packpage = new ExcelPackage(memoryStream))
                    {
                        if (packpage != null && packpage.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                List<ShiftListImport> dataImport = new List<ShiftListImport>();
                                ExcelWorksheet sheet = packpage.Workbook.Worksheets["ShiftList"];

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        ShiftListImport item = new ShiftListImport();
                                        var ShiftGroup = sheet.Cells[row, 2].Value;
                                        var GroupName = sheet.Cells[row, 3].Value;
                                        var RefCode = sheet.Cells[row, 4].Value;
                                        var ShiftCode = sheet.Cells[row, 5].Value;
                                        var ShiftName = sheet.Cells[row, 6].Value;
                                        var From = sheet.Cells[row, 7].Value;
                                        var To = sheet.Cells[row, 8].Value;
                                        var Value = sheet.Cells[row, 9].Value;
                                        var Note = sheet.Cells[row, 10].Value;
                                        var Order = sheet.Cells[row, 11].Value;
                                        var Status = sheet.Cells[row, 12].Value;

                                        DateTime checkDate;

                                        if (string.IsNullOrEmpty(Convert.ToString(ShiftGroup)))
                                        {
                                            return new ResultInfo(0, "ShiftGroup không được để trống - Cell[" + row + ",2]", null);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(GroupName)))
                                        {
                                            return new ResultInfo(0, "GroupName không được để trống - Cell[" + row + ",3]", null);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(RefCode)))
                                        {
                                            return new ResultInfo(0, "RefCode không được để trống - Cell[" + row + ",4]", null);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ShiftCode)))
                                        {
                                            return new ResultInfo(0, "ShiftCode không được để trống - Cell[" + row + ",5]", null);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ShiftName)))
                                        {
                                            return new ResultInfo(0, "ShiftName không được để trống - Cell[" + row + ",6]", null);
                                        }

                                        //if (string.IsNullOrEmpty(Convert.ToString(From)) && Convert.ToString(RefCode) == "ON" && !Convert.ToString(ShiftCode).Contains("/2"))
                                        //{
                                        //    return new ResultInfo(0, "From không được để trống - Cell[" + row + ",7]", null);
                                        //}
                                        //else
                                        //{
                                        if (!string.IsNullOrEmpty(Convert.ToString(From)))
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(From).Trim(), "HH:mm", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(0, "From không đúng định dạng - Cell[" + row + ",7]", "");
                                            }
                                        }

                                        //}

                                        //if (string.IsNullOrEmpty(Convert.ToString(To)) && Convert.ToString(RefCode) == "ON" && !Convert.ToString(ShiftCode).Contains("/2"))
                                        //{
                                        //    return new ResultInfo(0, "To không được để trống - Cell[" + row + ",8]", null);
                                        //}
                                        //else
                                        //{
                                        if (!string.IsNullOrEmpty(Convert.ToString(To)))
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(To).Trim(), "HH:mm", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(0, "To không đúng định dạng - Cell[" + row + ",8]", "");
                                            }
                                        }

                                        //}

                                        //if (string.IsNullOrEmpty(Convert.ToString(Value)))
                                        //{
                                        //    return new ResultInfo(0, "Value không được để trống - Cell[" + row + ",9]", null);
                                        //}
                                        //else 
                                        //{
                                        if (!string.IsNullOrEmpty(Convert.ToString(Value)))
                                        {
                                            if (Convert.ToString(RefCode) == "ON")
                                            {
                                                decimal? v = Convert.ToDecimal(Value);
                                                if (v <= 0)
                                                {
                                                    return new ResultInfo(0, "Value phải lớn hơn 0 - Cell[" + row + ",9]", null);
                                                }
                                            }
                                        }
                                        //}


                                        // Add data
                                        item.ShiftGroup = Convert.ToString(ShiftGroup);
                                        item.GroupName = Convert.ToString(GroupName);
                                        item.RefCode = Convert.ToString(RefCode);
                                        item.ShiftCode = Convert.ToString(ShiftCode);
                                        item.ShiftName = Convert.ToString(ShiftName);
                                        item.From = Convert.ToString(From);
                                        item.To = Convert.ToString(To);
                                       
                                        if (!string.IsNullOrEmpty(Convert.ToString(Value)))
                                        {
                                            item.Value = Convert.ToDecimal(Value);
                                        }
                                        else
                                        {
                                            item.Value = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Note)))
                                        {
                                            item.Note = Convert.ToString(Note);
                                        }
                                        else
                                        {
                                            item.Note = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Order)))
                                        {
                                            item.Order = Convert.ToInt32(Order);
                                        }
                                        else
                                        {
                                            item.Order = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Status)))
                                        {
                                            item.Status = Convert.ToString(Status);
                                        }
                                        else
                                        {
                                            item.Status = null;
                                        }

                                        dataImport.Add(item);
                                    }
                                    if (dataImport.Count > 0)
                                    {
                                        string jsondata = JsonConvert.SerializeObject(dataImport);
                                        var value = Task.Run(() => _service.Import(accId ?? AccountId, jsondata)).Result;
                                        if (value > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import data success: {0} row", dataImport.Count), null);
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
    }
}
