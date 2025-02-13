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
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class SuppliersController : SpiralBaseController
    {
        private readonly ISuppliersService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public SuppliersController(SuppliersContext context, IWebHostEnvironment webHost)
        {
            _service = new SuppliersService(context);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("GetList")]
        public async Task<List<SuppliersEntity>> GetList()
        {
            var data = _service.GetList(AccountId);
            return await data;
        }
        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter ([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest("No data");
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
                Task<DataTable> data = Task.Run(() => _service.Insert(AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest("Insert không thành công");
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
                return BadRequest("Update không thành công");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Suppliers_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Suppliers.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.Export(AccountId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets["Suppliers"];
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
                return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
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
            string fileName = $"Suppliers_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Suppliers.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            return (new ResultInfo(1, "Xuất Template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
        }
        public class SuppliersImport
        {
            public string SupplierCode { get; set; }
            public string SupplierName { get; set; }
            public string Contact { get; set; }
            public string Address { get; set; }
            public string Phone { get; set; }
            public string Fax { get; set; }
            public string FullName { get; set; }
            public int? OrderBy { get; set; }
            public string Status { get; set; }
        }
        [HttpPost("Import")]
        public async Task<ActionResult<ResultInfo>> Import([FromForm] IFormCollection ifile)
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
                                List<SuppliersImport> dataImport = new List<SuppliersImport>();
                                ExcelWorksheet sheet = packpage.Workbook.Worksheets["Suppliers"];

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        SuppliersImport item = new SuppliersImport();
                                        var SupplierCode = sheet.Cells[row, 2].Value;
                                        var SupplierName = sheet.Cells[row, 3].Value;
                                        var Contact = sheet.Cells[row, 4].Value;
                                        var Address = sheet.Cells[row, 5].Value;
                                        var Phone = sheet.Cells[row, 6].Value;
                                        var Fax = sheet.Cells[row, 7].Value;
                                        var FullName = sheet.Cells[row, 8].Value;
                                        var OrderBy = sheet.Cells[row, 9].Value;
                                        var Status = sheet.Cells[row, 10].Value;

                                        if (string.IsNullOrEmpty(Convert.ToString(SupplierCode)))
                                        {
                                            return new ResultInfo(0, "SupplierCode không được để trống - Cell[" + row + ",2]", null);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(SupplierName)))
                                        {
                                            return new ResultInfo(0, "SupplierName không được để trống - Cell[" + row + ",3]", null);
                                        }

                                     
                                        // Add data
                                        item.SupplierCode = Convert.ToString(SupplierCode);
                                        item.SupplierName = Convert.ToString(SupplierName);

                                        if (!string.IsNullOrEmpty(Convert.ToString(Contact)))
                                        {
                                            item.Contact = Convert.ToString(Contact);
                                        }
                                        else
                                        {
                                            item.Contact = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Address)))
                                        {
                                            item.Address = Convert.ToString(Address);
                                        }
                                        else
                                        {
                                            item.Address = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Phone)))
                                        {
                                            item.Phone = Convert.ToString(Phone);
                                        }
                                        else
                                        {
                                            item.Phone = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(Fax)))
                                        {
                                            item.Fax = Convert.ToString(Fax);
                                        }
                                        else
                                        {
                                            item.Fax = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(FullName)))
                                        {
                                            item.FullName = Convert.ToString(FullName);
                                        }
                                        else
                                        {
                                            item.FullName = null;
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(OrderBy)))
                                        {
                                            item.OrderBy = Convert.ToInt32(OrderBy);
                                        }
                                        else
                                        {
                                            item.OrderBy = null;
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
                                        var value = Task.Run(() => _service.Import(AccountId, jsondata)).Result;
                                        if (value > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} row", dataImport.Count), null);
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
