using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class HRController : SpiralBaseController
    {
        private readonly IWebHostEnvironment _webRoot;
        public readonly IHRService _service;
        public HRController(HRContext _context, IWebHostEnvironment host)
        {
            _service = new HRService(_context);
            _webRoot = host;
        }
        [HttpPost("import")]
        public async Task<ActionResult> Import([FromForm] IFormCollection files)
        {
            string sWebRootFolder = _webRoot.WebRootPath;
            if (files != null && files.Files.Count > 0)
            {
                var file = files.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);
                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        string result = "";
                        if (package != null && package.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                DataTable dtImport = HRImport.dtCreate();
                                foreach (ExcelWorksheet sheet in package.Workbook.Worksheets)
                                {
                                    await Task.Run(() => HRImport.ReadData(ref dtImport, sheet));
                                    break;
                                }
                                result = dtImport.Rows.Count + " dòng ";
                            }
                            catch (Exception ex)
                            {
                                throw ex;
                            }
                            return Ok("Đã import"+result);
                        }
                        else
                        {
                            return Ok("File not exist worksheet");
                        }
                    }
                }

            }
            else
            {
                return Ok("File not found");
            }
        }
    }
}
