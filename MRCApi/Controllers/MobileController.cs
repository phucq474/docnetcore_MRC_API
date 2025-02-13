using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Data;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class MobileController : SpiralBaseController
    {
        public readonly IMobileService _service;
        IWebHostEnvironment _FRoot;
        public MobileController(MobileContext _context, IWebHostEnvironment _hosting)
        {
            _service = new MobileService(_context);
            _FRoot = _hosting;
        }

        [HttpGet("GetListRawByReport")]
        public async Task<ActionResult<ResultTableInfo>> GetListRawByReport_Dynamic([FromHeader] string JsonData)
        {
            try
            {
                DataTable data = await Task.Run(() => _service.GetListRawByReport_Dynamic(AccountId, UserId, JsonData));
                if(data.Rows.Count > 0)
                {
                    return new ResultTableInfo(200, "Successfully!", data);
                }
                else
                {
                    return new ResultTableInfo(500, "No data!", null);
                }
            }catch(Exception ex)
            {
                return new ResultTableInfo(500, ex.Message, null);
            }
        }

        [HttpGet("ExportRawByReport")]
        public async Task<ResultInfo> ExportRawByReport_Dynamic([FromHeader] string JsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _FRoot.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Shop Lists By Report_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo file = new FileInfo(fileExport);
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;

            try
            {
                using (var data = await Task.Run(() => _service.ExportRawByReport_Dynamic(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        if (data.Rows.Count > 0)
                        {
                            var sheet = package.Workbook.Worksheets.Add("ShopLists");
                            
                            sheet.Cells[3, 1].LoadFromDataTable(data, true);

                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Merge = true;
                            sheet.Cells[1, 1].Value = "Shop Lists";
                            sheet.Cells[1, 1].Style.Font.Color.SetColor(Color.Red);
                            sheet.Cells[1, 1].Style.Font.Size = 18;
                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, sheet.Dimension.End.Column], "#FFFFFF", true, ExcelHorizontalAlignment.Center);

                            sheet.Cells.AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Column(8).Width = 30;
                            sheet.Column(9).Width = 30;
                            sheet.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Column(13).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, sheet.Dimension.End.Column], "#3399FF", true, ExcelHorizontalAlignment.Center);
                            sheet.Cells[3, 1, 3, sheet.Dimension.End.Column].Style.Font.Color.SetColor(Color.White);
                        }
                        else
                        {
                            return (new ResultInfo(0, "No data", null));
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return (new ResultInfo(500, ex.Message, null));
            }
        }

        [HttpPost("UpdateShopByReport")]
        public async Task<ActionResult<ResultTableInfo>> UpdateShopByReport([FromHeader] int Id)
        {
            try
            {
                DataTable data = await Task.Run(() => _service.UpdateShopByReport(AccountId, UserId, Id));
                if (data.Rows.Count > 0)
                {
                    return new ResultTableInfo(200, "Update Successfully!", data);
                }
                else
                {
                    return new ResultTableInfo(500, "Update Failed!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultTableInfo(500, ex.Message, null);
            }
        }
    }
}
