using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
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
    public class LanguageController : SpiralBaseController
    {
        public readonly ILanguageResourceService _service;
        public readonly IWebHostEnvironment _webHostEnvironment;

        public LanguageController(LanguageResourcesContext _context, IWebHostEnvironment webHostEnvironment)
        {
            _service = new LanguageResourcesService(_context);
            this._webHostEnvironment = webHostEnvironment;
        }

        [HttpGet("filter")]
        public ActionResult<DataTable> Filter([FromHeader] string resourceName, [FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            Task<DataTable> filter = Task.Run(() => _service.Filter(resourceName, accId.Value));
            return filter.Result;
        }

        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromBody] LanguageResourcesModel language)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(language));
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
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] LanguageResourcesModel language)
        {
            try
            {
                language.AccountId = language.AccountId ?? AccountId;
                Task<DataTable> data = Task.Run(() => _service.Insert(language.AccountId.Value, language));
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
        [HttpPost("Delete")]
        public ActionResult<List<AlertModel>> Delete([FromBody] LanguageResourcesModel language)
        {
            var lis = new List<AlertModel>();
            try
            {
                language.AccountId = language.AccountId ?? AccountId;
                var result = _service.Delete(language, language.AccountId.Value);
                if (result > 0)
                    if (result > 0)
                    lis.Add(new AlertModel(1, "Successful", null));
                else
                    lis.Add(new AlertModel(-1, "Fail", null));
            }
            catch (Exception ex)
            {
                lis.Add(new AlertModel(-1, "Fail", ex.Message));
            }
            return lis;
        }
        [HttpGet("Export")]
        public async Task<List<ResultInfo>> Export([FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            List<ResultInfo> result = new List<ResultInfo>();

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            // ten file xuat
            string fileName = $"LanguagesResource_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            // lay file mau
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_languageResources.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
           
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var package = new ExcelPackage(file))
                {
                    var sheet = package.Workbook.Worksheets["LanguageResources"];
                    if(sheet != null)
                    {
                        await Task.Yield();
                        Task<DataTable> data = Task.Run(() => _service.data_report(accId.Value));
                        if(data.Result.Rows.Count > 0)
                        {
                            sheet.View.ShowGridLines = false;
                            
                            sheet.Cells[4, 1].LoadFromDataTable(data.Result, false);
                            sheet.Cells[2, 1].Value = "Select data with AccountId: " + AccountId;
                            sheet.Cells[2, 3].Value = "Export date: " + DateTime.Now.ToString("dd/MM/yyyy - HH:mm:ss");
                            
                            ExcelFormats.FormatCell_Language(sheet.Cells[4, 1, data.Result.Rows.Count + 3, sheet.Dimension.Columns]); 
                        }
                    }
                    
                    package.Save();
                }
                result.Add(new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                result.Add(new ResultInfo(-1, ex.Message, null));
            }

            return result;
            
        }
        [HttpPost("import")]
        public async Task<List<ResultInfo>> Import([FromForm] IFormCollection ifile)
        {
            List<ResultInfo> result = new List<ResultInfo>();
            string folder = _webHostEnvironment.WebRootPath;
            if(ifile != null && ifile.Files.Count > 0)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        if(package != null && package.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                DataTable dataImport = ImportLanguageResource.TableLanguageResource("LanguageResources");
                                ExcelWorksheet sheet = package.Workbook.Worksheets["LanguageResources"];

                                if (sheet == null)
                                {
                                    sheet = package.Workbook.Worksheets[1];
                                }
                                string alert = ImportLanguageResource.ReadData(ref dataImport, sheet);
                                if (alert.Length > 1)
                                {
                                    result.Add(new ResultInfo(-2, alert, null));
                                }
                                else if (dataImport.Rows.Count > 0)
                                {
                                    var value = Task.Run(() => _service.Import(AccountId, dataImport)).Result;
                                    if (value > 0)
                                    {
                                        result.Add(new ResultInfo(1, "Import data success " + value + " row", null));
                                    }
                                    else
                                    {
                                        result.Add(new ResultInfo(-1, "Fail", null));
                                    }
                                }
                                else
                                {
                                    result.Add(new ResultInfo(-1, "Data is empty", null));
                                }

                            }
                            catch (Exception ex)
                            {
                                result.Add(new ResultInfo(-1, ex.Message, null));
                            }
                            
                        }

                    }
                }
            }
            else
            {
                result.Add(new ResultInfo(-1, "File not found", null));
            }
            return result;
        }
    }
}
