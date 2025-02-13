using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;
using Microsoft.AspNetCore.Hosting;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralEntity.Models;
using System.IO;

namespace MRCApi.Controllers
{
    public class SOSListController : SpiralBaseController
    {
        private readonly ISOSListService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public SOSListController(SOSListContext context, IWebHostEnvironment webHostEnvironment)
        {
            _service = new SOSListService(context);
            _webHostEnvironment = webHostEnvironment;
        }
        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(accId ?? AccountId,UserId,null));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(accId ?? AccountId, UserId, JsonData));
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
        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] int? accId)
        {
            try
            {
                //var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);

                string folder = _webHostEnvironment.WebRootPath;
                string subfoler = "export/" + AccountId.ToString() + "/SOSList";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                }
                string fileName = "SOS List_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
                string fileExport = Path.Combine(folder, subfoler, fileName);
                FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_SOSList.xlsx"));
                FileInfo file = fileInfo.CopyTo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataTable dt = await Task.Run(() => _service.Export(accId ?? AccountId, UserId, null)))
                {
                    if (dt.Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            ExcelWorksheet ws = pk.Workbook.Worksheets[0];
                            if (ws != null)
                            {
                                ws.Cells[4, 1].LoadFromDataTable(dt, false);
                                ExcelFormats.Border(ws, 4, 1, ws.Dimension.Rows, ws.Dimension.Columns);
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
    }
}
