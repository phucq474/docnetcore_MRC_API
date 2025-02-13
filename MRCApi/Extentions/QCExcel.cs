using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralEntity.Models;
using SpiralService;

namespace MRCApi.Extentions
{

    public class QCExcel
    {
        public static async Task<ResultInfo> Report_QC_RawData(int accountId, int userId, string jsonData, IQCService _service, IWebHostEnvironment _webHostEnvironment, HostString host, string scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/QC";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = string.Format("QC Rawdata ({0} - {1})_{2}.xlsx", dataJson.fromdate, dataJson.todate, DateTime.Now.ToString("yyyyMMdd_HHmmss"));

            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo file = new FileInfo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var pk = new ExcelPackage(file))
                {
                    // Rawdata
                    DataSet ds = await Task.Run(() => _service.Report_Rawdata(accountId, userId, jsonData));
                    if (ds.Tables.Count > 0)
                    {
                        DataTable dt_rawdata= ds.Tables[0];
                        if (dt_rawdata.Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Rawdata");
                            sheet.View.ShowGridLines = false;
                            sheet.Cells[3, 1].LoadFromDataTable(dt_rawdata, true);

                            sheet.Cells[2, 1].Value = "Từ ngày:";
                            sheet.Cells[2, 2].Value = dataJson.fromdate;
                            sheet.Cells[2, 3].Value = "Đến ngày:";
                            sheet.Cells[2, 4].Value = dataJson.todate;

                            sheet.Cells[1, 1].Value = "QC RAWDATA";
                            sheet.Cells[1, 1].Style.Font.Size = 20;
                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Merge = true;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, sheet.Dimension.End.Column], "#BDD7EE", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 11], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 12, 3, sheet.Dimension.End.Column], "#FFFF00", true, ExcelHorizontalAlignment.Center);

                            for (int c = 1; c <= sheet.Dimension.End.Column; c++)
                            {
                                sheet.Column(c).Width = 15;
                            }

                            sheet.Row(3).Height = 40;

                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                        }
                    }
                    if (ds.Tables.Count > 1)
                    {
                        DataTable dt= ds.Tables[1];
                        if (dt.Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("OSA");
                            sheet.View.ShowGridLines = false;
                            sheet.Cells[3, 1].LoadFromDataTable(dt, true);

                            sheet.Cells[2, 1].Value = "Từ ngày:";
                            sheet.Cells[2, 2].Value = dataJson.fromdate;
                            sheet.Cells[2, 3].Value = "Đến ngày:";
                            sheet.Cells[2, 4].Value = dataJson.todate;

                            sheet.Cells[1, 1].Value = "QC OSA";
                            sheet.Cells[1, 1].Style.Font.Size = 20;
                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Merge = true;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, sheet.Dimension.End.Column], "#BDD7EE", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 11], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 12, 3, sheet.Dimension.End.Column], "#FFFF00", true, ExcelHorizontalAlignment.Center);

                            for (int c = 1; c <= sheet.Dimension.End.Column; c++)
                            {
                                sheet.Column(c).Width = 15;
                            }

                            sheet.Row(3).Height = 40;

                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                    }
                    if (ds.Tables.Count > 2)
                    {
                        DataTable dt = ds.Tables[2];
                        if (dt.Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("SOS/SOF");
                            sheet.View.ShowGridLines = false;
                            sheet.Cells[3, 1].LoadFromDataTable(dt, true);

                            sheet.Cells[2, 1].Value = "Từ ngày:";
                            sheet.Cells[2, 2].Value = dataJson.fromdate;
                            sheet.Cells[2, 3].Value = "Đến ngày:";
                            sheet.Cells[2, 4].Value = dataJson.todate;

                            sheet.Cells[1, 1].Value = "QC SOS/SOF";
                            sheet.Cells[1, 1].Style.Font.Size = 20;
                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Merge = true;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, sheet.Dimension.End.Column], "#BDD7EE", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 11], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 12, 3, sheet.Dimension.End.Column], "#FFFF00", true, ExcelHorizontalAlignment.Center);

                            for (int c = 1; c <= sheet.Dimension.End.Column; c++)
                            {
                                sheet.Column(c).Width = 15;
                            }

                            sheet.Row(3).Height = 40;

                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                    }
                    if (ds.Tables.Count > 3)
                    {
                        DataTable dt = ds.Tables[3];
                        if (dt.Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Visibility");
                            sheet.View.ShowGridLines = false;
                            sheet.Cells[3, 1].LoadFromDataTable(dt, true);

                            sheet.Cells[2, 1].Value = "Từ ngày:";
                            sheet.Cells[2, 2].Value = dataJson.fromdate;
                            sheet.Cells[2, 3].Value = "Đến ngày:";
                            sheet.Cells[2, 4].Value = dataJson.todate;

                            sheet.Cells[1, 1].Value = "QC Visibility";
                            sheet.Cells[1, 1].Style.Font.Size = 20;
                            sheet.Cells[1, 1, 1, sheet.Dimension.End.Column].Merge = true;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, sheet.Dimension.End.Column], "#BDD7EE", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, 11], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet.Cells[3, 12, 3, sheet.Dimension.End.Column], "#FFFF00", true, ExcelHorizontalAlignment.Center);

                            for (int c = 1; c <= sheet.Dimension.End.Column; c++)
                            {
                                sheet.Column(c).Width = 15;
                            }

                            sheet.Row(3).Height = 40;

                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                    }


                    pk.Save();
                }
                return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", scheme, host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

    }
}
