using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{

    public class ReportExtends
    {
        public static ResultInfo CoachingReport(int accountId, int userId, string jsonData, IWorkingTaskService _service, IWebHostEnvironment _webHostEnvironment, HostString host, string scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/coaching";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Coaching Report_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo file = new FileInfo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var pk = new ExcelPackage(file))
                {

                    #region Execution 
                    DataTable data_execution = Task.Run(() => _service.Coaching_Report_Execution(accountId, userId, jsonData)).Result;
                    var sheet_Execution = pk.Workbook.Worksheets.Add("Execution report");
                    sheet_Execution.Cells[1, 1].Value = "Working process compliance";
                    sheet_Execution.Cells[1, 1].Style.Font.Size = 16;
                    sheet_Execution.Cells[1, 1].Style.Font.Bold = true;

                    if (data_execution.Rows.Count > 0)
                    {
                        sheet_Execution.Cells[4, 1].LoadFromDataTable(data_execution, true);
                        string[] listColor = { "#5B9BD5", "#9BC2E6" };
                        int startDate = 1, endDate = 1;
                        for (int c = 1; c <= sheet_Execution.Dimension.End.Column; c++)
                        {
                            string header = Convert.ToString(sheet_Execution.Cells[4, c].Value);
                            string[] key = header.Split("_");
                            if (key.Count() > 1)
                            {
                                if (startDate == 1)
                                {
                                    startDate = c;
                                }
                                endDate = c;
                                if (!string.IsNullOrEmpty(key[0]))
                                {
                                    sheet_Execution.Cells[2, c].Value = Convert.ToDecimal(key[0]);
                                }
                                sheet_Execution.Cells[3, c].Value = key[1];
                                sheet_Execution.Cells[4, c].Value = key[2];
                            }
                        }

                        int startM = startDate, endM = startDate, indColor = 0;
                        string strM = Convert.ToString(sheet_Execution.Cells[3, startDate].Value);
                        for (int c = startDate; c <= endDate; c++)
                        {
                            if (strM == Convert.ToString(sheet_Execution.Cells[3, c].Value))
                            {
                                endM = c;
                                if (c == endDate)
                                {
                                    for (int col = startM; col < endM; col++)
                                    {
                                        sheet_Execution.Column(col).OutlineLevel = 1;
                                        sheet_Execution.Column(col).Collapsed = true;
                                    }
                                    sheet_Execution.Cells[3, startM, 3, endM].Merge = true;
                                    ExcelFormats.FormatCell(sheet_Execution.Cells[4, startM, 4, endM], listColor[indColor], true, ExcelHorizontalAlignment.Center);
                                }
                            }
                            else
                            {
                                sheet_Execution.Cells[3, startM, 3, endM].Merge = true;
                                ExcelFormats.FormatCell(sheet_Execution.Cells[4, startM, 4, endM], listColor[indColor], true, ExcelHorizontalAlignment.Center);

                                for (int col = startM; col < endM; col++)
                                {
                                    sheet_Execution.Column(col).OutlineLevel = 1;
                                    sheet_Execution.Column(col).Collapsed = true;
                                }

                                indColor++;
                                if (indColor >= listColor.Count())
                                {
                                    indColor = 0;
                                }

                                endM = c;
                                startM = c;
                                strM = Convert.ToString(sheet_Execution.Cells[3, c].Value);
                            }


                            for (int r = 5; r <= sheet_Execution.Dimension.End.Row; r++)
                            {
                                if (Convert.ToString(sheet_Execution.Cells[4, c].Value).ToUpper() == "TOTAL")
                                {
                                    sheet_Execution.Cells[r, c].Formula = string.Format("=IFERROR(AVERAGE({0}/{1},{2}/{3}),\"-\")",
                                            sheet_Execution.Cells[r, c - 2].Address, sheet_Execution.Cells[2, c - 2].Address,
                                            sheet_Execution.Cells[r, c - 1].Address, sheet_Execution.Cells[2, c - 1].Address
                                           );
                                    sheet_Execution.Cells[r, c].Style.Numberformat.Format = "#0%";
                                }
                                else
                                {
                                    if (string.IsNullOrEmpty(Convert.ToString(sheet_Execution.Cells[r, c].Value)))
                                    {
                                        sheet_Execution.Cells[r, c].Value = null;
                                    }
                                }
                            }

                        }

                        sheet_Execution.Cells[4, 1, 4, sheet_Execution.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                        sheet_Execution.Row(4).Height = 30;
                        ExcelFormats.FormatCell(sheet_Execution.Cells[4, 1, 4, startDate - 1], "#305496", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_Execution.Cells[3, startDate, 3, endDate], "#FFD966", true, ExcelHorizontalAlignment.Center);
                        sheet_Execution.Cells[4, 1, sheet_Execution.Dimension.End.Row, startDate - 1].AutoFitColumns();
                        sheet_Execution.Cells[3, startDate, 4, endDate].Style.WrapText = true;

                        ExcelFormats.BorderColor(sheet_Execution, 4, 1, sheet_Execution.Dimension.End.Row, sheet_Execution.Dimension.End.Column, "#5B9BD5");
                        ExcelFormats.BorderColor(sheet_Execution, 3, startDate, 3, sheet_Execution.Dimension.End.Column, "#5B9BD5");
                        sheet_Execution.Cells[2, startDate, sheet_Execution.Dimension.End.Row, endDate].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    }

                    #endregion

                    #region Market Visit Form 
                    DataSet data_MarketVF = Task.Run(() => _service.Coaching_Report_Market_VF(accountId, userId, jsonData)).Result;
                    var sheet_MarketVF = pk.Workbook.Worksheets.Add("Market visit form");

                    if (data_MarketVF.Tables.Count > 0)
                    {
                        int startRow = 2;

                        for (int tb = 0; tb < data_MarketVF.Tables.Count; tb++)
                        {
                            DataTable data = data_MarketVF.Tables[tb];
                            string SupName = data.Rows[0]["CreateByName"].ToString();
                            data.Columns.Remove("CreateByName");

                            #region header
                            sheet_MarketVF.Cells[startRow, 2].Value = "KIỂM TRA THỊ TRƯỜNG";
                            sheet_MarketVF.Cells[startRow + 1, 2].Value = SupName;
                            sheet_MarketVF.Cells[startRow, 2, startRow, 4].Merge = true;
                            sheet_MarketVF.Cells[startRow + 1, 2, startRow + 1, 4].Merge = true;

                            sheet_MarketVF.Cells[startRow, 2, startRow, 4].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            sheet_MarketVF.Cells[startRow, 2, startRow, 4].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                            sheet_MarketVF.Cells[startRow, 2, startRow, 4].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.White);

                            sheet_MarketVF.Cells[startRow + 1, 2, startRow + 1, 4].Style.Font.Color.SetColor(System.Drawing.Color.Yellow);
                            ExcelFormats.FormatCell(sheet_MarketVF.Cells[startRow, 2, startRow + 1, 4], "#1F4E78", true, ExcelHorizontalAlignment.Center);
                            sheet_MarketVF.Row(startRow).Height = 27;
                            sheet_MarketVF.Row(startRow + 1).Height = 27;
                            sheet_MarketVF.Cells[startRow, 2, startRow + 1, 4].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            #endregion

                            #region body
                            sheet_MarketVF.Cells[startRow + 3, 2].LoadFromDataTable(data, true);
                            int endCol1 = 2;
                            sheet_MarketVF.Row(startRow + 3).Height = 28;
                            sheet_MarketVF.Cells[startRow + 3, 2, startRow + 3, data.Columns.Count + 1].Style.WrapText = true;
                            for (int c = 2; c <= data.Columns.Count + 1; c++)
                            {
                                if (Convert.ToString(sheet_MarketVF.Cells[startRow + 3, c].Value) == "NULLCOL")
                                {
                                    sheet_MarketVF.Cells[startRow + 3, c].Value = null;
                                    endCol1 = c - 1;
                                }
                                sheet_MarketVF.Column(c).Width = 19;
                            }

                            sheet_MarketVF.Cells[startRow + 3, 2, startRow + 3, data.Columns.Count + 1].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            ExcelFormats.FormatCell(sheet_MarketVF.Cells[startRow + 3, 2, startRow + 3, endCol1], "#2F75B5", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_MarketVF.Cells[startRow + 3, endCol1 + 2, startRow + 3, data.Columns.Count + 1], "#70AD47", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.BorderColor(sheet_MarketVF, startRow, 2, startRow + 3, endCol1, "#2F75B5", "Thin");
                            ExcelFormats.BorderColor(sheet_MarketVF, startRow + 3, 2, startRow + 3 + data.Rows.Count, endCol1, "#2F75B5", "Thin", "1");
                            ExcelFormats.BorderColor(sheet_MarketVF, startRow + 3, endCol1 + 2, startRow + 3 + data.Rows.Count, data.Columns.Count + 1, "#70AD47", "Thin", "1");

                            ExcelFormats.Border(sheet_MarketVF, startRow + 3, 2, startRow + 3, endCol1);
                            ExcelFormats.Border(sheet_MarketVF, startRow + 3, endCol1 + 2, startRow + 3, data.Columns.Count + 1);

                            sheet_MarketVF.Cells[startRow + 3, 5, sheet_MarketVF.Dimension.End.Row, sheet_MarketVF.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            #endregion

                            sheet_MarketVF.Column(endCol1 + 1).Width = 4;
                            sheet_MarketVF.View.ShowGridLines = false;
                            startRow += data.Rows.Count + 6;
                        }
                        sheet_MarketVF.View.ZoomScale = 70;
                    }

                    #endregion

                    #region Market Visit Record
                    var sheet_MarketVisitRecord = pk.Workbook.Worksheets.Add("Market visit record");
                    DataTable data_MarketVR = Task.Run(() => _service.Coaching_Report_MarketVR(accountId, userId, jsonData)).Result;
                    if (data_MarketVR.Rows.Count > 0)
                    {
                        sheet_MarketVisitRecord.Cells[1, 1].LoadFromDataTable(data_MarketVR, true);
                        sheet_MarketVisitRecord.Cells[1, 1, 1, sheet_MarketVisitRecord.Dimension.End.Column].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet_MarketVisitRecord.Row(1).Height = 28;
                        sheet_MarketVisitRecord.Cells[1, 1, 1, sheet_MarketVisitRecord.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                        ExcelFormats.FormatCell(sheet_MarketVisitRecord.Cells[1, 1, 1, 4], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_MarketVisitRecord.Cells[1, 5, 1, sheet_MarketVisitRecord.Dimension.End.Column], "#305496", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet_MarketVisitRecord, 1, 1, sheet_MarketVisitRecord.Dimension.End.Row, sheet_MarketVisitRecord.Dimension.End.Column);
                        sheet_MarketVisitRecord.Cells.AutoFitColumns();
                    }
                    #endregion

                    #region Market Rawdata
                    var sheet_MarketRawdata = pk.Workbook.Worksheets.Add("Market Rawdata");
                    DataTable data_MarketRawdata = Task.Run(() => _service.Coaching_Report_MarketRawdata(accountId, userId, jsonData)).Result;
                    if (data_MarketRawdata.Rows.Count > 0)
                    {
                        sheet_MarketRawdata.Cells[1, 1].LoadFromDataTable(data_MarketRawdata, true);
                        sheet_MarketRawdata.Cells[1, 1, 1, sheet_MarketRawdata.Dimension.End.Column].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet_MarketRawdata.Row(1).Height = 28;
                        sheet_MarketRawdata.Cells[1, 1, 1, sheet_MarketRawdata.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                        ExcelFormats.FormatCell(sheet_MarketRawdata.Cells[1, 1, 1, sheet_MarketRawdata.Dimension.End.Column], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet_MarketRawdata, 1, 1, sheet_MarketRawdata.Dimension.End.Row, sheet_MarketRawdata.Dimension.End.Column);
                        sheet_MarketRawdata.Cells.AutoFitColumns();
                    }
                    #endregion


                    #region Coaching Record
                    var sheet_CoachingRecord = pk.Workbook.Worksheets.Add("Field coaching record");
                    DataTable data_CoachingRecord = Task.Run(() => _service.Coaching_Report_CoachingRecord(accountId, userId, jsonData)).Result;
                    if (data_CoachingRecord.Rows.Count > 0)
                    {
                        sheet_CoachingRecord.Cells[1, 1].LoadFromDataTable(data_CoachingRecord, true);
                        sheet_CoachingRecord.Cells[1, 1, 1, sheet_CoachingRecord.Dimension.End.Column].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet_CoachingRecord.Row(1).Height = 28;
                        sheet_CoachingRecord.Cells[1, 1, 1, sheet_CoachingRecord.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                        ExcelFormats.FormatCell(sheet_CoachingRecord.Cells[1, 1, 1, 4], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_CoachingRecord.Cells[1, 5, 1, sheet_CoachingRecord.Dimension.End.Column], "#305496", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet_CoachingRecord, 1, 1, sheet_CoachingRecord.Dimension.End.Row, sheet_CoachingRecord.Dimension.End.Column);
                        sheet_CoachingRecord.Cells.AutoFitColumns();
                    }
                    #endregion

                    #region Coaching Rawdata
                    var sheet_CoachingRawdata = pk.Workbook.Worksheets.Add("Coaching Rawdata");
                    DataTable data_CoachingRawdata = Task.Run(() => _service.Coaching_Report_CoachingRawdata(accountId, userId, jsonData)).Result;
                    if (data_CoachingRawdata.Rows.Count > 0)
                    {
                        sheet_CoachingRawdata.Cells[1, 1].LoadFromDataTable(data_CoachingRawdata, true);
                        sheet_CoachingRawdata.Cells[1, 1, 1, sheet_CoachingRawdata.Dimension.End.Column].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet_CoachingRawdata.Row(1).Height = 28;
                        sheet_CoachingRawdata.Cells[1, 1, 1, sheet_CoachingRawdata.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                        ExcelFormats.FormatCell(sheet_CoachingRawdata.Cells[1, 1, 1, sheet_CoachingRawdata.Dimension.End.Column], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.Border(sheet_CoachingRawdata, 1, 1, sheet_CoachingRawdata.Dimension.End.Row, sheet_CoachingRawdata.Dimension.End.Column);
                        sheet_CoachingRawdata.Cells.AutoFitColumns();
                    }
                    #endregion


                    pk.Save();
                }
                return new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", scheme, host, subfolder, fileName));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public static async Task<ResultInfo> Report_Store_Cover_Fonterra(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            var temDate = dataJson.fromdate;
            var dateSplit = temDate.Split("-");

            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Store Cover Report_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Report_Store_Cover.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    var ws_RAW = xls.Workbook.Worksheets["RAW"];
                    if (ws_RAW != null)
                    {
                        await Task.Yield();
                        DataTable dt_RAW = Task.Run(() => _service.Report_Store_Cover_Fonterra_RAW(AccountId, UserId, JsonData)).Result;
                        if (dt_RAW.Rows.Count > 0)
                        {

                            var sheet = xls.Workbook.Worksheets["RAW"];
                            sheet.Cells[1, 1].Value = "ATTENDANT RAWDATA";
                            sheet.Cells[1, 1].Style.Font.Size = 20;
                            sheet.Cells[1, 1].Style.Font.Bold = true;
                            sheet.Cells[1, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            sheet.Cells[1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            sheet.Row(1).Height = 38;
                            sheet.Cells[1, 1, 1, 5].Merge = true;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 5], "#0070C0", true, ExcelHorizontalAlignment.Center);

                            sheet.Cells[2, 1].Value = "From:";
                            sheet.Cells[2, 2].Value = dataJson.fromdate;
                            sheet.Cells[3, 1].Value = "To:";
                            sheet.Cells[3, 2].Value = dataJson.todate;

                            sheet.Cells[4, 1].LoadFromDataTable(dt_RAW, true);

                            ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, sheet.Dimension.End.Column], "#9BC2E6", true, ExcelHorizontalAlignment.Center);

                            for (int r = 5; r <= sheet.Dimension.End.Row; r++)
                            {
                                for (int c = 14; c <= sheet.Dimension.End.Column; c++)
                                {
                                    if (c <= 19)
                                    {
                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, c].Value)))
                                        {
                                            string[] keystr = Convert.ToString(sheet.Cells[r, c].Value).Split("@");
                                            if (keystr.Count() > 1)
                                            {
                                                sheet.Cells[r, c].Style.Font.Color.SetColor(System.Drawing.Color.Blue);
                                                sheet.Cells[r, c].Style.Font.UnderLine = true;
                                                sheet.Cells[r, c].Formula = "HYPERLINK(\"" + keystr[1] + "\",\"" + keystr[0] + "\")";
                                            }
                                        }
                                    }
                                    else if (c > 21)
                                    {
                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, c].Value)))
                                        {
                                            Decimal tmp;
                                            if (Decimal.TryParse(Convert.ToString(sheet.Cells[r, c].Value), out tmp))
                                            {
                                                if (tmp > 300)
                                                {
                                                    ExcelFormats.FormatCell(sheet.Cells[r, c], "red", false, ExcelHorizontalAlignment.Right);
                                                }
                                            }
                                        }
                                    }
                                }
                            }


                            ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Row(4).Height = 27;
                            sheet.Column(6).Width = 30;
                            sheet.Column(7).Width = 30;
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_LLV = xls.Workbook.Worksheets["LLV"];
                    var TotalWDsPlanCol = "";
                    var TotalWDsPlanCol_all = "";
                    var TotalWDsActualCol = "";
                    var TotalWDsActualCol_all = "";

                    if (ws_LLV != null)
                    {
                        await Task.Yield();
                        DataTable dt_LLV = Task.Run(() => _service.Report_Store_Cover_Fonterra_LLV(AccountId, UserId, JsonData)).Result;
                        if (dt_LLV.Rows.Count > 0)
                        {

                            var sheet = xls.Workbook.Worksheets["LLV"];
                            sheet.Cells[2, 5].Value = string.Format("Từ ngày: {0} - Đến ngày: {1}", dataJson.fromdate, dataJson.todate);
                            sheet.Cells[1, 4].Value = "LỊCH LÀM VIỆC";
                            sheet.Cells[6, 1].LoadFromDataTable(dt_LLV, true);

                            // Format DayName
                            string header = string.Empty;
                            int startColumn = 14;
                            //if (dataJson.Position == 2) startColumn = startColumn + 2;
                            for (int c = startColumn; c <= sheet.Dimension.End.Column; c++)
                            {
                                header = Convert.ToString(sheet.Cells[6, c].Value);
                                string[] key = header.Split('_');
                                if (key.Count() == 3)
                                {
                                    sheet.Column(c).Width = 11.73;
                                    sheet.Cells[4, c].Value = key[0];
                                    sheet.Cells[5, c].Value = key[1];
                                    sheet.Cells[6, c].Value = key[2];
                                    sheet.Cells[5, c].Style.Font.Color.SetColor(ColorTranslator.FromHtml("#FFFFFF"));
                                    ExcelFormats.FormatCell(sheet.Cells[4, c], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                                    ExcelFormats.FormatCell(sheet.Cells[5, c], "#305496", true, ExcelHorizontalAlignment.Center);
                                    ExcelFormats.FormatCell(sheet.Cells[6, c], "#FFE699", true, ExcelHorizontalAlignment.Center);

                                    if (sheet.Cells[5, c].Value.ToString() == "Chủ Nhật")
                                    {
                                        ExcelFormats.FormatCell(sheet.Cells[5, c], "#C65911", true, ExcelHorizontalAlignment.Center);
                                    }

                                }

                            }

                            // Merge Header
                            var start = 14;
                            var end = 14;
                            var cur = "";
                            var prev = "";
                            for (int i = startColumn; i <= sheet.Dimension.End.Column; i++)
                            {
                                if (i == startColumn)
                                {
                                    prev = sheet.Cells[4, i].Value.ToString();
                                }
                                cur = sheet.Cells[4, i].Value.ToString();
                                if (cur != prev)
                                {
                                    if (i == sheet.Dimension.End.Column)
                                    {
                                        end = i;
                                        sheet.Cells[4, start, 4, end].Merge = true;
                                        break;
                                    }
                                    else
                                    {
                                        end = i - 1;
                                        sheet.Cells[4, start, 4, end].Merge = true;
                                        start = i;
                                        end = i;
                                        prev = cur;
                                    }
                                }
                            }

                            sheet.Cells[4, startColumn, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            var StartPlan = 14;
                            var EndPlan = 0;
                            var StartActual = 0;
                            var EndActual = sheet.Dimension.End.Column;
                            //Formula
                            for (int c = 14; c <= sheet.Dimension.End.Column; c++)
                            {
                                for (int r = 7; r <= sheet.Dimension.End.Row; r++)
                                {
                                    //Plan
                                    if (sheet.Cells[6, c].Value.ToString() == "HC" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 1].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "C1" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 2].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "C2" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 3].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "C3" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 4].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "CL/2" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 5].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "KK" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 6].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "CT" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 7].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "BL" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 8].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "AL" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 9].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "NB" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 10].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "OFF" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},{2})", sheet.Cells[r, 14].Address, sheet.Cells[r, c - 11].Address, sheet.Cells[6, c].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "Total WDs Plan" && sheet.Cells[4, c].Value.ToString() == "Plan")
                                    {
                                        EndPlan = c;
                                        StartActual = c + 1;
                                        TotalWDsPlanCol = sheet.Cells[7, c, sheet.Dimension.End.Row, c].Address;
                                        TotalWDsPlanCol_all = TotalWDsPlanCol.ToString().Substring(0, 2) + ":" + TotalWDsPlanCol.ToString().Substring(0, 2);

                                        sheet.Cells[r, c].Formula = string.Format("=SUM({0}:{1})", sheet.Cells[r, c - 11].Address, sheet.Cells[r, c - 6].Address);
                                        sheet.Cells[5, c].Formula = string.Format("=SUBTOTAL(9,{0}:{1})", sheet.Cells[7, c].Address, sheet.Cells[sheet.Dimension.End.Row, c].Address);
                                    }
                                    else if (sheet.Cells[6, c].Value.ToString() == "Total WDs Actual" && sheet.Cells[4, c].Value.ToString() == "Actual")
                                    {
                                        TotalWDsActualCol = sheet.Cells[7, c, sheet.Dimension.End.Row, c].Address;
                                        TotalWDsActualCol_all = TotalWDsActualCol.ToString().Substring(0, 2) + ":" + TotalWDsActualCol.ToString().Substring(0, 2);
                                        sheet.Cells[r, c].Formula = string.Format("=SUM({0}:{1})", sheet.Cells[r, StartActual].Address, sheet.Cells[r, c - 1].Address);
                                    }

                                    //Actual
                                    if (StartActual > 0 && c >= StartActual && c <= EndActual - 2)
                                    {
                                        sheet.Cells[r, c].Formula = string.Format("=IFERROR(VLOOKUP($J{0}&$E{0}&{1},RAW!$A:$C,2,0),0)", r, sheet.Cells[6, c].Address);
                                    }
                                }

                            }

                            // Format Cell all
                            ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[4, startColumn, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_KAS = xls.Workbook.Worksheets["KAS"];
                    if (ws_KAS != null)
                    {
                        await Task.Yield();
                        DataSet dt_KAS = Task.Run(() => _service.Report_Store_Cover_Fonterra_KAS(AccountId, UserId, JsonData)).Result;
                        if (dt_KAS.Tables[0].Rows.Count > 0)
                        {

                            var sheet = xls.Workbook.Worksheets["KAS"];
                            sheet.Cells[1, 2].Value = dataJson.todate;
                            sheet.Cells[2, 2].Value = Convert.ToDouble(dt_KAS.Tables[1].Rows[0][0].ToString());
                            sheet.Cells[2, 2].Style.Numberformat.Format = "0%";

                            sheet.Cells[5, 1].LoadFromDataTable(dt_KAS.Tables[0], false);

                            for (int r = 4; r <= sheet.Dimension.End.Row; r++)
                            {
                                if (r == 4)
                                {
                                    sheet.Cells[r, 4].Formula = string.Format("=SUBTOTAL(9,D5:D{0})", sheet.Dimension.End.Row);
                                    sheet.Cells[r, 5].Formula = string.Format("=SUBTOTAL(9,E5:E{0})", sheet.Dimension.End.Row);
                                    sheet.Cells[r, 6].Formula = string.Format("=IFERROR(E{0}/D{0},0)", r);
                                    sheet.Cells[r, 4, r, 6].Style.Font.Bold = true;
                                }
                                else
                                {
                                    sheet.Cells[r, 5].Formula = string.Format("=COUNTIF(RAW!L:L,KAS!A{0})", r);
                                    sheet.Cells[r, 6].Formula = string.Format("=IFERROR(E{0}/D{0},0)", r);
                                }

                            }
                            sheet.Cells[4, sheet.Dimension.End.Column, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.Numberformat.Format = "0%";
                            ExcelFormats.Border(sheet, 5, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_CStore = xls.Workbook.Worksheets["Cover Store"];
                    if (ws_CStore != null)
                    {
                        await Task.Yield();
                        DataSet dt_CStore = Task.Run(() => _service.Report_Store_Cover_Fonterra_CStore(AccountId, UserId, JsonData)).Result;
                        if (dt_CStore.Tables[0].Rows.Count > 0)
                        {

                            var sheet = xls.Workbook.Worksheets["Cover Store"];
                            sheet.Cells[1, 2].Value = dataJson.todate;
                            sheet.Cells[1, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                            sheet.Cells[2, 2].Value = Convert.ToDouble(dt_CStore.Tables[0].Rows[0][0].ToString());
                            sheet.Cells[2, 2].Style.Numberformat.Format = "0%";

                            sheet.Cells[4, 1].LoadFromDataTable(dt_CStore.Tables[1], false);

                            var ColTable1 = dt_CStore.Tables[1].Columns.Count;
                            var RowTable1 = dt_CStore.Tables[1].Rows.Count;

                            //Table 1
                            for (int r = 4; r <= RowTable1 + 3; r++)
                            {
                                sheet.Cells[r, 6].Formula = string.Format("=SUMIF(LLV!$E:$E,'Cover Store'!$C{0},LLV!{1})", r, TotalWDsPlanCol_all);
                                sheet.Cells[r, 7].Formula = string.Format("=SUMIF(LLV!$E:$E,'Cover Store'!$C{0},LLV!{1})", r, TotalWDsActualCol_all);
                                sheet.Cells[r, 8].Formula = string.Format("=IFERROR(G{0}/F{0},0)", r);
                                sheet.Cells[r, 8].Style.Numberformat.Format = "0%";
                                sheet.Cells[r, 10].Formula = string.Format("=COUNTIFS(LLV!$E:$E,'Cover Store'!C{0},LLV!{1},\">0\")", r, TotalWDsActualCol_all);
                                sheet.Cells[r, 11].Formula = string.Format("=IFERROR(J{0}/I{0},0)", r);
                                sheet.Cells[r, 11].Style.Numberformat.Format = "0%";
                            }
                            //ROW TOTAL TABLE 1
                            sheet.Cells[RowTable1 + 4, 1].Value = "SUM";
                            sheet.Cells[RowTable1 + 4, 1, RowTable1 + 4, 5].Merge = true;
                            sheet.Cells[RowTable1 + 4, 6].Formula = string.Format("=SUM(F{0}:F{1})", 4, RowTable1 + 3);
                            sheet.Cells[RowTable1 + 4, 7].Formula = string.Format("=SUM(G{0}:G{1})", 4, RowTable1 + 3);
                            sheet.Cells[RowTable1 + 4, 8].Formula = string.Format("=IFERROR(G{0}/F{0},0)", RowTable1 + 4);
                            sheet.Cells[RowTable1 + 4, 8].Style.Numberformat.Format = "0%";
                            sheet.Cells[RowTable1 + 4, 9].Formula = string.Format("=SUM(I{0}:I{1})", 4, RowTable1 + 3);
                            sheet.Cells[RowTable1 + 4, 10].Formula = string.Format("=SUM(J{0}:J{1})", 4, RowTable1 + 3);
                            sheet.Cells[RowTable1 + 4, 11].Formula = string.Format("=IFERROR(J{0}/I{0},0)", RowTable1 + 4);
                            sheet.Cells[RowTable1 + 4, 11].Style.Numberformat.Format = "0%";
                            ExcelFormats.FormatCell(sheet.Cells[RowTable1 + 4, 1, RowTable1 + 4, ColTable1], "#92D050", true, ExcelHorizontalAlignment.Center);


                            //TABLE 2
                            var StartColTable2 = ColTable1 + 2;
                            var EndColTable2 = StartColTable2 + 3;
                            var RowTable2 = dt_CStore.Tables[2].Rows.Count;

                            sheet.Cells[4, StartColTable2].LoadFromDataTable(dt_CStore.Tables[2], false);
                            for (int r = 4; r <= RowTable2 + 3 - 1; r++)
                            {
                                sheet.Cells[r, StartColTable2 + 1].Formula = string.Format("=SUMIF($B${0}:$B${1},M{2},$F${0}:$F${1})", 4, RowTable1 + 3, r);
                                sheet.Cells[r, StartColTable2 + 2].Formula = string.Format("=SUMIF($B${0}:$B${1},M{2},$G${0}:$G${1})", 4, RowTable1 + 3, r);
                                sheet.Cells[r, StartColTable2 + 3].Formula = string.Format("=IFERROR(O{0}/N{0},0)", r);
                                sheet.Cells[r, StartColTable2 + 3].Style.Numberformat.Format = "0%";
                            }
                            //ROW TOTAL TABLE 2
                            sheet.Cells[RowTable2 + 3, StartColTable2 + 1].Formula = string.Format("=SUM(N{0}:N{1})", 4, RowTable2 + 3 - 1);
                            sheet.Cells[RowTable2 + 3, StartColTable2 + 2].Formula = string.Format("=SUM(O{0}:O{1})", 4, RowTable2 + 3 - 1);
                            sheet.Cells[RowTable2 + 3, StartColTable2 + 3].Formula = string.Format("=IFERROR(O{0}/N{0},0)", RowTable2 + 3);
                            sheet.Cells[RowTable2 + 3, StartColTable2 + 3].Style.Numberformat.Format = "0%";
                            ExcelFormats.FormatCell(sheet.Cells[RowTable2 + 3, StartColTable2, RowTable2 + 3, EndColTable2], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 4, StartColTable2, RowTable2 + 3, EndColTable2);

                            //TABLE 3
                            var StartColTable3 = EndColTable2 + 2;
                            var EndColTable3 = StartColTable3 + 3;
                            var RowTable3 = dt_CStore.Tables[2].Rows.Count;

                            sheet.Cells[4, StartColTable3].LoadFromDataTable(dt_CStore.Tables[2], false);
                            for (int r = 4; r <= RowTable3 + 3 - 1; r++)
                            {
                                sheet.Cells[r, StartColTable3 + 1].Formula = string.Format("=SUMIF($B${0}:$B${1},R{2},$I${0}:$I${1})", 4, RowTable1 + 3, r);
                                sheet.Cells[r, StartColTable3 + 2].Formula = string.Format("=SUMIF($B${0}:$B${1},R{2},$J${0}:$J${1})", 4, RowTable1 + 3, r);
                                sheet.Cells[r, StartColTable3 + 3].Formula = string.Format("=IFERROR(T{0}/S{0},0)", r);
                                sheet.Cells[r, StartColTable3 + 3].Style.Numberformat.Format = "0%";
                            }
                            //ROW TOTAL TABLE 3
                            sheet.Cells[RowTable3 + 3, StartColTable3 + 1].Formula = string.Format("=SUM(S{0}:S{1})", 4, RowTable3 + 3 - 1);
                            sheet.Cells[RowTable3 + 3, StartColTable3 + 2].Formula = string.Format("=SUM(T{0}:T{1})", 4, RowTable3 + 3 - 1);
                            sheet.Cells[RowTable3 + 3, StartColTable3 + 3].Formula = string.Format("=IFERROR(T{0}/S{0},0)", RowTable3 + 3);
                            sheet.Cells[RowTable3 + 3, StartColTable3 + 3].Style.Numberformat.Format = "0%";
                            ExcelFormats.FormatCell(sheet.Cells[RowTable3 + 3, StartColTable3, RowTable3 + 3, EndColTable3], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 4, StartColTable3, RowTable3 + 3, EndColTable3);

                            ExcelFormats.Border(sheet, 4, 1, RowTable1 + 3, ColTable1);
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }
                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public static async Task<ResultInfo> Report_Sales_Report_Fonterra(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            var temDate = dataJson.fromdate;
            var dateSplit = temDate.Split("-");

            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = dateSplit[1].ToString() + "." + dateSplit[0].ToString() + " MT - SALES REPORT_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Report_SALES.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    var ws_ICT = xls.Workbook.Worksheets["SALES"];
                    if (ws_ICT != null)
                    {
                        await Task.Yield();
                        Task<DataSet> dt_ICT = Task.Run(() => _service.Report_Sales_Report_FTR(AccountId, UserId, JsonData));
                        if (dt_ICT.Result.Tables[1].Rows.Count > 0)
                        {

                            if (dateSplit.Length == 3)
                            {
                                ws_ICT.Cells[1, 1].Value = dateSplit[1].ToString() + "." + dateSplit[0].ToString() + " MT - SALES REPORT";
                                ws_ICT.Cells[1, 1, 1, 9].Merge = true;
                                ws_ICT.Cells[1, 1].Style.Font.Size = 20;
                                ws_ICT.Cells[1, 1].Style.Font.Bold = true;
                                ws_ICT.Cells[1, 1].Style.Font.Color.SetColor(color: System.Drawing.Color.Red);
                                ws_ICT.Row(1).Height = 26;
                            }

                            ws_ICT.Cells[2, 5].Value = "Updated to";
                            if (dt_ICT.Result.Tables[0].Rows.Count > 0)
                            {
                                ws_ICT.Cells[2, 6].Value = dt_ICT.Result.Tables[0].Rows[0][0].ToString();
                                ws_ICT.Cells[2, 5, 2, 6].Style.Font.Bold = true;
                                ws_ICT.Cells[2, 5, 2, 6].Style.Font.Color.SetColor(color: System.Drawing.Color.Red);
                            }

                            ws_ICT.Cells[2, 8].Value = "% Finish:";

                            ws_ICT.Cells[2, 9].Value = Convert.ToDouble(dt_ICT.Result.Tables[2].Rows[0][0].ToString());
                            ws_ICT.Cells[2, 9].Style.Numberformat.Format = "0%";
                            ws_ICT.Cells[2, 8, 2, 9].Style.Font.Bold = true;
                            ws_ICT.Cells[2, 8, 2, 9].Style.Font.Color.SetColor(color: System.Drawing.Color.Red);

                            ws_ICT.Cells[2, 1].Value = "FromDate:";
                            ws_ICT.Cells[2, 2].Value = dataJson.fromdate;
                            ws_ICT.Cells[3, 1].Value = "ToDate:";
                            ws_ICT.Cells[3, 2].Value = dataJson.todate;

                            ws_ICT.Cells[5, 1].LoadFromDataTable(dt_ICT.Result.Tables[1], true);

                            for (int i = 1; i <= ws_ICT.Dimension.End.Column; i++)
                            {
                                var key = ws_ICT.Cells[5, i].Value.ToString().Split("_");
                                if (key.Length == 2)
                                {
                                    ws_ICT.Cells[4, i].Value = key[0].ToString();
                                    ws_ICT.Cells[5, i].Value = key[0].ToString();
                                    ws_ICT.Cells[4, i, 5, i].Merge = true;
                                    ExcelFormats.FormatCell(ws_ICT.Cells[4, i, 5, i], key[1], true, ExcelHorizontalAlignment.Center);
                                    ws_ICT.Cells[4, i, 5, i].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                }
                                else if (key.Length == 4)
                                {
                                    ws_ICT.Cells[4, i].Value = key[0].ToString();
                                    ws_ICT.Cells[5, i].Value = key[2].ToString();
                                    ExcelFormats.FormatCell(ws_ICT.Cells[4, i], key[1], true, ExcelHorizontalAlignment.Center);
                                    ExcelFormats.FormatCell(ws_ICT.Cells[5, i], key[3], true, ExcelHorizontalAlignment.Center);
                                    ws_ICT.Cells[4, i, 5, i].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                    ws_ICT.Cells[4, i, 5, i].Style.Font.Color.SetColor(color: System.Drawing.Color.White);

                                    if (i == 9 || i == 12 || i == 15)
                                    {
                                        ws_ICT.Cells[4, i - 2, 4, i].Merge = true;

                                    }
                                }
                            }

                            for (int i = 6; i <= ws_ICT.Dimension.End.Row; i++)
                            {
                                ws_ICT.Cells[i, 7].Formula = string.Format("=SUM(J{0},M{1})", i, i);
                                ws_ICT.Cells[i, 8].Formula = string.Format("=SUM(K{0},N{1})", i, i);
                                ws_ICT.Cells[i, 9].Formula = string.Format("=IFERROR(H{0}/G{1},0)", i, i);
                                ws_ICT.Cells[i, 12].Formula = string.Format("=IFERROR(K{0}/J{1},0)", i, i);
                                ws_ICT.Cells[i, 15].Formula = string.Format("=IFERROR(N{0}/M{1},0)", i, i);

                                //if (((Convert.ToDouble(ws_ICT.Cells[i,11].Value) + (Convert.ToDouble(ws_ICT.Cells[i, 14].Value))) / 
                                //        (Convert.ToDouble(ws_ICT.Cells[i, 10].Value) + Convert.ToDouble(ws_ICT.Cells[i, 13].Value))) >= 1)
                                //{
                                ExcelFormats.FormatCell(ws_ICT.Cells[i, 9], "#FF7C80", true, ExcelHorizontalAlignment.Center);
                                //ws_ICT.Cells[i, 9].Style.Font.Color.SetColor(color: Color.DarkRed);
                                var f = ws_ICT.ConditionalFormatting.AddExpression(ws_ICT.Cells[i, 9]);
                                f.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#638EC6");
                                f.Formula = string.Format("=({0}>={1})", ws_ICT.Cells[i, 9], ws_ICT.Cells[2, 9]);

                                var g = ws_ICT.ConditionalFormatting.AddExpression(ws_ICT.Cells[i, 9]);
                                g.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                g.Formula = string.Format("=({0}<{1})", ws_ICT.Cells[i, 9], ws_ICT.Cells[2, 9]);
                                //}
                                //if ((Convert.ToDouble(ws_ICT.Cells[i, 11].Value) / Convert.ToDouble(ws_ICT.Cells[i, 11].Value)) >= 1)
                                //{
                                ExcelFormats.FormatCell(ws_ICT.Cells[i, 12], "#FF7C80", true, ExcelHorizontalAlignment.Center);
                                //ws_ICT.Cells[i, 12].Style.Font.Color.SetColor(color: Color.DarkRed);

                                var h = ws_ICT.ConditionalFormatting.AddExpression(ws_ICT.Cells[i, 12]);
                                h.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#638EC6");
                                h.Formula = string.Format("=({0}>={1})", ws_ICT.Cells[i, 12], ws_ICT.Cells[2, 9]);

                                var j = ws_ICT.ConditionalFormatting.AddExpression(ws_ICT.Cells[i, 12]);
                                j.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                j.Formula = string.Format("=({0}<{1})", ws_ICT.Cells[i, 12], ws_ICT.Cells[2, 9]);
                                //}
                                //if ((Convert.ToDouble(ws_ICT.Cells[i, 14].Value) / Convert.ToDouble(ws_ICT.Cells[i, 13].Value)) >= 1)
                                //{
                                ExcelFormats.FormatCell(ws_ICT.Cells[i, 15], "#FF7C80", true, ExcelHorizontalAlignment.Center);
                                //ws_ICT.Cells[i, 15].Style.Font.Color.SetColor(color: Color.DarkRed);

                                var p = ws_ICT.ConditionalFormatting.AddExpression(ws_ICT.Cells[i, 15]);
                                p.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#638EC6");
                                p.Formula = string.Format("=({0}>={1})", ws_ICT.Cells[i, 15], ws_ICT.Cells[2, 9]);

                                var o = ws_ICT.ConditionalFormatting.AddExpression(ws_ICT.Cells[i, 15]);
                                o.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                o.Formula = string.Format("=({0}<{1})", ws_ICT.Cells[i, 15], ws_ICT.Cells[2, 9]);
                                //}
                            }

                            ws_ICT.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ICT.Cells[6, 7, ws_ICT.Dimension.End.Row, 8].Style.Numberformat.Format = string.Format("_-* #,##0_-;-* #,##0_-;_-* \" - \"??_-;_-@_-");
                            ws_ICT.Cells[6, 10, ws_ICT.Dimension.End.Row, 11].Style.Numberformat.Format = string.Format("_-* #,##0_-;-* #,##0_-;_-* \" - \"??_-;_-@_-");
                            ws_ICT.Cells[6, 13, ws_ICT.Dimension.End.Row, 14].Style.Numberformat.Format = string.Format("_-* #,##0_-;-* #,##0_-;_-* \" - \"??_-;_-@_-");

                            ws_ICT.Cells[6, 9, ws_ICT.Dimension.End.Row, 9].Style.Numberformat.Format = "0%";
                            ws_ICT.Cells[6, 9, ws_ICT.Dimension.End.Row, 9].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ICT.Cells[6, 9, ws_ICT.Dimension.End.Row, 9].Style.Font.Bold = true;
                            ws_ICT.Cells[6, 12, ws_ICT.Dimension.End.Row, 12].Style.Numberformat.Format = "0%";
                            ws_ICT.Cells[6, 12, ws_ICT.Dimension.End.Row, 12].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ICT.Cells[6, 12, ws_ICT.Dimension.End.Row, 12].Style.Font.Bold = true;
                            ws_ICT.Cells[6, 15, ws_ICT.Dimension.End.Row, 15].Style.Numberformat.Format = "0%";
                            ws_ICT.Cells[6, 15, ws_ICT.Dimension.End.Row, 15].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ICT.Cells[6, 15, ws_ICT.Dimension.End.Row, 15].Style.Font.Bold = true;

                            ExcelFormats.Border(ws_ICT, 4, 1, ws_ICT.Dimension.End.Row, ws_ICT.Dimension.End.Column);
                            ws_ICT.Cells[4, 1, ws_ICT.Dimension.End.Row, ws_ICT.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public static async Task<ResultInfo> Report_New_Customer_Fonterra(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Report New Customer_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Report_New_Customer.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    var ws_RAW = xls.Workbook.Worksheets["RawData"];
                    if (ws_RAW != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_RAW = Task.Run(() => _service.Report_New_Customer_Fonterra_RAW(AccountId, UserId, JsonData));
                        if (dt_RAW.Result.Rows.Count > 0)
                        {
                            ws_RAW.Cells[2, 3].Value = dataJson.fromdate;
                            ws_RAW.Cells[2, 5].Value = dataJson.todate;
                            ws_RAW.Cells[3, 1].LoadFromDataTable(dt_RAW.Result, true);

                            ExcelFormats.FormatCell(ws_RAW.Cells[3, 1, 3, ws_RAW.Dimension.End.Column], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_RAW, 3, 1, ws_RAW.Dimension.End.Row, ws_RAW.Dimension.End.Column);

                            for (int i = 4; i <= ws_RAW.Dimension.End.Row; i++)
                            {
                                ws_RAW.Cells[i, 1].Formula = String.Format("=M{0}&L{1}&F{2}", i, i, i);
                                //ws_RAW.Cells[i, ws_RAW.Dimension.End.Column].Formula = String.Format("=K{0}&M{1}", i, i);
                            }

                            ws_RAW.Cells[4, 1, ws_RAW.Dimension.End.Row, ws_RAW.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_Total = xls.Workbook.Worksheets["Total"];
                    if (ws_Total != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_Total = Task.Run(() => _service.Report_New_Customer_Fonterra_Total(AccountId, UserId, JsonData));
                        if (dt_Total.Result.Rows.Count > 0)
                        {
                            ws_Total.Cells[4, 1].LoadFromDataTable(dt_Total.Result, true);

                            ExcelFormats.FormatCell(ws_Total.Cells[4, 1, 4, ws_Total.Dimension.End.Column], "#92D050", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_Total, 4, 1, ws_Total.Dimension.End.Row, ws_Total.Dimension.End.Column);

                            ws_Total.Cells[4, 1, ws_Total.Dimension.End.Row, ws_Total.Dimension.End.Column].AutoFitColumns();


                            var curValue = "";
                            var prevValue = "";
                            var startRow = 6;
                            var endRow = 6;
                            List<int> lstGroupRow = new List<int>();

                            for (int r = 5; r <= ws_Total.Dimension.End.Row; r++)
                            {
                                #region group row
                                if (r == 5)
                                {
                                    prevValue = ws_Total.Cells[r, 10].Value.ToString();
                                    ExcelFormats.FormatCell(ws_Total.Cells[r, 1, r, ws_Total.Dimension.End.Column], "#C6E0B4", true, ExcelHorizontalAlignment.Center);
                                    lstGroupRow.Add(r);
                                }

                                curValue = ws_Total.Cells[r, 10].Value.ToString();

                                if (curValue != prevValue)
                                {
                                    endRow = r - 1;

                                    for (int j = startRow; j <= endRow; j++)
                                    {
                                        ws_Total.Row(j).OutlineLevel = 1;
                                        ws_Total.Row(j).Collapsed = true;
                                    }

                                    ExcelFormats.FormatCell(ws_Total.Cells[r, 1, r, ws_Total.Dimension.End.Column], "#C6E0B4", true, ExcelHorizontalAlignment.Center);
                                    lstGroupRow.Add(r);
                                    startRow = r;

                                    prevValue = curValue;
                                    startRow = r + 1;
                                    endRow = r + 1;
                                }
                                else if (r == ws_Total.Dimension.End.Row)
                                {
                                    endRow = r;
                                    for (int j = startRow; j <= endRow; j++)
                                    {
                                        ws_Total.Row(j).OutlineLevel = 1;
                                        ws_Total.Row(j).Collapsed = true;
                                    }

                                    ExcelFormats.FormatCell(ws_Total.Cells[r, 1, r, ws_Total.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                    lstGroupRow.Add(r);
                                    startRow = r;
                                }
                                #endregion

                                #region Formula
                                if (!string.IsNullOrEmpty(ws_Total.Cells[r, 10].Value.ToString())
                                    && !string.IsNullOrEmpty(ws_Total.Cells[r, 11].Value.ToString())
                                    && r != ws_Total.Dimension.End.Row)
                                {
                                    ws_Total.Cells[r, 4].Formula = String.Format("=F{0}+G{1}", r, r);
                                    ws_Total.Cells[r, 5].Formula = String.Format("=D{0}/C{1}", r, r);
                                    ws_Total.Cells[r, 6].Formula = String.Format("=COUNTIFS(Rawdata!G:G,Total!B{0},Rawdata!K:K,\"Anchor\",RawData!R:R,\"1\")", r);
                                    ws_Total.Cells[r, 7].Formula = String.Format("=COUNTIFS(Rawdata!G:G,Total!B{0},Rawdata!K:K,\"Anlene\", RawData!R:R,\"1\")+COUNTIFS(Rawdata!G:G,Total!B{1},Rawdata!K:K,\"Anmum\", RawData!R:R,\"1\")", r, r);
                                    //ws_Total.Cells[r, 6].Formula = String.Format("=COUNTIFS(Rawdata!G:G,Total!A{0},Rawdata!K:K,\"Anlene,Anmum\")", r);
                                    ws_Total.Cells[r, 8].Formula = String.Format("=F{0}/{1}", r, Convert.ToInt32(ws_Total.Cells[r, 8].Value));
                                    ws_Total.Cells[r, 9].Formula = String.Format("=G{0}/{1}", r, Convert.ToInt32(ws_Total.Cells[r, 9].Value));
                                }
                                #endregion

                            }

                            var countEmpl = 0;
                            var fomlTotalTarget = "";
                            var fomlTotalActual = "";
                            var fomlCountChild = "";
                            var fomlCountCGs = "";
                            for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                            {
                                if (i == lstGroupRow.Count - 1)
                                {
                                    ws_Total.Cells[lstGroupRow[i], 3].Formula = String.Format("=SUM({0})", fomlTotalTarget);
                                    ws_Total.Cells[lstGroupRow[i], 4].Formula = String.Format("=SUM({0})", fomlTotalActual);
                                    ws_Total.Cells[lstGroupRow[i], 5].Formula = String.Format("=D{0}/C{1}", lstGroupRow[i], lstGroupRow[i]);
                                    ws_Total.Cells[lstGroupRow[i], 6].Formula = String.Format("=SUM({0})", fomlCountChild);
                                    ws_Total.Cells[lstGroupRow[i], 7].Formula = String.Format("=SUM({0})", fomlCountCGs);
                                    ws_Total.Cells[lstGroupRow[i], 8].Formula = String.Format("=F{0}/({1}*{2})", lstGroupRow[i], Convert.ToInt32(ws_Total.Cells[lstGroupRow[i], 8].Value), countEmpl);
                                    ws_Total.Cells[lstGroupRow[i], 9].Formula = String.Format("=G{0}/({1}*{2})", lstGroupRow[i], Convert.ToInt32(ws_Total.Cells[lstGroupRow[i], 9].Value), countEmpl);
                                }
                                else
                                {
                                    var start = lstGroupRow[i] + 1;
                                    var end = lstGroupRow[i + 1] - 1;

                                    ws_Total.Cells[lstGroupRow[i], 3].Formula = String.Format("=SUM(C{0}:C{1})", start, end);
                                    ws_Total.Cells[lstGroupRow[i], 4].Formula = String.Format("=F{0}+G{1}", lstGroupRow[i], lstGroupRow[i]);
                                    ws_Total.Cells[lstGroupRow[i], 5].Formula = String.Format("=D{0}/C{1}", lstGroupRow[i], lstGroupRow[i]);
                                    ws_Total.Cells[lstGroupRow[i], 6].Formula = String.Format("=SUM(F{0}:F{1})", start, end);
                                    ws_Total.Cells[lstGroupRow[i], 7].Formula = String.Format("=SUM(G{0}:G{1})", start, end);
                                    ws_Total.Cells[lstGroupRow[i], 8].Formula = String.Format("=F{0}/({1}*{2})", lstGroupRow[i], Convert.ToInt32(ws_Total.Cells[lstGroupRow[i], 8].Value), end - start + 1);
                                    ws_Total.Cells[lstGroupRow[i], 9].Formula = String.Format("=G{0}/({1}*{2})", lstGroupRow[i], Convert.ToInt32(ws_Total.Cells[lstGroupRow[i], 9].Value), end - start + 1);

                                    fomlTotalTarget += ws_Total.Cells[lstGroupRow[i], 3].Address.ToString() + ",";
                                    fomlTotalActual += ws_Total.Cells[lstGroupRow[i], 4].Address.ToString() + ",";
                                    fomlCountChild += ws_Total.Cells[lstGroupRow[i], 6].Address.ToString() + ",";
                                    fomlCountCGs += ws_Total.Cells[lstGroupRow[i], 7].Address.ToString() + ",";
                                    countEmpl += (end - start + 1);
                                }


                            }
                            ws_Total.Column(1).Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                            ws_Total.DeleteColumn(11);
                            ws_Total.DeleteColumn(10);
                            ws_Total.Cells[5, 3, ws_Total.Dimension.End.Row, ws_Total.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_Total.Cells[5, 5, ws_Total.Dimension.End.Row, 5].Style.Numberformat.Format = "0%";
                            ws_Total.Cells[5, 8, ws_Total.Dimension.End.Row, ws_Total.Dimension.End.Column].Style.Numberformat.Format = "0%";
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

        public static async Task<ResultInfo> Report_OOS_Fonterra(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Report OOS_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Report_OOS.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    var ws_Target = xls.Workbook.Worksheets["Target"];
                    if (ws_Target != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_Target = Task.Run(() => _service.Report_OOS_Fonterra_Target(AccountId, UserId, JsonData));
                        if (dt_Target.Result.Rows.Count > 0)
                        {
                            ws_Target.Cells[1, 1].LoadFromDataTable(dt_Target.Result, true);
                            ExcelFormats.FormatCell(ws_Target.Cells[1, 1, 1, ws_Target.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_Target.Row(1).Height = 30;
                            ExcelFormats.Border(ws_Target, 1, 1, ws_Target.Dimension.End.Row, ws_Target.Dimension.End.Column);
                            ws_Target.Cells[1, 1, ws_Target.Dimension.End.Row, 2].AutoFitColumns();
                            ws_Target.Cells[2, 4, ws_Target.Dimension.End.Row, 4].Style.Numberformat.Format = "0%";
                            ws_Target.Column(3).Width = 15;
                            ws_Target.Column(4).Width = 15;
                            ws_Target.Column(5).Width = 15;
                            ws_Target.Column(6).Width = 15;
                            ws_Target.Column(7).Width = 15;
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_DATA = xls.Workbook.Worksheets["DATA"];
                    if (ws_DATA != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_DATA = Task.Run(() => _service.Report_OOS_Fonterra_DATA(AccountId, UserId, JsonData));
                        if (dt_DATA.Result.Rows.Count > 0)
                        {
                            ws_DATA.Cells[1, 1].LoadFromDataTable(dt_DATA.Result, true);
                            ExcelFormats.FormatCell(ws_DATA.Cells[1, 1, 1, ws_DATA.Dimension.End.Column], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ws_DATA.Row(1).Height = 30;

                            ExcelFormats.Border(ws_DATA, 1, 1, ws_DATA.Dimension.End.Row, ws_DATA.Dimension.End.Column);

                            ws_DATA.Cells[1, 1, ws_DATA.Dimension.End.Row, ws_DATA.Dimension.End.Column].AutoFitColumns();

                            ws_DATA.Column(6).Width = 20;
                            ws_DATA.Column(7).Width = 30;
                            ws_DATA.Column(9).Width = 20;
                            ws_DATA.Column(11).Width = 20;
                            ws_DATA.Column(17).Width = 30;
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_DATA_QC = xls.Workbook.Worksheets["DATA QC"];
                    if (ws_DATA_QC != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_DATA_QC = Task.Run(() => _service.Report_OOS_Fonterra_DATA_QC(AccountId, UserId, JsonData));
                        if (dt_DATA_QC.Result.Rows.Count > 0)
                        {
                            ws_DATA_QC.Cells[2, 1].LoadFromDataTable(dt_DATA_QC.Result, true);
                            ExcelFormats.FormatCell(ws_DATA_QC.Cells[2, 1, 2, 11], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(ws_DATA_QC.Cells[2, 12, 2, ws_DATA_QC.Dimension.End.Column], "#FFFF00", true, ExcelHorizontalAlignment.Center);
                            ws_DATA_QC.Row(2).Height = 30;

                            ExcelFormats.Border(ws_DATA_QC, 2, 1, ws_DATA_QC.Dimension.End.Row, ws_DATA_QC.Dimension.End.Column);

                            ws_DATA_QC.Cells[2, 1, ws_DATA_QC.Dimension.End.Row, ws_DATA_QC.Dimension.End.Column].AutoFitColumns();

                            ws_DATA_QC.Column(7).Width = 20;
                            ws_DATA_QC.Column(8).Width = 30;
                            ws_DATA_QC.Column(11).Width = 20;
                            ws_DATA_QC.Column(13).Width = 20;
                            ws_DATA_QC.Column(18).Width = 30;
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    var ws_RAW = xls.Workbook.Worksheets["RAW"];
                    if (ws_RAW != null)
                    {
                        await Task.Yield();
                        Task<DataSet> dt_RAW = Task.Run(() => _service.Report_OOS_Fonterra_RAW(AccountId, UserId, JsonData));
                        if (dt_RAW.Result.Tables[0].Rows.Count > 0)
                        {
                            ws_RAW.Cells[1, 1].LoadFromDataTable(dt_RAW.Result.Tables[0], true);
                            ExcelFormats.FormatCell(ws_RAW.Cells[1, 1, 1, ws_RAW.Dimension.End.Column], "#5B9BD5", true, ExcelHorizontalAlignment.Center);
                            ws_RAW.Row(1).Height = 30;

                            ExcelFormats.Border(ws_RAW, 1, 1, ws_RAW.Dimension.End.Row, ws_RAW.Dimension.End.Column);

                            ws_RAW.Cells[1, 1, ws_RAW.Dimension.End.Row, ws_RAW.Dimension.End.Column].AutoFitColumns();

                            for (int i = 2; i <= ws_RAW.Dimension.End.Row; i++)
                            {
                                for (int j = 10; j <= ws_RAW.Dimension.End.Column; j++)
                                {
                                    if (j == 13)
                                    {
                                        ws_RAW.Cells[i, j].Formula = String.Format("=IFERROR(J{0}/I{1},0)", i, i);
                                        ws_RAW.Cells[i, j].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                                    }
                                    else if (j == 14)
                                    {
                                        ws_RAW.Cells[i, j].Formula = String.Format("=IFERROR(K{0}/I{1},0)", i, i);
                                        ws_RAW.Cells[i, j].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                                    }
                                    else if (j == 15)
                                    {
                                        if (Convert.ToDateTime(dataJson.fromdate) <= Convert.ToDateTime("2023-04-01"))
                                        {
                                            ws_RAW.Cells[i, j].Formula = String.Format("=IFERROR(J{0}/L{1},0)", i, i);
                                        }
                                        else
                                        {
                                            ws_RAW.Cells[i, j].Formula = String.Format("=IFERROR(M{0}/L{1},0)", i, i);
                                        }

                                        ws_RAW.Cells[i, j].Style.Numberformat.Format = "0%";
                                    }
                                    else if (j == 16)
                                    {

                                        if (Convert.ToDateTime(dataJson.fromdate) <= Convert.ToDateTime("2023-04-01"))
                                        {
                                            ws_RAW.Cells[i, j].Formula = String.Format("=IFERROR(K{0}/L{1},0)", i, i);
                                        }
                                        else
                                        {
                                            ws_RAW.Cells[i, j].Formula = String.Format("=IFERROR(N{0}/L{1},0)", i, i);
                                        }
                                        ws_RAW.Cells[i, j].Style.Numberformat.Format = "0%";
                                    }
                                }
                            }

                            ws_RAW.Column(2).Width = 20;
                            ws_RAW.Column(4).Width = 20;
                            ws_RAW.Column(8).Width = 20;
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }

                        if (dt_RAW.Result.Tables[1].Rows.Count > 0)
                        {
                            var ws_BySRPG = xls.Workbook.Worksheets["BY SR.PG"];

                            ws_BySRPG.Cells[2, 1].LoadFromDataTable(dt_RAW.Result.Tables[1], true);
                            ExcelFormats.FormatCell(ws_BySRPG.Cells[2, 1, 2, dt_RAW.Result.Tables[1].Columns.Count], "#D9E1F2", true, ExcelHorizontalAlignment.Center);
                            ws_BySRPG.Row(2).Height = 30;

                            ExcelFormats.Border(ws_BySRPG, 2, 1, ws_BySRPG.Dimension.End.Row, dt_RAW.Result.Tables[1].Columns.Count);

                            ws_BySRPG.Cells[2, 1, ws_BySRPG.Dimension.End.Row, dt_RAW.Result.Tables[1].Columns.Count].AutoFitColumns();

                            for (int i = 3; i <= ws_BySRPG.Dimension.End.Row; i++)
                            {
                                for (int j = 8; j <= dt_RAW.Result.Tables[1].Columns.Count; j++)
                                {
                                    if (j == 8)
                                    {
                                        ws_BySRPG.Cells[i, j].Formula = String.Format("=IFERROR(G{0}/F{1},0)", i, i);
                                        ws_BySRPG.Cells[i, j].Style.Numberformat.Format = "0%";
                                    }
                                    else if (j == 9)
                                    {
                                        ws_BySRPG.Cells[i, j].Formula = String.Format("=IF(1-H{0}<0,\"không OOS\",1-H{1})", i, i);
                                        ws_BySRPG.Cells[i, j].Style.Numberformat.Format = "0%";

                                        var f = ws_BySRPG.ConditionalFormatting.AddExpression(ws_BySRPG.Cells[i, j]);
                                        f.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                        f.Formula = string.Format("=AND({0}>{1},{0}<>\"không OOS\")", ws_BySRPG.Cells[i, j], ws_BySRPG.Cells[i, j + 1].Address);

                                    }
                                    else if (j == 10)
                                    {
                                        ws_BySRPG.Cells[i, j].Style.Numberformat.Format = "0%";
                                    }
                                    else if (j == 11)
                                    {
                                        ws_BySRPG.Cells[i, j].Formula = String.Format("=IF(I{0}=\"không OOS\",\"ĐẠT\",IF(I{1}>J{2},\"KHÔNG ĐẠT\",\"ĐẠT\"))", i, i, i);

                                        var f = ws_BySRPG.ConditionalFormatting.AddExpression(ws_BySRPG.Cells[i, j]);
                                        f.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                        f.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_BySRPG.Cells[i, j]);
                                    }
                                    else if (j == 13)
                                    {
                                        ws_BySRPG.Cells[i, j].Formula = String.Format("=IFERROR(L{0}-G{1},0)", i, i);
                                        ws_BySRPG.Cells[i, j].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                                    }
                                }
                            }

                            ws_BySRPG.Column(2).Width = 20;
                            ws_BySRPG.Column(4).Width = 20;
                            ws_BySRPG.Cells[3, 5, ws_BySRPG.Dimension.End.Row, dt_RAW.Result.Tables[1].Columns.Count].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            //Table Total KAS
                            ws_BySRPG.Cells[2, 15].LoadFromDataTable(dt_RAW.Result.Tables[2], true);
                            ExcelFormats.FormatCell(ws_BySRPG.Cells[2, 15, 2, 15 + dt_RAW.Result.Tables[2].Columns.Count - 1], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_BySRPG, 2, 15, 2 + dt_RAW.Result.Tables[2].Rows.Count, 15 + dt_RAW.Result.Tables[2].Columns.Count - 1);

                            for (int i = 3; i <= 3 + dt_RAW.Result.Tables[2].Rows.Count - 1; i++)
                            {
                                if (i == 3 + dt_RAW.Result.Tables[2].Rows.Count - 1)
                                {
                                    ws_BySRPG.Cells[i, 16].Formula = String.Format("=SUM(P3:P{0})", dt_RAW.Result.Tables[2].Rows.Count - 2 + 3);
                                    ws_BySRPG.Cells[i, 17].Formula = String.Format("=SUM(Q3:Q{0})", dt_RAW.Result.Tables[2].Rows.Count - 2 + 3);
                                    ExcelFormats.FormatCell(ws_BySRPG.Cells[i, 15, i, 15 + dt_RAW.Result.Tables[2].Columns.Count - 1], "#92D050", true, ExcelHorizontalAlignment.Center);
                                }
                                else
                                {
                                    ws_BySRPG.Cells[i, 16].Formula = String.Format("=COUNTIFS($B$3:$B${0},O{1},$K$3:$K${2},\"ĐẠT\")", 3 + dt_RAW.Result.Tables[1].Rows.Count - 1, i, 3 + dt_RAW.Result.Tables[1].Rows.Count - 1);
                                    ws_BySRPG.Cells[i, 17].Formula = String.Format("=COUNTIFS($B$3:$B${0},O{1},$K$3:$K${2},\"KHÔNG ĐẠT\")", 3 + dt_RAW.Result.Tables[1].Rows.Count - 1, i, 3 + dt_RAW.Result.Tables[1].Rows.Count - 1);
                                    ws_BySRPG.Cells[i, 16, i, 17].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                }
                            }

                            ws_BySRPG.Cells[2, 15, 2 + dt_RAW.Result.Tables[2].Rows.Count, 15 + dt_RAW.Result.Tables[2].Columns.Count - 1].AutoFitColumns();

                        }
                    }

                    var ws_ByKAS = xls.Workbook.Worksheets["BY KAS"];
                    if (ws_ByKAS != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_ByKAS = Task.Run(() => _service.Report_OOS_Fonterra_ByKAS(AccountId, UserId, JsonData));
                        if (dt_ByKAS.Result.Rows.Count > 0)
                        {
                            dt_ByKAS.Result.Columns.Remove("RN");
                            ws_ByKAS.Cells[1, 1].LoadFromDataTable(dt_ByKAS.Result, true);
                            ExcelFormats.FormatCell(ws_ByKAS.Cells[1, 1, 1, ws_ByKAS.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_ByKAS.Row(1).Height = 30;

                            ExcelFormats.Border(ws_ByKAS, 1, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column);
                            ws_ByKAS.Cells[1, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column].AutoFitColumns();

                            #region group row
                            var curValue = "";
                            var prevValue = "";
                            var startRow = 2;
                            var endRow = 2;
                            List<int> lstGroupRow = new List<int>();

                            for (int r = 2; r <= ws_ByKAS.Dimension.End.Row; r++)
                            {
                                if (r == 2) prevValue = ws_ByKAS.Cells[r, 1].Value.ToString();

                                curValue = ws_ByKAS.Cells[r, 1].Value.ToString();

                                if (curValue != prevValue)
                                {
                                    endRow = r - 2;
                                    if (startRow == endRow)
                                    {
                                        ws_ByKAS.Row(startRow).OutlineLevel = 1;
                                        ws_ByKAS.Row(startRow).Collapsed = true;

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[startRow + 1, 1, startRow + 1, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        lstGroupRow.Add(startRow);
                                        startRow = r;
                                    }
                                    else
                                    {
                                        for (int j = startRow; j <= endRow; j++)
                                        {
                                            ws_ByKAS.Row(j).OutlineLevel = 1;
                                            ws_ByKAS.Row(j).Collapsed = true;
                                        }

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[endRow + 1, 1, endRow + 1, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        lstGroupRow.Add(endRow + 1);
                                        startRow = r;
                                    }
                                    prevValue = curValue;
                                    startRow = r;
                                    endRow = r;
                                }
                                else if (r == ws_ByKAS.Dimension.End.Row)
                                {
                                    endRow = r - 1;
                                    if (startRow == endRow)
                                    {
                                        ws_ByKAS.Row(startRow).OutlineLevel = 1;
                                        ws_ByKAS.Row(startRow).Collapsed = true;

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[startRow + 1, 1, startRow + 1, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        lstGroupRow.Add(startRow);
                                        startRow = r;
                                    }
                                    else
                                    {
                                        for (int j = startRow; j <= endRow; j++)
                                        {
                                            ws_ByKAS.Row(j).OutlineLevel = 1;
                                            ws_ByKAS.Row(j).Collapsed = true;
                                        }

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[r, 1, r, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        lstGroupRow.Add(r);
                                        startRow = r;
                                    }
                                }

                                //Formula
                                ws_ByKAS.Cells[r, 6].Formula = String.Format("={0}/{1}", ws_ByKAS.Cells[r, 5].Address, ws_ByKAS.Cells[r, 4].Address);
                                ws_ByKAS.Cells[r, 7].Formula = String.Format("=IF(1-{0}<0,\"không OOS\",1-{1})", ws_ByKAS.Cells[r, 6].Address, ws_ByKAS.Cells[r, 6].Address);
                                ws_ByKAS.Cells[r, 8].Formula = String.Format("=IF({0}=\"không OOS\", \"ĐẠT\", IF({1}<=25%, \"ĐẠT\", \"KHÔNG ĐẠT\"))", ws_ByKAS.Cells[r, 7].Address, ws_ByKAS.Cells[r, 7].Address);

                                var g = ws_ByKAS.ConditionalFormatting.AddExpression(ws_ByKAS.Cells[r, 7]);
                                g.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                g.Formula = string.Format("=AND({0}<>\"không OOS\",{0}>0.25)", ws_ByKAS.Cells[r, 7]);

                                var h = ws_ByKAS.ConditionalFormatting.AddExpression(ws_ByKAS.Cells[r, 8]);
                                h.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                h.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_ByKAS.Cells[r, 8]);

                            }
                            #endregion

                            #region ROW TOTAL
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row + 1, 1, ws_ByKAS.Dimension.End.Row + 1, 3].Value = "TOTAL";
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 1, ws_ByKAS.Dimension.End.Row, 3].Merge = true;
                            ExcelFormats.FormatCell(ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_ByKAS, ws_ByKAS.Dimension.End.Row, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column);

                            var SumOfTargetMCL = "=SUM(";
                            var SumOfAVEOSA = "=SUM(";
                            for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                            {
                                var addrRowMCL = ws_ByKAS.Cells[lstGroupRow[i], 4].Address;
                                var addrRowOSA = ws_ByKAS.Cells[lstGroupRow[i], 5].Address;
                                SumOfTargetMCL += addrRowMCL + ",";
                                SumOfAVEOSA += addrRowOSA + ",";
                            }
                            SumOfTargetMCL += ")";
                            SumOfAVEOSA += ")";

                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 4].Formula = SumOfTargetMCL;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 5].Formula = SumOfAVEOSA;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 6].Formula = String.Format("={0}/{1}", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 5].Address, ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 4].Address);
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7].Formula = String.Format("=IF(1-{0}<0,\"không OOS\",1-{1})", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 6].Address, ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 6].Address);
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 8].Formula = String.Format("=IF({0}=\"không OOS\", \"ĐẠT\", IF({1}<=25%, \"ĐẠT\", \"KHÔNG ĐẠT\"))", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7].Address, ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7].Address);

                            var q = ws_ByKAS.ConditionalFormatting.AddExpression(ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7]);
                            q.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                            q.Formula = string.Format("=AND({0}<>\"không OOS\",{0}>0.25)", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7]);

                            var k = ws_ByKAS.ConditionalFormatting.AddExpression(ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 8]);
                            k.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                            k.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 8]);

                            ws_ByKAS.Cells[2, 4, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ByKAS.Cells[2, 6, ws_ByKAS.Dimension.End.Row, 7].Style.Numberformat.Format = "0%";

                            #endregion
                        }
                    }

                    var ws_ByAcc = xls.Workbook.Worksheets["BY ACCOUNT"];
                    if (ws_ByAcc != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_ByAcc = Task.Run(() => _service.Report_OOS_Fonterra_ByAcc(AccountId, UserId, JsonData));
                        if (dt_ByAcc.Result.Rows.Count > 0)
                        {
                            dt_ByAcc.Result.Columns.Remove("RN");
                            ws_ByAcc.Cells[1, 1].LoadFromDataTable(dt_ByAcc.Result, true);
                            ExcelFormats.FormatCell(ws_ByAcc.Cells[1, 1, 1, ws_ByAcc.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_ByAcc.Row(1).Height = 30;

                            ExcelFormats.Border(ws_ByAcc, 1, 1, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column);
                            ws_ByAcc.Cells[1, 1, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column].AutoFitColumns();

                            for (int r = 2; r <= ws_ByAcc.Dimension.End.Row; r++)
                            {
                                if (r == ws_ByAcc.Dimension.End.Row)
                                {
                                    ws_ByAcc.Cells[r, 2].Formula = String.Format("=SUM(B{0}:B{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 3].Formula = String.Format("=SUM(C{0}:C{1})", 2, r - 1);
                                    ExcelFormats.FormatCell(ws_ByAcc.Cells[r, 1, r, ws_ByAcc.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);

                                }
                                ws_ByAcc.Cells[r, 4].Formula = String.Format("=IFERROR(C{0}/B{1},0)", r, r);
                                ws_ByAcc.Cells[r, 5].Formula = String.Format("=IF(1-D{0}<0,\"không OOS\",1-D{1})", r, r);
                                //ws_ByAcc.Cells[r, 6].Formula = String.Format("=IF(E{0}=\"không OOS\",\"TRUE\",E{1}<=25%)", r, r);
                                ws_ByAcc.Cells[r, 6].Formula = String.Format("=IF(E{0}=\"không OOS\", \"ĐẠT\", IF(E{1}<=25%, \"ĐẠT\", \"KHÔNG ĐẠT\"))", r, r);

                                var l = ws_ByAcc.ConditionalFormatting.AddExpression(ws_ByAcc.Cells[r, 5]);
                                l.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                l.Formula = string.Format("=AND({0}<>\"không OOS\",{0}>0.25)", ws_ByAcc.Cells[r, 5]);

                                var z = ws_ByAcc.ConditionalFormatting.AddExpression(ws_ByAcc.Cells[r, 6]);
                                z.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                z.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_ByAcc.Cells[r, 6]);

                            }

                            ws_ByAcc.Cells[2, 2, ws_ByAcc.Dimension.End.Row, 3].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_ByAcc.Cells[2, 4, ws_ByAcc.Dimension.End.Row, 5].Style.Numberformat.Format = "0%";
                            ws_ByAcc.Cells[2, 2, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ByAcc.Cells[1, 1, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column].AutoFitColumns();

                        }
                    }

                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

        public static async Task<ResultInfo> Report_OSA_Fonterra(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Report OSA_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Report_OSA.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    var dt = Task.Run(() => _service.Report_OSA_Fonterra(AccountId, UserId, JsonData)).Result;
                    if (dt.Tables[1].Rows.Count > 0)
                    {
                        //var ws_Date = xls.Workbook.Worksheets["date table"];
                        //if (ws_Date != null)
                        //{
                        //    ws_Date.Cells[1, 1].LoadFromDataTable(dt.Tables[0], true);
                        //    ExcelFormats.FormatCell(ws_Date.Cells[1, 1, 1, ws_Date.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                        //    ws_Date.Row(1).Height = 30;
                        //    ExcelFormats.Border(ws_Date, 1, 1, ws_Date.Dimension.End.Row, ws_Date.Dimension.End.Column);
                        //    ws_Date.Cells[1, 1, ws_Date.Dimension.End.Row, ws_Date.Dimension.End.Column].AutoFitColumns();
                        //}

                        var ws_Raw = xls.Workbook.Worksheets["raw data"];
                        if (ws_Raw != null)
                        {
                            dt.Tables[1].Columns.Remove("Key");
                            dt.Tables[1].Columns.Remove("CountKey");
                            ws_Raw.Cells[1, 1, 1, 5].Merge = true;
                            ws_Raw.Cells[1, 1].Value = "Stockout Report";
                            ws_Raw.Cells[1, 1].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                            ws_Raw.Cells[1, 1].Style.Font.Size = 18;
                            ws_Raw.Cells[1, 1, 1, ws_Raw.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_Raw.Cells[1, 1, 1, ws_Raw.Dimension.End.Column].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            ExcelFormats.FormatCell(ws_Raw.Cells[1, 1, 1, ws_Raw.Dimension.End.Column], "#FFFFFF", true, ExcelHorizontalAlignment.Center);
                            ws_Raw.Cells[2, 3].Value = "Từ ngày: " + dataJson.fromdate + " - Đến ngày: " + dataJson.todate;

                            ws_Raw.Cells[3, 1].LoadFromDataTable(dt.Tables[1], true);
                            ExcelFormats.FormatCell(ws_Raw.Cells[3, 1, 3, ws_Raw.Dimension.End.Column], "#305496", true, ExcelHorizontalAlignment.Center);
                            ws_Raw.Cells[3, 1, 3, ws_Raw.Dimension.End.Column].Style.Font.Color.SetColor(System.Drawing.Color.White);
                            ws_Raw.Row(3).Height = 30;
                            ExcelFormats.Border(ws_Raw, 3, 1, ws_Raw.Dimension.End.Row, ws_Raw.Dimension.End.Column);
                            ws_Raw.Cells[3, 1, ws_Raw.Dimension.End.Row, ws_Raw.Dimension.End.Column].AutoFitColumns();
                            ws_Raw.Column(3).Width = 30;
                            ws_Raw.Column(6).Width = 30;
                            ws_Raw.Column(7).Width = 30;
                            ws_Raw.Column(9).Width = 30;
                        }

                        var ws_RawByWeek = xls.Workbook.Worksheets["rawdata by week"];
                        if (ws_RawByWeek != null)
                        {
                            ws_RawByWeek.Cells[1, 1].LoadFromDataTable(dt.Tables[2], true);
                            ExcelFormats.FormatCell(ws_RawByWeek.Cells[1, 1, 1, ws_RawByWeek.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_RawByWeek.Row(1).Height = 30;
                            ExcelFormats.Border(ws_RawByWeek, 1, 1, ws_RawByWeek.Dimension.End.Row, ws_RawByWeek.Dimension.End.Column);
                            ws_RawByWeek.Cells[1, 1, ws_RawByWeek.Dimension.End.Row, ws_RawByWeek.Dimension.End.Column].AutoFitColumns();
                            ws_RawByWeek.Column(7).Width = 30;
                            ws_RawByWeek.Column(8).Width = 30;

                            for (int r = 2; r <= ws_RawByWeek.Dimension.End.Row; r++)
                            {
                                ws_RawByWeek.Cells[r, 14].Formula = String.Format("=ROUND(IFERROR(M{0}/L{0},0),2)", r);
                                ws_RawByWeek.Cells[r, 14].Style.Numberformat.Format = "0%";
                                ws_RawByWeek.Cells[r, 17].Formula = String.Format("=ROUND(IFERROR(P{0}/O{0},0),2)", r);
                                ws_RawByWeek.Cells[r, 17].Style.Numberformat.Format = "0%";
                                ws_RawByWeek.Cells[r, 20].Formula = String.Format("=ROUND(IFERROR(S{0}/R{0},0),2)", r);
                                ws_RawByWeek.Cells[r, 20].Style.Numberformat.Format = "0%";
                            }
                        }

                        var ws_BySR_PG = xls.Workbook.Worksheets["OSA by SR.PG"];
                        if (ws_BySR_PG != null)
                        {
                            ws_BySR_PG.Cells[1, 1].LoadFromDataTable(dt.Tables[3], true);
                            ExcelFormats.FormatCell(ws_BySR_PG.Cells[1, 1, 1, ws_BySR_PG.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_BySR_PG.Row(1).Height = 30;

                            ExcelFormats.Border(ws_BySR_PG, 1, 1, ws_BySR_PG.Dimension.End.Row, ws_BySR_PG.Dimension.End.Column);
                            ws_BySR_PG.Cells[1, 1, ws_BySR_PG.Dimension.End.Row, ws_BySR_PG.Dimension.End.Column].AutoFitColumns();

                            #region Formula row
                            List<int> lstGroupRow = new List<int>();

                            for (int r = 2; r <= ws_BySR_PG.Dimension.End.Row; r++)
                            {
                                //Formula
                                ws_BySR_PG.Cells[r, 6].Formula = String.Format("=SUMIF('rawdata by week'!C:C,'OSA by SR.PG'!$C{0},'rawdata by week'!$L:$L)", r);
                                ws_BySR_PG.Cells[r, 7].Formula = String.Format("=SUMIF('rawdata by week'!C:C,'OSA by SR.PG'!$C{0},'rawdata by week'!$M:$M)", r);
                                ws_BySR_PG.Cells[r, 8].Formula = String.Format("=ROUND(IFERROR(G{0}/F{0},0),2)", r);
                                ws_BySR_PG.Cells[r, 9].Formula = String.Format("=IF(H{0}>=80%,\"ĐẠT\",\"KHÔNG ĐẠT\")", r);
                                ws_BySR_PG.Cells[r, 12].Formula = String.Format("=ROUND(IFERROR(K{0}/J{0},0),2)", r);
                                ws_BySR_PG.Cells[r, 15].Formula = String.Format("=ROUND(IFERROR(N{0}/M{0},0),2)", r);

                                var h = ws_BySR_PG.ConditionalFormatting.AddExpression(ws_BySR_PG.Cells[r, 9]);
                                h.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                h.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_BySR_PG.Cells[r, 9]);

                            }
                            #endregion

                            #region ROW TOTAL
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row + 1, 1, ws_BySR_PG.Dimension.End.Row + 1, 5].Value = "TOTAL";
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 1, ws_BySR_PG.Dimension.End.Row, 5].Merge = true;
                            ExcelFormats.FormatCell(ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 1, ws_BySR_PG.Dimension.End.Row, ws_BySR_PG.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_BySR_PG, ws_BySR_PG.Dimension.End.Row, 1, ws_BySR_PG.Dimension.End.Row, ws_BySR_PG.Dimension.End.Column);

                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 6].Formula = String.Format("=SUM(F{0}:F{1})", 2, ws_BySR_PG.Dimension.End.Row - 1);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 7].Formula = String.Format("=SUM(G{0}:G{1})", 2, ws_BySR_PG.Dimension.End.Row - 1);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 8].Formula = String.Format("=ROUND(IFERROR(G{0}/F{0},0),2)", ws_BySR_PG.Dimension.End.Row);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 9].Formula = String.Format("=IF(H{0}>=80%,\"ĐẠT\",\"KHÔNG ĐẠT\")", ws_BySR_PG.Dimension.End.Row);

                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 10].Formula = String.Format("=SUM(J{0}:J{1})", 2, ws_BySR_PG.Dimension.End.Row - 1);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 11].Formula = String.Format("=SUM(K{0}:K{1})", 2, ws_BySR_PG.Dimension.End.Row - 1);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 12].Formula = String.Format("=ROUND(IFERROR(K{0}/J{0},0),2)", ws_BySR_PG.Dimension.End.Row);

                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 13].Formula = String.Format("=SUM(M{0}:M{1})", 2, ws_BySR_PG.Dimension.End.Row - 1);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 14].Formula = String.Format("=SUM(N{0}:N{1})", 2, ws_BySR_PG.Dimension.End.Row - 1);
                            ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 15].Formula = String.Format("=ROUND(IFERROR(N{0}/M{0},0),2)", ws_BySR_PG.Dimension.End.Row);

                            var k = ws_BySR_PG.ConditionalFormatting.AddExpression(ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 9]);
                            k.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                            k.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_BySR_PG.Cells[ws_BySR_PG.Dimension.End.Row, 9]);

                            ws_BySR_PG.Cells[2, 5, ws_BySR_PG.Dimension.End.Row, ws_BySR_PG.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_BySR_PG.Cells[2, 8, ws_BySR_PG.Dimension.End.Row, 8].Style.Numberformat.Format = "0%";
                            ws_BySR_PG.Cells[2, 12, ws_BySR_PG.Dimension.End.Row, 12].Style.Numberformat.Format = "0%";
                            ws_BySR_PG.Cells[2, 15, ws_BySR_PG.Dimension.End.Row, 15].Style.Numberformat.Format = "0%";
                            ws_BySR_PG.Cells[2, 6, ws_BySR_PG.Dimension.End.Row, 7].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_BySR_PG.Cells[2, 10, ws_BySR_PG.Dimension.End.Row, 11].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_BySR_PG.Cells[2, 13, ws_BySR_PG.Dimension.End.Row, 14].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            #endregion

                        }

                        var ws_ByKAS = xls.Workbook.Worksheets["OSA by KAS.TL"];
                        if (ws_ByKAS != null)
                        {
                            dt.Tables[4].Columns.Remove("RN");
                            ws_ByKAS.Cells[1, 1].LoadFromDataTable(dt.Tables[4], true);
                            ExcelFormats.FormatCell(ws_ByKAS.Cells[1, 1, 1, ws_ByKAS.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_ByKAS.Row(1).Height = 30;

                            ExcelFormats.Border(ws_ByKAS, 1, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column);
                            ws_ByKAS.Cells[1, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column].AutoFitColumns();

                            #region group row
                            var curValue = "";
                            var prevValue = "";
                            var startRow = 2;
                            var endRow = 2;
                            List<int> lstGroupRow = new List<int>();

                            for (int r = 2; r <= ws_ByKAS.Dimension.End.Row; r++)
                            {
                                if (r == 2) prevValue = ws_ByKAS.Cells[r, 1].Value.ToString();

                                curValue = ws_ByKAS.Cells[r, 1].Value.ToString();

                                if (curValue != prevValue)
                                {
                                    endRow = r - 2;
                                    if (startRow == endRow)
                                    {
                                        ws_ByKAS.Row(startRow).OutlineLevel = 1;
                                        ws_ByKAS.Row(startRow).Collapsed = true;

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[startRow + 1, 1, startRow + 1, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        //lstGroupRow.Add(startRow);

                                        //ws_ByKAS.Cells[startRow + 1, 4].Formula = string.Format("=SUM(D{0}:D{1})", startRow, startRow);
                                        //ws_ByKAS.Cells[startRow + 1, 5].Formula = string.Format("=SUM(E{0}:E{1})", startRow, startRow);

                                        startRow = r;
                                    }
                                    else
                                    {


                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[endRow + 1, 1, endRow + 1, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);

                                        if (startRow < endRow)
                                        {
                                            for (int j = startRow; j <= endRow; j++)
                                            {
                                                ws_ByKAS.Row(j).OutlineLevel = 1;
                                                ws_ByKAS.Row(j).Collapsed = true;
                                            }

                                            lstGroupRow.Add(endRow + 1);

                                            ws_ByKAS.Cells[endRow + 1, 4].Formula = string.Format("=SUM(D{0}:D{1})", startRow, endRow);
                                            ws_ByKAS.Cells[endRow + 1, 5].Formula = string.Format("=SUM(E{0}:E{1})", startRow, endRow);
                                            ws_ByKAS.Cells[endRow + 1, 8].Formula = string.Format("=SUM(H{0}:H{1})", startRow, endRow);
                                            ws_ByKAS.Cells[endRow + 1, 9].Formula = string.Format("=SUM(I{0}:I{1})", startRow, endRow);
                                            ws_ByKAS.Cells[endRow + 1, 11].Formula = string.Format("=SUM(K{0}:K{1})", startRow, endRow);
                                            ws_ByKAS.Cells[endRow + 1, 12].Formula = string.Format("=SUM(L{0}:L{1})", startRow, endRow);
                                        }


                                        startRow = r;
                                    }
                                    prevValue = curValue;
                                    startRow = r;
                                    endRow = r;
                                }
                                else if (r == ws_ByKAS.Dimension.End.Row)
                                {
                                    endRow = r - 1;
                                    if (startRow == endRow)
                                    {
                                        ws_ByKAS.Row(startRow).OutlineLevel = 1;
                                        ws_ByKAS.Row(startRow).Collapsed = true;

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[startRow + 1, 1, startRow + 1, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        lstGroupRow.Add(startRow);

                                        ws_ByKAS.Cells[startRow + 1, 4].Formula = string.Format("=SUM(D{0}:D{1})", startRow, startRow);
                                        ws_ByKAS.Cells[startRow + 1, 5].Formula = string.Format("=SUM(E{0}:E{1})", startRow, startRow);
                                        ws_ByKAS.Cells[startRow + 1, 8].Formula = string.Format("=SUM(H{0}:H{1})", startRow, startRow);
                                        ws_ByKAS.Cells[startRow + 1, 9].Formula = string.Format("=SUM(I{0}:I{1})", startRow, startRow);
                                        ws_ByKAS.Cells[startRow + 1, 11].Formula = string.Format("=SUM(K{0}:K{1})", startRow, startRow);
                                        ws_ByKAS.Cells[startRow + 1, 12].Formula = string.Format("=SUM(L{0}:L{1})", startRow, startRow);

                                        startRow = r;
                                    }
                                    else
                                    {
                                        for (int j = startRow; j <= endRow; j++)
                                        {
                                            ws_ByKAS.Row(j).OutlineLevel = 1;
                                            ws_ByKAS.Row(j).Collapsed = true;
                                        }

                                        ExcelFormats.FormatCell(ws_ByKAS.Cells[r, 1, r, ws_ByKAS.Dimension.End.Column], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        lstGroupRow.Add(r);

                                        ws_ByKAS.Cells[r, 4].Formula = string.Format("=SUM(D{0}:D{1})", startRow, endRow);
                                        ws_ByKAS.Cells[r, 5].Formula = string.Format("=SUM(E{0}:E{1})", startRow, endRow);
                                        ws_ByKAS.Cells[r, 8].Formula = string.Format("=SUM(H{0}:H{1})", startRow, endRow);
                                        ws_ByKAS.Cells[r, 9].Formula = string.Format("=SUM(I{0}:I{1})", startRow, endRow);
                                        ws_ByKAS.Cells[r, 11].Formula = string.Format("=SUM(K{0}:K{1})", startRow, endRow);
                                        ws_ByKAS.Cells[r, 12].Formula = string.Format("=SUM(L{0}:L{1})", startRow, endRow);

                                        startRow = r;
                                    }
                                }

                                //Formula
                                if (!string.IsNullOrEmpty(Convert.ToString(ws_ByKAS.Cells[r, 3].Value)) && Convert.ToString(ws_ByKAS.Cells[r, 3].Value) != "")
                                {
                                    ws_ByKAS.Cells[r, 4].Formula = String.Format("=SUMIFS('rawdata by week'!$L:$L,'rawdata by week'!$I:$I,'OSA by KAS.TL'!$C{0},'rawdata by week'!$A:$A,'OSA by KAS.TL'!$A{0})", r);
                                    ws_ByKAS.Cells[r, 5].Formula = String.Format("=SUMIFS('rawdata by week'!$M:$M,'rawdata by week'!$I:$I,'OSA by KAS.TL'!$C{0},'rawdata by week'!$A:$A,'OSA by KAS.TL'!$A{0})", r);
                                }
                                ws_ByKAS.Cells[r, 6].Formula = String.Format("=ROUND(IFERROR(E{0}/D{0},0),2)", r);
                                ws_ByKAS.Cells[r, 7].Formula = String.Format("=IF(F{0}>=80%,\"ĐẠT\",\"KHÔNG ĐẠT\")", r);

                                ws_ByKAS.Cells[r, 10].Formula = String.Format("=ROUND(IFERROR(I{0}/H{0},0),2)", r);
                                ws_ByKAS.Cells[r, 13].Formula = String.Format("=ROUND(IFERROR(L{0}/K{0},0),2)", r);

                                var h = ws_ByKAS.ConditionalFormatting.AddExpression(ws_ByKAS.Cells[r, 7]);
                                h.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                h.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_ByKAS.Cells[r, 7]);

                            }
                            #endregion

                            #region ROW TOTAL
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row + 1, 1, ws_ByKAS.Dimension.End.Row + 1, 3].Value = "TOTAL";
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 1, ws_ByKAS.Dimension.End.Row, 3].Merge = true;
                            ExcelFormats.FormatCell(ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_ByKAS, ws_ByKAS.Dimension.End.Row, 1, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column);

                            //OSA
                            var SumOfTargetOSA = "=SUM(";
                            var SumOfActualOSA = "=SUM(";
                            for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                            {
                                var addrRowTargetOSA = ws_ByKAS.Cells[lstGroupRow[i], 4].Address;
                                var addrRowActualOSA = ws_ByKAS.Cells[lstGroupRow[i], 5].Address;
                                SumOfTargetOSA += addrRowTargetOSA + ",";
                                SumOfActualOSA += addrRowActualOSA + ",";
                            }
                            SumOfTargetOSA += ")";
                            SumOfActualOSA += ")";

                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 4].Formula = SumOfTargetOSA;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 5].Formula = SumOfActualOSA;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 6].Formula = String.Format("=ROUND({0}/{1},2)", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 5].Address, ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 4].Address);
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7].Formula = String.Format("=IF(F{0}>=80%,\"ĐẠT\",\"KHÔNG ĐẠT\")", ws_ByKAS.Dimension.End.Row);

                            var k = ws_ByKAS.ConditionalFormatting.AddExpression(ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7]);
                            k.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                            k.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 7]);

                            //OSA Chilled
                            var SumOfTargetOSAChilled = "=SUM(";
                            var SumOfActualOSAChilled = "=SUM(";
                            for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                            {
                                var addrRowTargetOSA_Chilled = ws_ByKAS.Cells[lstGroupRow[i], 8].Address;
                                var addrRowActualOSA_Chilled = ws_ByKAS.Cells[lstGroupRow[i], 9].Address;
                                SumOfTargetOSAChilled += addrRowTargetOSA_Chilled + ",";
                                SumOfActualOSAChilled += addrRowActualOSA_Chilled + ",";
                            }
                            SumOfTargetOSAChilled += ")";
                            SumOfActualOSAChilled += ")";

                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 8].Formula = SumOfTargetOSAChilled;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 9].Formula = SumOfActualOSAChilled;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 10].Formula = String.Format("=ROUND(IFERROR({0}/{1},0),2)", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 9].Address, ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 8].Address);

                            //OSA CGs
                            var SumOfTargetOSACGs = "=SUM(";
                            var SumOfActualOSACGs = "=SUM(";
                            for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                            {
                                var addrRowTargetOSA_CGs = ws_ByKAS.Cells[lstGroupRow[i], 11].Address;
                                var addrRowActualOSA_CGs = ws_ByKAS.Cells[lstGroupRow[i], 12].Address;
                                SumOfTargetOSACGs += addrRowTargetOSA_CGs + ",";
                                SumOfActualOSACGs += addrRowActualOSA_CGs + ",";
                            }
                            SumOfTargetOSACGs += ")";
                            SumOfActualOSACGs += ")";

                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 11].Formula = SumOfTargetOSACGs;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 12].Formula = SumOfActualOSACGs;
                            ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 13].Formula = String.Format("=ROUND(IFERROR({0}/{1},0),2)", ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 12].Address, ws_ByKAS.Cells[ws_ByKAS.Dimension.End.Row, 11].Address);

                            ws_ByKAS.Cells[2, 4, ws_ByKAS.Dimension.End.Row, ws_ByKAS.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ByKAS.Cells[2, 6, ws_ByKAS.Dimension.End.Row, 6].Style.Numberformat.Format = "0%";
                            ws_ByKAS.Cells[2, 10, ws_ByKAS.Dimension.End.Row, 10].Style.Numberformat.Format = "0%";
                            ws_ByKAS.Cells[2, 13, ws_ByKAS.Dimension.End.Row, 13].Style.Numberformat.Format = "0%";
                            ws_ByKAS.Cells[2, 4, ws_ByKAS.Dimension.End.Row, 5].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_ByKAS.Cells[2, 8, ws_ByKAS.Dimension.End.Row, 9].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_ByKAS.Cells[2, 11, ws_ByKAS.Dimension.End.Row, 12].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");

                            #endregion

                        }

                        var ws_ByAcc = xls.Workbook.Worksheets["OSA by Account"];
                        if (ws_ByAcc != null)
                        {
                            dt.Tables[5].Columns.Remove("RN");
                            ws_ByAcc.Cells[1, 1].LoadFromDataTable(dt.Tables[5], true);
                            ExcelFormats.FormatCell(ws_ByAcc.Cells[1, 1, 1, ws_ByAcc.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws_ByAcc.Row(1).Height = 30;

                            ExcelFormats.Border(ws_ByAcc, 1, 1, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column);
                            ws_ByAcc.Cells[1, 1, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column].AutoFitColumns();

                            for (int r = 2; r <= ws_ByAcc.Dimension.End.Row; r++)
                            {
                                if (r == ws_ByAcc.Dimension.End.Row)
                                {
                                    ws_ByAcc.Cells[r, 2].Formula = String.Format("=SUM(B{0}:B{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 3].Formula = String.Format("=SUM(C{0}:C{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 4].Formula = String.Format("=ROUND(IFERROR(C{0}/B{0},0),2)", r);
                                    ws_ByAcc.Cells[r, 5].Formula = String.Format("=IF(D{0}>=80%,\"ĐẠT\",\"KHÔNG ĐẠT\")", r);
                                    ws_ByAcc.Cells[r, 6].Formula = String.Format("=SUM(F{0}:F{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 7].Formula = String.Format("=SUM(G{0}:G{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 8].Formula = String.Format("=ROUND(IFERROR(G{0}/F{0},0),2)", r);
                                    ws_ByAcc.Cells[r, 9].Formula = String.Format("=SUM(I{0}:I{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 10].Formula = String.Format("=SUM(J{0}:J{1})", 2, r - 1);
                                    ws_ByAcc.Cells[r, 11].Formula = String.Format("=ROUND(IFERROR(J{0}/I{0},0),2)", r);
                                    ExcelFormats.FormatCell(ws_ByAcc.Cells[r, 1, r, ws_ByAcc.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                                }
                                else
                                {
                                    ws_ByAcc.Cells[r, 2].Formula = String.Format("=SUMIF('rawdata by week'!$I:$I,'OSA by Account'!$A{0},'rawdata by week'!L:L)", r);
                                    ws_ByAcc.Cells[r, 3].Formula = String.Format("=SUMIF('rawdata by week'!$I:$I,'OSA by Account'!$A{0},'rawdata by week'!M:M)", r);
                                    ws_ByAcc.Cells[r, 4].Formula = String.Format("=ROUND(IFERROR(C{0}/B{0},0),2)", r);
                                    ws_ByAcc.Cells[r, 5].Formula = String.Format("=IF(D{0}>=80%,\"ĐẠT\",\"KHÔNG ĐẠT\")", r);
                                    ws_ByAcc.Cells[r, 8].Formula = String.Format("=ROUND(IFERROR(G{0}/F{0},0),2)", r);
                                    ws_ByAcc.Cells[r, 11].Formula = String.Format("=ROUND(IFERROR(J{0}/I{0},0),2)", r);

                                }

                                var z = ws_ByAcc.ConditionalFormatting.AddExpression(ws_ByAcc.Cells[r, 5]);
                                z.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                z.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws_ByAcc.Cells[r, 5]);

                            }

                            ws_ByAcc.Cells[2, 2, ws_ByAcc.Dimension.End.Row, 3].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_ByAcc.Cells[2, 6, ws_ByAcc.Dimension.End.Row, 7].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_ByAcc.Cells[2, 9, ws_ByAcc.Dimension.End.Row, 10].Style.Numberformat.Format = string.Format("_(* #,##0_);_(* (#,##0);_(* \"-\"??_);_(@_)");
                            ws_ByAcc.Cells[2, 4, ws_ByAcc.Dimension.End.Row, 4].Style.Numberformat.Format = "0%";
                            ws_ByAcc.Cells[2, 8, ws_ByAcc.Dimension.End.Row, 8].Style.Numberformat.Format = "0%";
                            ws_ByAcc.Cells[2, 11, ws_ByAcc.Dimension.End.Row, 11].Style.Numberformat.Format = "0%";
                            ws_ByAcc.Cells[2, 2, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws_ByAcc.Cells[1, 1, ws_ByAcc.Dimension.End.Row, ws_ByAcc.Dimension.End.Column].AutoFitColumns();
                        }

                        xls.Save();
                        return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                    }
                    else
                    {
                        return new ResultInfo(500, "No Data", null);
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

        public static async Task<ResultInfo> Report_PLANOGRAM_Fonterra(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Report PLANOGRAM (POG)_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_FTR/tmp_Report_PLANOGRAM.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    var ws = xls.Workbook.Worksheets["THỐNG KÊ"];
                    if (ws != null)
                    {
                        await Task.Yield();
                        Task<DataSet> dt = Task.Run(() => _service.Report_PLANOGRAM_Fonterra_TK(AccountId, UserId, JsonData));
                        if (dt.Result.Tables[0].Rows.Count > 0)
                        {
                            var dtTK = dt.Result.Tables[0];

                            dtTK.Columns.Remove("RN1");
                            dtTK.Columns.Remove("RN2");

                            ws.Cells[3, 1].LoadFromDataTable(dtTK, true);
                            ExcelFormats.FormatCell(ws.Cells[3, 1, 3, ws.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);
                            ws.Row(2).Height = 25;

                            ws.Cells[ws.Dimension.End.Row + 1, 1].Value = "Grand Total";
                            ws.Cells[ws.Dimension.End.Row, 1, ws.Dimension.End.Row, 3].Merge = true;
                            ExcelFormats.FormatCell(ws.Cells[ws.Dimension.End.Row, 1, ws.Dimension.End.Row, ws.Dimension.End.Column], "#92D050", true, ExcelHorizontalAlignment.Center);

                            ExcelFormats.Border(ws, 3, 1, ws.Dimension.End.Row, ws.Dimension.End.Column);
                            ws.Cells[1, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].AutoFitColumns();

                            #region Header
                            string header = string.Empty;
                            int startColumn = 4;
                            for (int c = startColumn; c <= ws.Dimension.End.Column; c++)
                            {
                                header = Convert.ToString(ws.Cells[3, c].Value);
                                string[] key = header.Split('_');
                                if (key.Count() == 2)
                                {
                                    ws.Column(c).Width = 11.73;
                                    ws.Cells[2, c].Value = key[0];
                                    ws.Cells[3, c].Value = key[1];
                                    ExcelFormats.FormatCell(ws.Cells[2, c], "#FFFF00", true, ExcelHorizontalAlignment.Center);
                                    ExcelFormats.FormatCell(ws.Cells[3, c], "#92D050", true, ExcelHorizontalAlignment.Center);

                                }

                            }

                            // Merge Header
                            var start = 4;
                            var end = 4;
                            var cur = "";
                            var prev = "";
                            for (int i = startColumn; i <= ws.Dimension.End.Column; i++)
                            {
                                if (i == startColumn)
                                {
                                    prev = ws.Cells[2, i].Value.ToString();
                                }
                                cur = ws.Cells[2, i].Value.ToString();
                                if (cur != prev)
                                {
                                    if (i == ws.Dimension.End.Column)
                                    {
                                        end = i;
                                        ws.Cells[2, start, 2, end].Merge = true;
                                        ExcelFormats.Border(ws, 2, start, 2, end);
                                        break;
                                    }
                                    else
                                    {
                                        end = i - 1;
                                        ws.Cells[2, start, 2, end].Merge = true;
                                        ExcelFormats.Border(ws, 2, start, 2, end);
                                        start = i;
                                        end = i;
                                        prev = cur;
                                    }
                                }
                                if (i == ws.Dimension.End.Column)
                                {
                                    end = i;
                                    ws.Cells[2, start, 2, end].Merge = true;
                                    ExcelFormats.Border(ws, 2, start, 2, end);
                                    break;
                                }
                            }
                            #endregion 

                            #region group row
                            var curValue = "";
                            var startRow = 5;
                            var endRow = 5;
                            List<int> lstGroupRow = new List<int>();
                            List<int> lstColPass = new List<int>();
                            List<int> lstColFail = new List<int>();

                            for (int c = 4; c <= ws.Dimension.End.Column; c++)
                            {
                                var colName = ws.Cells[3, c].Value.ToString();
                                if (colName.ToUpper() == "PASS" && c < ws.Dimension.End.Column - 4)
                                {
                                    lstColPass.Add(c);
                                }
                                else if (colName.ToUpper() == "FAIL" && c < ws.Dimension.End.Column - 4)
                                {
                                    lstColFail.Add(c);
                                }
                            }

                            for (int r = 4; r <= ws.Dimension.End.Row; r++)
                            {
                                curValue = Convert.ToString(ws.Cells[r, 3].Value);
                                if (string.IsNullOrEmpty(curValue))
                                {
                                    ExcelFormats.FormatCell(ws.Cells[r, 1, r, ws.Dimension.End.Column], "#C6E0B4", true, ExcelHorizontalAlignment.Center);

                                    if (r != 4)
                                    {
                                        if (r == ws.Dimension.End.Row)
                                        {
                                            endRow = r - 1;
                                            if (startRow < endRow)
                                            {
                                                for (int j = startRow; j <= endRow; j++)
                                                {
                                                    ws.Row(j).OutlineLevel = 1;
                                                    ws.Row(j).Collapsed = true;
                                                }

                                                for (int c = 4; c <= ws.Dimension.End.Column; c++)
                                                {
                                                    //Lastest Sup
                                                    var colName = ws.Cells[3, c].Value.ToString();
                                                    var startAddress = ws.Cells[startRow, c].Address;
                                                    var endAddress = ws.Cells[endRow, c].Address;
                                                    if (colName.ToUpper() == "PASS" && c < ws.Dimension.End.Column - 4)
                                                    {
                                                        ws.Cells[startRow - 1, c].Formula = string.Format("=SUM({0}:{1})", startAddress, endAddress);

                                                        //Grand Total
                                                        var SumOfPass = "=SUM(";
                                                        for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                                                        {
                                                            var addrRowPass = ws.Cells[lstGroupRow[i], c].Address;
                                                            SumOfPass += addrRowPass + ",";
                                                        }
                                                        SumOfPass += ")";

                                                        ws.Cells[r, c].Formula = SumOfPass;
                                                    }
                                                    else if (colName.ToUpper() == "FAIL" && c < ws.Dimension.End.Column - 4)
                                                    {
                                                        ws.Cells[startRow - 1, c].Formula = string.Format("=SUM({0}:{1})", startAddress, endAddress);

                                                        //Grand Total
                                                        var SumOfFail = "=SUM(";
                                                        for (int i = 0; i <= lstGroupRow.Count - 1; i++)
                                                        {
                                                            var addrRowFail = ws.Cells[lstGroupRow[i], c].Address;
                                                            SumOfFail += addrRowFail + ",";
                                                        }
                                                        SumOfFail += ")";

                                                        ws.Cells[r, c].Formula = SumOfFail;
                                                    }

                                                }
                                            }

                                        }
                                        else
                                        {
                                            endRow = r - 1;
                                            if (startRow < endRow)
                                            {
                                                for (int j = startRow; j <= endRow; j++)
                                                {
                                                    ws.Row(j).OutlineLevel = 1;
                                                    ws.Row(j).Collapsed = true;
                                                }

                                                lstGroupRow.Add(r);

                                                for (int c = 4; c <= ws.Dimension.End.Column; c++)
                                                {
                                                    var colName = ws.Cells[3, c].Value.ToString();
                                                    var startAddress = ws.Cells[startRow, c].Address;
                                                    var endAddress = ws.Cells[endRow, c].Address;
                                                    if (colName.ToUpper() == "PASS" && c < ws.Dimension.End.Column - 4)
                                                    {
                                                        ws.Cells[startRow - 1, c].Formula = string.Format("=SUM({0}:{1})", startAddress, endAddress);
                                                    }
                                                    else if (colName.ToUpper() == "FAIL" && c < ws.Dimension.End.Column - 4)
                                                    {
                                                        ws.Cells[startRow - 1, c].Formula = string.Format("=SUM({0}:{1})", startAddress, endAddress);
                                                    }
                                                }
                                            }

                                            startRow = r + 1;
                                            endRow = r + 1;
                                        }
                                    }
                                    else
                                    {
                                        lstGroupRow.Add(r);

                                        //Total Tháng - Pass Fail
                                        for (int c = 4; c <= ws.Dimension.End.Column; c++)
                                        {
                                            var colName = ws.Cells[3, c].Value.ToString();

                                            //Pass
                                            if (colName.ToUpper() == "PASS" && c == ws.Dimension.End.Column - 4)
                                            {
                                                var SumOfPass = "=SUM(";
                                                for (int i = 0; i <= lstColPass.Count - 1; i++)
                                                {
                                                    var addrRowPass = ws.Cells[4, lstColPass[i]].Address;
                                                    SumOfPass += addrRowPass + ",";
                                                }
                                                SumOfPass += ")";

                                                ws.Cells[4, c].Formula = SumOfPass;
                                            }
                                            else if (colName.ToUpper() == "FAIL" && c == ws.Dimension.End.Column - 3)
                                            {
                                                var SumOfFail = "=SUM(";
                                                for (int i = 0; i <= lstColFail.Count - 1; i++)
                                                {
                                                    var addrRowFail = ws.Cells[4, lstColFail[i]].Address;
                                                    SumOfFail += addrRowFail + ",";
                                                }
                                                SumOfFail += ")";

                                                ws.Cells[4, c].Formula = SumOfFail;
                                            }
                                        }
                                    }

                                }

                                //Formula
                                for (int c = 4; c <= ws.Dimension.End.Column; c++)
                                {
                                    var colName = ws.Cells[3, c].Value.ToString();

                                    if (colName.ToUpper() == "TOTAL")
                                    {
                                        var passAddress = ws.Cells[r, c - 2].Address;
                                        var failAddress = ws.Cells[r, c - 1].Address;
                                        ws.Cells[r, c].Formula = string.Format("=IFERROR({0}+{1},0)", passAddress, failAddress);
                                    }
                                    else if (colName.ToUpper() == "% THỰC ĐẠT")
                                    {
                                        var passAddress = ws.Cells[r, c - 3].Address;
                                        var totalAddress = ws.Cells[r, c - 1].Address;
                                        ws.Cells[r, c].Formula = string.Format("=IFERROR({0}/{1},0)", passAddress, totalAddress);
                                        ws.Cells[r, c].Style.Numberformat.Format = "0%";
                                    }
                                    else if (colName.ToUpper() == "ĐẠT/KHÔNG ĐẠT")
                                    {
                                        var percentAddress = ws.Cells[r, c - 1].Address;
                                        ws.Cells[r, c].Formula = String.Format("=IF({0}>= 50%, \"ĐẠT\", \"KHÔNG ĐẠT\")", percentAddress);

                                        var h = ws.ConditionalFormatting.AddExpression(ws.Cells[r, c]);
                                        h.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                        h.Formula = string.Format("={0}=\"KHÔNG ĐẠT\"", ws.Cells[r, c]);
                                    }

                                    //Total Tháng - Pass Fail
                                    if (colName.ToUpper() == "PASS" && c == ws.Dimension.End.Column - 4)
                                    {
                                        var SumOfPass = "=SUM(";
                                        for (int i = 0; i <= lstColPass.Count - 1; i++)
                                        {
                                            var addrRowPass = ws.Cells[r, lstColPass[i]].Address;
                                            SumOfPass += addrRowPass + ",";
                                        }
                                        SumOfPass += ")";

                                        ws.Cells[r, c].Formula = SumOfPass;
                                    }
                                    else if (colName.ToUpper() == "FAIL" && c == ws.Dimension.End.Column - 3)
                                    {
                                        var SumOfFail = "=SUM(";
                                        for (int i = 0; i <= lstColFail.Count - 1; i++)
                                        {
                                            var addrRowFail = ws.Cells[r, lstColFail[i]].Address;
                                            SumOfFail += addrRowFail + ",";
                                        }
                                        SumOfFail += ")";

                                        ws.Cells[r, c].Formula = SumOfFail;
                                    }
                                }

                            }
                            #endregion

                            ws.Cells[4, 1, ws.Dimension.End.Row, ws.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            ws.Cells[4, 2, ws.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }

                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

        public static async Task<ResultInfo> Report_OSA_MRC(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Export_Report_OSA_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_MRC/tmp_export_report_osa.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    #region TOTAL MT
                    var ws_TotalMT = xls.Workbook.Worksheets["TOTAL MT"];
                    if (ws_TotalMT != null)
                    {
                        await Task.Yield();
                        Task<DataSet> dt_TotalMT = Task.Run(() => _service.Report_OSA_MRC_TotalMT(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));
                        if (dt_TotalMT.Result.Tables[0].Rows.Count > 0)
                        {
                            ws_TotalMT.Cells[1, 1].Value = "SUMMARY OSA FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_TotalMT.Cells[1, 1, 1, 6].Merge = true;
                            ws_TotalMT.Cells[1, 1].Style.Font.Size = 20;

                            #region Table OSA BY CUSTOMER
                            var tb_byCus = dt_TotalMT.Result.Tables[0];
                            var endColByCus = tb_byCus.Columns.Count;
                            var endRowByCus = tb_byCus.Rows.Count + 4;

                            ws_TotalMT.Cells[3, 1].Value = "OSA BY CUSTOMER";
                            ws_TotalMT.Cells[3, 1, 3, endColByCus].Merge = true;
                            ExcelFormats.FormatCell(ws_TotalMT.Cells[3, 1, 3, endColByCus], "#19b7f1", true, ExcelHorizontalAlignment.Center);

                            ws_TotalMT.Cells[4, 1].LoadFromDataTable(tb_byCus, true);
                            ExcelFormats.FormatCell(ws_TotalMT.Cells[4, 1, 4, endColByCus], "#00872B", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_TotalMT, 3, 1, endRowByCus, endColByCus);
                            #endregion

                            #region Table OSA BY BRAND
                            var tb_byBrand = dt_TotalMT.Result.Tables[1];
                            var startColByBrand = endColByCus + 2;
                            var endColByBrand = startColByBrand + tb_byBrand.Columns.Count - 1;
                            var endRowByBrand = tb_byBrand.Rows.Count + 4;

                            ws_TotalMT.Cells[3, startColByBrand].Value = "OSA BY BRAND";
                            ws_TotalMT.Cells[3, startColByBrand, 3, endColByBrand].Merge = true;
                            ExcelFormats.FormatCell(ws_TotalMT.Cells[3, startColByBrand, 3, endColByBrand], "#19b7f1", true, ExcelHorizontalAlignment.Center);

                            ws_TotalMT.Cells[4, startColByBrand].LoadFromDataTable(tb_byBrand, true);
                            ExcelFormats.FormatCell(ws_TotalMT.Cells[4, startColByBrand, 4, endColByBrand], "#00872B", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_TotalMT, 3, startColByBrand, endRowByBrand, endColByBrand);
                            #endregion

                            #region Table OSA BY CATEGORY
                            var tb_byCat = dt_TotalMT.Result.Tables[2];
                            var startColByCat = endColByBrand + 2;
                            var endColByCat = startColByCat + tb_byCat.Columns.Count - 1;
                            var endRowByCat = tb_byCat.Rows.Count + 4;

                            ws_TotalMT.Cells[3, startColByCat].Value = "OSA BY CATEGORY";
                            ws_TotalMT.Cells[3, startColByCat, 3, endColByCat].Merge = true;
                            ExcelFormats.FormatCell(ws_TotalMT.Cells[3, startColByCat, 3, endColByCat], "#19b7f1", true, ExcelHorizontalAlignment.Center);

                            ws_TotalMT.Cells[4, startColByCat].LoadFromDataTable(tb_byCat, true);
                            ExcelFormats.FormatCell(ws_TotalMT.Cells[4, startColByCat, 4, endColByCat], "#00872B", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_TotalMT, 3, startColByCat, endRowByCat, endColByCat);
                            #endregion

                            #region Format Number
                            for (int i = 1; i <= endColByCat; i++)
                            {
                                var colName = Convert.ToString(ws_TotalMT.Cells[4, i].Value);
                                if (colName.ToUpper() == "SKU LISTED" || colName.ToUpper() == "OSA")
                                {
                                    ws_TotalMT.Cells[5, i, endRowByCus, i].Style.Numberformat.Format = string.Format("_-* #,##0_-;-* #,##0_-;_-* \" - \"??_-;_-@_-");
                                }
                                else if (colName.ToUpper() == "% DIFERENCE")
                                {
                                    ws_TotalMT.Cells[5, i, endRowByCus, i].Style.Numberformat.Format = "0%";
                                }
                            }
                            #endregion

                            ws_TotalMT.Cells[4, 1, ws_TotalMT.Dimension.End.Row, ws_TotalMT.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }
                    #endregion

                    #region OSA BY CUSTOMER
                    var ws_OSAByCus = xls.Workbook.Worksheets["OSA BY CUSTOMER"];
                    if (ws_OSAByCus != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_OSAByCus = Task.Run(() => _service.Report_OSA_MRC_OSAByCus(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));
                        if (dt_OSAByCus.Result.Rows.Count > 0)
                        {
                            ws_OSAByCus.Cells[1, 1].Value = "OSA BY CUSTOMER FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_OSAByCus.Cells[1, 1, 1, 6].Merge = true;
                            ws_OSAByCus.Cells[1, 1].Style.Font.Size = 20;


                            var tb_byCus = dt_OSAByCus.Result;
                            var endColByCus = tb_byCus.Columns.Count;
                            var endRowByCus = tb_byCus.Rows.Count + 3;

                            ws_OSAByCus.Cells[3, 1].LoadFromDataTable(tb_byCus, true);
                            ExcelFormats.FormatCell(ws_OSAByCus.Cells[3, 1, 3, endColByCus], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_OSAByCus, 3, 1, endRowByCus, endColByCus);

                            #region Format Number
                            for (int i = 1; i <= endColByCus; i++)
                            {
                                var colName = Convert.ToString(ws_OSAByCus.Cells[3, i].Value);
                                if (colName.ToUpper() == "SKU LISTED" || colName.ToUpper() == "OSA")
                                {
                                    ws_OSAByCus.Cells[4, i, endRowByCus, i].Style.Numberformat.Format = string.Format("_-* #,##0_-;-* #,##0_-;_-* \" - \"??_-;_-@_-");
                                }
                                else if (colName.ToUpper() == "%OSA")
                                {
                                    ws_OSAByCus.Cells[4, i, endRowByCus, i].Style.Numberformat.Format = "0%";
                                }
                            }
                            #endregion

                            ws_OSAByCus.Cells[4, 1, ws_OSAByCus.Dimension.End.Row, ws_OSAByCus.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }
                    #endregion

                    await Task.Yield();
                    Task<DataSet> dt_OSAByDate = Task.Run(() => _service.Report_OSA_MRC_OSAByDate(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));

                    #region sheet OSA BY CUSTOMER-SUPER
                    if (dt_OSAByDate.Result.Tables[0].Rows.Count > 0)
                    {
                        var ws_OSAByDate_Supper = xls.Workbook.Worksheets["OSA BY CUSTOMER-SUPER"];
                        if (ws_OSAByDate_Supper != null)
                        {
                            ws_OSAByDate_Supper.Cells[1, 1].Value = "OSA BY CUSTOMER BY STORE FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_OSAByDate_Supper.Cells[1, 1, 1, 6].Merge = true;
                            ws_OSAByDate_Supper.Cells[1, 1].Style.Font.Size = 20;

                            var tb_OSAByDate_Supper = dt_OSAByDate.Result.Tables[0];

                            tb_OSAByDate_Supper.Columns.Remove("ChannelId");

                            ws_OSAByDate_Supper.Cells[4, 1].LoadFromDataTable(tb_OSAByDate_Supper, true);

                            var endColOSAByDate_Supper = ws_OSAByDate_Supper.Dimension.End.Column;
                            var endRowOSAByDate_Supper = ws_OSAByDate_Supper.Dimension.End.Row;

                            //Header
                            var startColGroup = 6;
                            for (int c = 1; c <= endColOSAByDate_Supper; c++)
                            {
                                var key = Convert.ToString(ws_OSAByDate_Supper.Cells[4, c].Value).Split("_");
                                if (key.Length == 2)
                                {
                                    ws_OSAByDate_Supper.Cells[3, c].Value = key[1];
                                    ws_OSAByDate_Supper.Cells[4, c].Value = key[0];

                                    if (c == startColGroup + 3 || c == endColOSAByDate_Supper)
                                    {
                                        var endColGroup = startColGroup + 2;
                                        if (c == endColOSAByDate_Supper) endColGroup = c;
                                        ws_OSAByDate_Supper.Cells[3, startColGroup, 3, endColGroup].Merge = true;
                                        ExcelFormats.FormatCell(ws_OSAByDate_Supper.Cells[3, startColGroup, 4, endColGroup], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                                        ws_OSAByDate_Supper.Cells[3, startColGroup, 4, endColGroup].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        startColGroup = c;
                                    }

                                    var colPer = Convert.ToString(ws_OSAByDate_Supper.Cells[4, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByDate_Supper.Cells[5, c, ws_OSAByDate_Supper.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                                else
                                {
                                    ws_OSAByDate_Supper.Cells[3, c].Value = key[0];
                                    ws_OSAByDate_Supper.Cells[3, c, 4, c].Merge = true;
                                    var color = "#FFFFFF";

                                    if (key[0].ToUpper() == "EMPLOYEE")
                                    {
                                        color = "#ffd700";

                                    }
                                    else if (key[0].ToUpper() == "SKU LISTED" || key[0].ToUpper() == "OSA" || key[0].ToUpper() == "%")
                                    {
                                        color = "#F39999";
                                    }
                                    ExcelFormats.FormatCell(ws_OSAByDate_Supper.Cells[3, c, 4, c], color, true, ExcelHorizontalAlignment.Center);
                                    ws_OSAByDate_Supper.Cells[3, c, 4, c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                    var colPer = Convert.ToString(ws_OSAByDate_Supper.Cells[4, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByDate_Supper.Cells[5, c, ws_OSAByDate_Supper.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                            }

                            for (int r = 5; r <= endRowOSAByDate_Supper; r++)
                            {
                                var ind = Convert.ToInt32(ws_OSAByDate_Supper.Cells[r, 2].Value);
                                if (ind == 0)
                                {
                                    ws_OSAByDate_Supper.Row(r).Style.Font.Bold = true;
                                }
                                else if (ind == 1)
                                {
                                    ws_OSAByDate_Supper.Row(r).Style.Font.Bold = true;
                                    ws_OSAByDate_Supper.Row(r).Style.Font.Color.SetColor(color: System.Drawing.Color.Blue);
                                }
                                else if (ind == 2)
                                {
                                    ws_OSAByDate_Supper.Row(r).Style.Font.Italic = true;
                                }
                            }

                            ws_OSAByDate_Supper.Cells[3, 1, ws_OSAByDate_Supper.Dimension.End.Row, ws_OSAByDate_Supper.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(ws_OSAByDate_Supper, 3, 1, endRowOSAByDate_Supper, endColOSAByDate_Supper);
                            ws_OSAByDate_Supper.DeleteColumn(2);
                        }

                    }
                    else
                    {
                        return new ResultInfo(500, "No data!", null);
                    }
                    #endregion

                    #region sheet OSA BY CUSTOMER-IND,CVS
                    if (dt_OSAByDate.Result.Tables[1].Rows.Count > 0)
                    {
                        var ws_OSAByDate_INDCVS = xls.Workbook.Worksheets["OSA BY CUSTOMER-IND,CVS"];
                        if (ws_OSAByDate_INDCVS != null)
                        {
                            ws_OSAByDate_INDCVS.Cells[1, 1].Value = "OSA BY CUSTOMER BY STORE FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_OSAByDate_INDCVS.Cells[1, 1, 1, 6].Merge = true;
                            ws_OSAByDate_INDCVS.Cells[1, 1].Style.Font.Size = 20;

                            var tb_OSAByDate_INDCVS = dt_OSAByDate.Result.Tables[1];

                            tb_OSAByDate_INDCVS.Columns.Remove("ChannelId");

                            ws_OSAByDate_INDCVS.Cells[4, 1].LoadFromDataTable(tb_OSAByDate_INDCVS, true);

                            var endColOSAByDate_INDCVS = ws_OSAByDate_INDCVS.Dimension.End.Column;
                            var endRowOSAByDate_INDCVS = ws_OSAByDate_INDCVS.Dimension.End.Row;

                            //Header
                            var startColGroup = 6;
                            for (int c = 1; c <= endColOSAByDate_INDCVS; c++)
                            {
                                var key = Convert.ToString(ws_OSAByDate_INDCVS.Cells[4, c].Value).Split("_");
                                if (key.Length == 2)
                                {
                                    ws_OSAByDate_INDCVS.Cells[3, c].Value = key[1];
                                    ws_OSAByDate_INDCVS.Cells[4, c].Value = key[0];

                                    if (c == startColGroup + 3 || c == endColOSAByDate_INDCVS)
                                    {
                                        var endColGroup = startColGroup + 2;
                                        if (c == endColOSAByDate_INDCVS) endColGroup = c;
                                        ws_OSAByDate_INDCVS.Cells[3, startColGroup, 3, endColGroup].Merge = true;
                                        ExcelFormats.FormatCell(ws_OSAByDate_INDCVS.Cells[3, startColGroup, 4, endColGroup], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                                        ws_OSAByDate_INDCVS.Cells[3, startColGroup, 4, endColGroup].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        startColGroup = c;
                                    }

                                    var colPer = Convert.ToString(ws_OSAByDate_INDCVS.Cells[4, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByDate_INDCVS.Cells[5, c, ws_OSAByDate_INDCVS.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                                else
                                {
                                    ws_OSAByDate_INDCVS.Cells[3, c].Value = key[0];
                                    ws_OSAByDate_INDCVS.Cells[3, c, 4, c].Merge = true;
                                    var color = "#FFFFFF";

                                    if (key[0].ToUpper() == "EMPLOYEE")
                                    {
                                        color = "#ffd700";

                                    }
                                    else if (key[0].ToUpper() == "SKU LISTED" || key[0].ToUpper() == "OSA" || key[0].ToUpper() == "%")
                                    {
                                        color = "#F39999";
                                    }
                                    ExcelFormats.FormatCell(ws_OSAByDate_INDCVS.Cells[3, c, 4, c], color, true, ExcelHorizontalAlignment.Center);
                                    ws_OSAByDate_INDCVS.Cells[3, c, 4, c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                    var colPer = Convert.ToString(ws_OSAByDate_INDCVS.Cells[4, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByDate_INDCVS.Cells[5, c, ws_OSAByDate_INDCVS.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                            }

                            for (int r = 5; r <= endRowOSAByDate_INDCVS; r++)
                            {
                                var ind = Convert.ToInt32(ws_OSAByDate_INDCVS.Cells[r, 2].Value);
                                if (ind == 0)
                                {
                                    ws_OSAByDate_INDCVS.Row(r).Style.Font.Bold = true;
                                }
                                else if (ind == 1)
                                {
                                    ws_OSAByDate_INDCVS.Row(r).Style.Font.Bold = true;
                                    ws_OSAByDate_INDCVS.Row(r).Style.Font.Color.SetColor(color: System.Drawing.Color.Blue);
                                }
                                else if (ind == 2)
                                {
                                    ws_OSAByDate_INDCVS.Row(r).Style.Font.Italic = true;
                                }
                            }

                            ws_OSAByDate_INDCVS.Cells[3, 1, ws_OSAByDate_INDCVS.Dimension.End.Row, ws_OSAByDate_INDCVS.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(ws_OSAByDate_INDCVS, 3, 1, endRowOSAByDate_INDCVS, endColOSAByDate_INDCVS);
                            ws_OSAByDate_INDCVS.DeleteColumn(2);
                            ws_OSAByDate_INDCVS.Column(1).Width = 30;
                        }

                    }
                    else
                    {
                        return new ResultInfo(500, "No data!", null);
                    }
                    #endregion

                    #region sheet OSA BY BRAND
                    await Task.Yield();
                    Task<DataTable> dt_OSAByBrand = Task.Run(() => _service.Report_OSA_MRC_OSAByBrand(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));

                    if (dt_OSAByBrand.Result.Rows.Count > 0)
                    {
                        var ws_OSAByBrand = xls.Workbook.Worksheets["OSA BY BRAND"];
                        if (ws_OSAByBrand != null)
                        {
                            ws_OSAByBrand.Cells[1, 1].Value = "OSA BY BRAND BY CUSTOMER BY STORE PG FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_OSAByBrand.Cells[1, 1, 1, 6].Merge = true;
                            ws_OSAByBrand.Cells[1, 1].Style.Font.Size = 20;

                            var tb_OSAByBrand = dt_OSAByBrand.Result;

                            ws_OSAByBrand.Cells[5, 1].LoadFromDataTable(tb_OSAByBrand, true);

                            var endColOSAByBrand = ws_OSAByBrand.Dimension.End.Column;
                            var endRowOSAByBrand = ws_OSAByBrand.Dimension.End.Row;

                            //Header
                            var cur = "";
                            var prev = "";
                            var startColHeader = 3;
                            var startColGroup = 3;
                            for (int c = 1; c <= endColOSAByBrand; c++)
                            {
                                var key = Convert.ToString(ws_OSAByBrand.Cells[5, c].Value).Split("_");
                                if (key.Length == 3)
                                {

                                    ws_OSAByBrand.Cells[3, c].Value = key[0];
                                    ws_OSAByBrand.Cells[4, c].Value = key[1];
                                    ws_OSAByBrand.Cells[5, c].Value = key[2];

                                    if (c == 3) prev = key[0];
                                    cur = key[0];

                                    if (cur != prev)
                                    {
                                        ws_OSAByBrand.Cells[3, startColHeader, 3, c - 1].Merge = true;
                                        startColHeader = c;
                                        prev = cur;
                                    }
                                    if (cur == "TOTAL" && c == endColOSAByBrand)
                                    {
                                        ws_OSAByBrand.Cells[3, endColOSAByBrand - 2, 4, endColOSAByBrand].Merge = true;
                                        ExcelFormats.FormatCell(ws_OSAByBrand.Cells[3, endColOSAByBrand - 2, 5, endColOSAByBrand], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                                        ws_OSAByBrand.Cells[3, endColOSAByBrand - 2, 5, endColOSAByBrand].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                    }

                                    if (c == startColGroup + 3)
                                    {
                                        var endColGroup = startColGroup + 2;
                                        ws_OSAByBrand.Cells[4, startColGroup, 4, endColGroup].Merge = true;
                                        ExcelFormats.FormatCell(ws_OSAByBrand.Cells[3, startColGroup, 5, endColGroup], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                                        ws_OSAByBrand.Cells[3, startColGroup, 5, endColGroup].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        startColGroup = c;
                                    }

                                    var colPer = Convert.ToString(ws_OSAByBrand.Cells[5, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByBrand.Cells[5, c, ws_OSAByBrand.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                                else
                                {
                                    ws_OSAByBrand.Cells[3, c].Value = key[0];
                                    ws_OSAByBrand.Cells[4, c].Value = key[0];
                                    ws_OSAByBrand.Cells[3, c, 5, c].Merge = true;
                                    var color = "#FFFFFF";

                                    if (key[0].ToUpper() == "STORE NAME")
                                    {
                                        color = "#ffd700";

                                    }
                                    else if (key[0].ToUpper() == "SKU LISTED" || key[0].ToUpper() == "OSA" || key[0].ToUpper() == "% DIFFERENCE")
                                    {
                                        color = "#F39999";
                                    }
                                    ExcelFormats.FormatCell(ws_OSAByBrand.Cells[3, c, 4, c], color, true, ExcelHorizontalAlignment.Center);
                                    ws_OSAByBrand.Cells[3, c, 4, c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                    var colPer = Convert.ToString(ws_OSAByBrand.Cells[5, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByBrand.Cells[6, c, ws_OSAByBrand.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                            }

                            for (int r = 6; r <= endRowOSAByBrand; r++)
                            {
                                var ind = Convert.ToInt32(ws_OSAByBrand.Cells[r, 2].Value);
                                if (ind == 0)
                                {
                                    ws_OSAByBrand.Row(r).Style.Font.Bold = true;
                                }
                            }

                            ws_OSAByBrand.Cells[3, 1, ws_OSAByBrand.Dimension.End.Row, ws_OSAByBrand.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(ws_OSAByBrand, 3, 1, endRowOSAByBrand, endColOSAByBrand);
                            ws_OSAByBrand.DeleteColumn(2);
                            ws_OSAByBrand.Column(1).Width = 30;
                        }

                    }
                    else
                    {
                        return new ResultInfo(500, "No data!", null);
                    }
                    #endregion

                    #region sheet OSA BY CAT
                    await Task.Yield();
                    Task<DataTable> dt_OSAByCate = Task.Run(() => _service.Report_OSA_MRC_OSAByCate(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));

                    if (dt_OSAByCate.Result.Rows.Count > 0)
                    {
                        var ws_OSAByCate = xls.Workbook.Worksheets["OSA BY CAT"];
                        if (ws_OSAByCate != null)
                        {
                            ws_OSAByCate.Cells[1, 1].Value = "OSA BY CAT BY CUSTOMER BY STORE FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_OSAByCate.Cells[1, 1, 1, 6].Merge = true;
                            ws_OSAByCate.Cells[1, 1].Style.Font.Size = 20;

                            var tb_OSAByCate = dt_OSAByCate.Result;

                            ws_OSAByCate.Cells[5, 1].LoadFromDataTable(tb_OSAByCate, true);

                            var endColOSAByCate = ws_OSAByCate.Dimension.End.Column;
                            var endRowOSAByCate = ws_OSAByCate.Dimension.End.Row;

                            //Header
                            var cur = "";
                            var prev = "";
                            var startColHeader = 3;
                            var startColGroup = 3;
                            for (int c = 1; c <= endColOSAByCate; c++)
                            {
                                var key = Convert.ToString(ws_OSAByCate.Cells[5, c].Value).Split("_");
                                if (key.Length == 3)
                                {

                                    ws_OSAByCate.Cells[3, c].Value = key[0];
                                    ws_OSAByCate.Cells[4, c].Value = key[1];
                                    ws_OSAByCate.Cells[5, c].Value = key[2];

                                    if (c == 3) prev = key[0];
                                    cur = key[0];

                                    if (cur != prev)
                                    {
                                        ws_OSAByCate.Cells[3, startColHeader, 3, c - 1].Merge = true;
                                        startColHeader = c;
                                        prev = cur;
                                    }
                                    if (cur == "TOTAL" && c == endColOSAByCate)
                                    {
                                        ws_OSAByCate.Cells[3, endColOSAByCate - 2, 4, endColOSAByCate].Merge = true;
                                        ExcelFormats.FormatCell(ws_OSAByCate.Cells[3, endColOSAByCate - 2, 5, endColOSAByCate], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                                        ws_OSAByCate.Cells[3, endColOSAByCate - 2, 5, endColOSAByCate].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                    }

                                    if (c == startColGroup + 3)
                                    {
                                        var endColGroup = startColGroup + 2;
                                        ws_OSAByCate.Cells[4, startColGroup, 4, endColGroup].Merge = true;
                                        ExcelFormats.FormatCell(ws_OSAByCate.Cells[3, startColGroup, 5, endColGroup], "#66B2FF", true, ExcelHorizontalAlignment.Center);
                                        ws_OSAByCate.Cells[3, startColGroup, 5, endColGroup].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        startColGroup = c;
                                    }

                                    var colPer = Convert.ToString(ws_OSAByCate.Cells[5, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByCate.Cells[5, c, ws_OSAByCate.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                                else
                                {
                                    ws_OSAByCate.Cells[3, c].Value = key[0];
                                    ws_OSAByCate.Cells[4, c].Value = key[0];
                                    ws_OSAByCate.Cells[3, c, 5, c].Merge = true;
                                    var color = "#FFFFFF";

                                    if (key[0].ToUpper() == "STORE NAME")
                                    {
                                        color = "#ffd700";

                                    }
                                    else if (key[0].ToUpper() == "SKU LISTED" || key[0].ToUpper() == "OSA" || key[0].ToUpper() == "% DIFFERENCE")
                                    {
                                        color = "#F39999";
                                    }
                                    ExcelFormats.FormatCell(ws_OSAByCate.Cells[3, c, 4, c], color, true, ExcelHorizontalAlignment.Center);
                                    ws_OSAByCate.Cells[3, c, 4, c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                    var colPer = Convert.ToString(ws_OSAByCate.Cells[5, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_OSAByCate.Cells[6, c, ws_OSAByCate.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                            }

                            for (int r = 6; r <= endRowOSAByCate; r++)
                            {
                                var ind = Convert.ToInt32(ws_OSAByCate.Cells[r, 2].Value);
                                if (ind == 0)
                                {
                                    ws_OSAByCate.Row(r).Style.Font.Bold = true;
                                }
                            }

                            ws_OSAByCate.Cells[3, 1, ws_OSAByCate.Dimension.End.Row, ws_OSAByCate.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(ws_OSAByCate, 3, 1, endRowOSAByCate, endColOSAByCate);
                            ws_OSAByCate.DeleteColumn(2);
                            ws_OSAByCate.Column(1).Width = 30;
                        }

                    }
                    else
                    {
                        return new ResultInfo(500, "No data!", null);
                    }
                    #endregion

                    #region STORE NON OSA
                    var ws_StoreNon = xls.Workbook.Worksheets["STORE NON OSA"];
                    if (ws_StoreNon != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_StoreNon = Task.Run(() => _service.Report_OSA_MRC_StoreNon(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));
                        if (dt_StoreNon.Result.Rows.Count > 0)
                        {
                            ws_StoreNon.Cells[1, 1].Value = "STORE NON OSA FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_StoreNon.Cells[1, 1, 1, 6].Merge = true;
                            ws_StoreNon.Cells[1, 1].Style.Font.Size = 20;

                            var tb_StoreNon = dt_StoreNon.Result;
                            var endColStoreNons = tb_StoreNon.Columns.Count;
                            var endRowStoreNon = tb_StoreNon.Rows.Count + 3;

                            ws_StoreNon.Cells[3, 1].LoadFromDataTable(tb_StoreNon, true);
                            ExcelFormats.FormatCell(ws_StoreNon.Cells[3, 1, 3, endColStoreNons], "#00872B", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_StoreNon, 3, 1, endRowStoreNon, endColStoreNons);

                            ws_StoreNon.Cells[4, 1, ws_StoreNon.Dimension.End.Row, ws_StoreNon.Dimension.End.Column].AutoFitColumns();
                            ws_StoreNon.Column(3).Width = 30;
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }
                    #endregion

                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

        public static async Task<ResultInfo> Report_ATTENDANT_MRC(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Export_Report_ATTENDANT_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_MRC/tmp_export_report_attendant.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {
                    #region SUMMARY PG HC
                    var ws_SumPG = xls.Workbook.Worksheets["SUMMARY PG HC"];
                    if (ws_SumPG != null)
                    {
                        await Task.Yield();
                        Task<DataTable> dt_SumPG = Task.Run(() => _service.Report_ATTENDANT_MRC_SumPG(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));
                        if (dt_SumPG.Result.Rows.Count > 0)
                        {
                            ws_SumPG.Cells[1, 1].Value = "SUMMARY PG's ATTENDANT FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_SumPG.Cells[1, 1, 1, 6].Merge = true;
                            ws_SumPG.Cells[1, 1].Style.Font.Size = 20;

                            var tb_SumPG = dt_SumPG.Result;
                            var endColSumPG = tb_SumPG.Columns.Count;
                            var endRowSumPG = tb_SumPG.Rows.Count + 5;

                            ws_SumPG.Cells[5, 1].LoadFromDataTable(tb_SumPG, true);

                            ExcelFormats.FormatCell(ws_SumPG.Cells[5, 1, 5, endColSumPG], "#87E8F6", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(ws_SumPG, 5, 1, endRowSumPG, endColSumPG);

                            ws_SumPG.Cells[5, 1, ws_SumPG.Dimension.End.Row, ws_SumPG.Dimension.End.Column].AutoFitColumns();

                            var startRow = 6;
                            var endRow = 6;
                            var cur = "";
                            var prev = "";

                            for (int r = 6; r <= ws_SumPG.Dimension.End.Row; r++)
                            {
                                if (r == 6)
                                {
                                    prev = Convert.ToString(ws_SumPG.Cells[r, 1].Value);
                                }
                                cur = Convert.ToString(ws_SumPG.Cells[r, 1].Value);

                                if (cur != prev || r == ws_SumPG.Dimension.End.Row)
                                {
                                    endRow = r - 1;
                                    if (r == ws_SumPG.Dimension.End.Row) endRow = r;
                                    if (endRow >= startRow)
                                    {
                                        ws_SumPG.Cells[startRow, 1, endRow, 1].Merge = true;
                                        ws_SumPG.Cells[startRow, 1, endRow, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        prev = cur;
                                        startRow = r;
                                        endRow = r;
                                    }

                                }

                                var des = Convert.ToString(ws_SumPG.Cells[r, 3].Value);
                                if (des.ToUpper() == "WP-SENT BY SUP")
                                {
                                    var colStartDate = ws_SumPG.Cells[r, 4].Address;
                                    var colEndDate = ws_SumPG.Cells[r, ws_SumPG.Dimension.End.Column - 1].Address;

                                    ExcelFormats.FormatCell(ws_SumPG.Cells[r, 3, r, ws_SumPG.Dimension.End.Column], "#DDDDDD", true, ExcelHorizontalAlignment.Right);
                                    ws_SumPG.Cells[r, ws_SumPG.Dimension.End.Column].Formula = string.Format("=SUM({0}:{1})", colStartDate, colEndDate);
                                }
                                else if (des.ToUpper() == "TOTAL PG HC")
                                {
                                    for (int c = 4; c <= ws_SumPG.Dimension.End.Column - 1; c++)
                                    {
                                        var colStart = ws_SumPG.Cells[r - 5, c].Address;
                                        var colEnd = ws_SumPG.Cells[r - 1, c].Address;
                                        ws_SumPG.Cells[r, c].Formula = string.Format("=SUM({0}:{1})", colStart, colEnd);
                                    }

                                    ExcelFormats.FormatCell(ws_SumPG.Cells[r, 3, r, ws_SumPG.Dimension.End.Column], "#F6E20E", true, ExcelHorizontalAlignment.Right);
                                }
                                else if (des.ToUpper() == "% ACT VS WP")
                                {
                                    for (int c = 4; c <= ws_SumPG.Dimension.End.Column - 1; c++)
                                    {
                                        var colStart = ws_SumPG.Cells[r - 7, c].Address;
                                        var colEnd = ws_SumPG.Cells[r - 6, c].Address;
                                        ws_SumPG.Cells[r, c].Formula = string.Format("=IFERROR({0}/{1},0)", colEnd, colStart);
                                    }

                                    ExcelFormats.FormatCell(ws_SumPG.Cells[r, 3, r, ws_SumPG.Dimension.End.Column], "#6EB812", true, ExcelHorizontalAlignment.Right);
                                    ws_SumPG.Cells[r, 3, r, ws_SumPG.Dimension.End.Column].Style.Numberformat.Format = "0%";
                                }
                                else if (des.ToUpper() == "% ACT VS TOTAL PG")
                                {
                                    for (int c = 4; c <= ws_SumPG.Dimension.End.Column - 1; c++)
                                    {
                                        var colStart = ws_SumPG.Cells[r - 7, c].Address;
                                        var colEnd = ws_SumPG.Cells[r - 2, c].Address;
                                        ws_SumPG.Cells[r, c].Formula = string.Format("=IFERROR({0}/{1},0)", colEnd, colStart);
                                    }

                                    ExcelFormats.FormatCell(ws_SumPG.Cells[r, 3, r, ws_SumPG.Dimension.End.Column], "#00B01E", true, ExcelHorizontalAlignment.Right);
                                    ws_SumPG.Cells[r, 3, r, ws_SumPG.Dimension.End.Column].Style.Numberformat.Format = "0%";
                                }
                                ws_SumPG.Cells[6, 3, ws_SumPG.Dimension.End.Row, 3].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                                ws_SumPG.Row(5).Height = 35;
                            }
                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }
                    #endregion

                    #region PG ATTENDANT BY CUSTOMER
                    Task<DataTable> dt_ByCus = Task.Run(() => _service.Report_ATTENDANT_MRC_ByCus(AccountId, UserId, dataJson.SupId, dataJson.Province, dataJson.ChannelId, dataJson.CustomerId, dataJson.ShopCode, null, dataJson.Position, null, dataJson.fromdate, dataJson.todate));

                    if (dt_ByCus.Result.Rows.Count > 0)
                    {
                        var ws_ByCus = xls.Workbook.Worksheets["PG ATTENDANT BY CUSTOMER"];
                        if (ws_ByCus != null)
                        {
                            ws_ByCus.Cells[1, 1].Value = "SUMMARY PG ATTENDANT BY CUSTOMER FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_ByCus.Cells[1, 1, 1, 6].Merge = true;
                            ws_ByCus.Cells[1, 1].Style.Font.Size = 20;

                            var tb_ByCus = dt_ByCus.Result;


                            ws_ByCus.Cells[6, 1].LoadFromDataTable(tb_ByCus, true);

                            var endColByCus = ws_ByCus.Dimension.End.Column;
                            var endRowByCus = ws_ByCus.Dimension.End.Row;

                            //Header
                            var cur = "";
                            var prev = "";
                            var startColHeader = 2;
                            var startColGroup = 2;
                            for (int c = 1; c <= endColByCus; c++)
                            {
                                var key = Convert.ToString(ws_ByCus.Cells[6, c].Value).Split("_");
                                if (key.Length == 3)
                                {

                                    ws_ByCus.Cells[4, c].Value = key[0];
                                    ws_ByCus.Cells[5, c].Value = key[1];
                                    ws_ByCus.Cells[6, c].Value = key[2];

                                    if (c == startColGroup + 3 || c == endColByCus)
                                    {
                                        var endColGroup = startColGroup + 2;
                                        ws_ByCus.Cells[4, startColGroup, 4, endColGroup].Merge = true;
                                        ws_ByCus.Cells[5, startColGroup, 5, endColGroup].Merge = true;
                                        ExcelFormats.FormatCell(ws_ByCus.Cells[4, startColGroup, 6, endColGroup], "#87E8F6", true, ExcelHorizontalAlignment.Center);
                                        ws_ByCus.Cells[4, startColGroup, 6, endColGroup].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        startColGroup = c;
                                    }

                                    var colPer = Convert.ToString(ws_ByCus.Cells[6, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_ByCus.Cells[7, c, ws_ByCus.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                                else
                                {
                                    ws_ByCus.Cells[4, c].Value = key[0];
                                    ws_ByCus.Cells[5, c].Value = key[0];
                                    ws_ByCus.Cells[4, c, 6, c].Merge = true;

                                    ExcelFormats.FormatCell(ws_ByCus.Cells[4, c, 6, c], "#87E8F6", true, ExcelHorizontalAlignment.Center);
                                    ws_ByCus.Cells[4, c, 6, c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                }
                            }

                            ws_ByCus.Cells[3, 1, ws_ByCus.Dimension.End.Row, ws_ByCus.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(ws_ByCus, 4, 1, endRowByCus, endColByCus);
                            ws_ByCus.Column(1).Width = 30;
                        }

                    }
                    else
                    {
                        return new ResultInfo(500, "No data!", null);
                    }
                    #endregion

                    #region PG WP VS ACT BY LOCATION
                    Task<DataTable> dt_ByLoca = Task.Run(() => _service.Report_ATTENDANT_MRC_ByLoca(dataJson.fromdate, dataJson.todate));

                    if (dt_ByLoca.Result.Rows.Count > 0)
                    {
                        var ws_ByLoca = xls.Workbook.Worksheets["PG WP VS ACT BY LOCATION"];
                        if (ws_ByLoca != null)
                        {
                            ws_ByLoca.Cells[1, 1].Value = "PG WP VS ACT  MTD FROM " + dataJson.fromdate + " TO " + dataJson.todate;
                            ws_ByLoca.Cells[1, 1, 1, 6].Merge = true;
                            ws_ByLoca.Cells[1, 1].Style.Font.Size = 20;

                            var tb_ByLoca = dt_ByLoca.Result;

                            ws_ByLoca.Cells[5, 1].LoadFromDataTable(tb_ByLoca, true);

                            var endColByCus = ws_ByLoca.Dimension.End.Column;
                            var endRowByCus = ws_ByLoca.Dimension.End.Row;

                            //Header
                            var cur = "";
                            var prev = "";
                            var startColHeader = 14;
                            var startColGroup = 14;
                            string[] listCol = { "#55D978", "#FAE1E1" };
                            bool flag = false;
                            for (int c = 1; c <= endColByCus; c++)
                            {
                                var key = Convert.ToString(ws_ByLoca.Cells[5, c].Value).Split("_");
                                if (key.Length == 3)
                                {

                                    ws_ByLoca.Cells[3, c].Value = key[0];
                                    ws_ByLoca.Cells[4, c].Value = key[1];
                                    ws_ByLoca.Cells[5, c].Value = key[2];

                                    if (c == startColGroup + 3 || c == endColByCus)
                                    {
                                        var endColGroup = startColGroup + 3;
                                        ws_ByLoca.Cells[3, startColGroup, 3, endColGroup].Merge = true;
                                        ws_ByLoca.Cells[4, startColGroup, 4, endColGroup].Merge = true;
                                        ExcelFormats.FormatCell(ws_ByLoca.Cells[3, startColGroup, 5, endColGroup], flag ? "#55D978" : "#FAE1E1", true, ExcelHorizontalAlignment.Center);
                                        ws_ByLoca.Cells[4, startColGroup, 6, endColGroup].Style.VerticalAlignment = ExcelVerticalAlignment.Center;

                                        flag = flag ? false : true;
                                        startColGroup = c + 1;
                                    }

                                    var colPer = Convert.ToString(ws_ByLoca.Cells[6, c].Value);
                                    if (colPer.Contains("%"))
                                    {
                                        ws_ByLoca.Cells[7, c, ws_ByLoca.Dimension.End.Row, c].Style.Numberformat.Format = "0%";
                                    }
                                }
                                else
                                {
                                    ws_ByLoca.Cells[3, c].Value = key[0];
                                    ws_ByLoca.Cells[4, c].Value = key[0];
                                    ws_ByLoca.Cells[3, c, 5, c].Merge = true;

                                    ExcelFormats.FormatCell(ws_ByLoca.Cells[3, c, 5, c], "#00008B", true, ExcelHorizontalAlignment.Center);
                                    ws_ByLoca.Cells[3, c, 5, c].Style.Font.Color.SetColor(color: System.Drawing.Color.White);
                                    ws_ByLoca.Cells[3, c, 5, c].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                                }
                            }

                            ws_ByLoca.Cells[3, 1, ws_ByLoca.Dimension.End.Row, ws_ByLoca.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(ws_ByLoca, 3, 1, endRowByCus, endColByCus);
                            ws_ByLoca.Column(8).Width = 30;
                        }

                    }
                    else
                    {
                        return new ResultInfo(500, "No data!", null);
                    }
                    #endregion

                    xls.Save();
                    return new ResultInfo(200, "Successfull", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }
        public static async Task<ResultInfo> Report_Promotion(int AccountId, int UserId, string JsonData, IReportService _service, IWebHostEnvironment _hostingEnvironment, HostString Host, string Scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Export_Report_Promotion_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_MRC/tmp_Promotion.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var xls = new ExcelPackage(file))
                {

                    var wsRaw = xls.Workbook.Worksheets["Rawdata"];
                    if (wsRaw != null)
                    {
                        DataTable dt = Task.Run(() => _service.Promotion_Raw(AccountId, UserId, JsonData)).Result;
                        if (dt.Rows.Count > 0)
                        {
                            wsRaw.Cells[2, 5].Value = "Từ ngày: " + dataJson.fromdate + " - Đến ngày: " + dataJson.todate;
                            wsRaw.Cells[5, 1].LoadFromDataTable(dt, false);
                            ExcelFormats.Border(wsRaw, 5, 1, wsRaw.Dimension.Rows, wsRaw.Dimension.Columns);

                        }
                        else
                        {
                            return new ResultInfo(500, "No data!", null);
                        }
                    }
                    var wsSUM = xls.Workbook.Worksheets["SUM"];
                    if (wsSUM != null)
                    {
                        DataTable dt = Task.Run(() => _service.Promotion_Summary(AccountId, UserId, JsonData)).Result;
                        if (dt.Rows.Count > 0)
                        {
                            wsSUM.Cells[2, 1].LoadFromDataTable(dt, false);
                            string division = "", brand = "", category = "";

                            string[] colorBigC = new string[] { "#C6E0B4", "#A9D08E", "#548235" };
                            string[] colorCOOP = new string[] { "#BDD7EE", "#9BC2E6", "#2F75B5" };
                            string[] colorOther = new string[] { "#F8CBAD", "#F4B084", "#C65911" };
                            int rowStart = 2, rowStartAccount = 2, rowStartDivision = 2, rowStartBrand = 2;
                            for (int row = 3; row < wsSUM.Dimension.Rows + 1; row++)
                            {
                                string[] color = colorOther;
                                string account = Convert.ToString(wsSUM.Cells[row, 1].Value);
                                if (account == "BIG C") color = colorBigC;
                                else if (account == "COOP") color = colorCOOP;

                                division = Convert.ToString(wsSUM.Cells[row, 6].Value);
                                brand = Convert.ToString(wsSUM.Cells[row, 7].Value);
                                category = Convert.ToString(wsSUM.Cells[row, 8].Value);
                                if (category.Contains("Total"))
                                {
                                    if (brand != "z")
                                    {
                                        wsSUM.Cells[rowStartBrand, 7, row - 1, 7].Merge = true;
                                        wsSUM.Cells[row, 7, row, 8].Merge = true;
                                        wsSUM.Cells[row, 7].Value = category;
                                        ExcelFormats.FormatCell(wsSUM.Cells[row, 7, row, wsSUM.Dimension.Columns], color[0], true, ExcelHorizontalAlignment.Left);
                                        rowStartBrand = row + 1;
                                    }
                                    else if (brand == "z" && division != "Total")
                                    {
                                        wsSUM.Cells[rowStartDivision, 6, row - 1, 6].Merge = true;
                                        wsSUM.Cells[row, 6, row, 8].Merge = true;
                                        wsSUM.Cells[row, 6].Value = "TOTAL " + division;
                                        ExcelFormats.FormatCell(wsSUM.Cells[row, 6, row, wsSUM.Dimension.Columns], color[1], true, ExcelHorizontalAlignment.Left);
                                        rowStartDivision = row + 1;
                                        rowStartBrand = row + 1;
                                    }
                                    else if (division == "Total")
                                    {
                                        wsSUM.Cells[rowStartAccount, 1, row - 1, 1].Merge = true;
                                        wsSUM.Cells[rowStartAccount, 2, row - 1, 2].Merge = true;
                                        wsSUM.Cells[rowStartAccount, 3, row - 1, 3].Merge = true;
                                        wsSUM.Cells[rowStartAccount, 4, row - 1, 4].Merge = true;
                                        wsSUM.Cells[rowStartAccount, 5, row - 1, 5].Merge = true;
                                        wsSUM.Cells[row, 1, row, 8].Merge = true;
                                        wsSUM.Cells[row, 1].Value = "TOTAL " + account;
                                        ExcelFormats.FormatCell(wsSUM.Cells[row, 1, row, wsSUM.Dimension.Columns], color[2], true, ExcelHorizontalAlignment.Left);
                                        wsSUM.Row(row).Style.Font.Color.SetColor(ExcelIndexedColor.Indexed1);
                                        rowStartAccount = row + 1;
                                        rowStartDivision = row + 1;
                                        rowStartBrand = row + 1;
                                    }
                                }
                            }

                        }
                        wsSUM.Columns[6, 8].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        wsSUM.Columns[6, 8].Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        wsSUM.Columns[9, 13].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        wsSUM.Columns[9, 13].Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        ExcelFormats.Border(wsSUM, 1, 1, wsSUM.Dimension.Rows, wsSUM.Dimension.Columns);
                    }
                    DataSet ds = Task.Run(() => _service.Promotion_ByCustomer(AccountId, UserId, JsonData)).Result;
                    if (ds.Tables.Count > 3)
                    {
                        DataView dataView = ds.Tables[0].DefaultView;
                        //dataView.Sort = "RNum"; 
                        DataTable promotionList = dataView.ToTable();

                        int colStart = 15, colStartDivision = 15, colStartBrand = 15, colStartCate = 15;
                        DataTable dt = ds.Tables[1];
                        var wsBigC = xls.Workbook.Worksheets["Summary BigC"];
                        if (wsBigC != null)
                        {
                            wsBigC.Cells[1, 2].Value = "PROMOTION REPORT FROM: " + dataJson.fromdate + " - TO: " + dataJson.todate;
                            wsBigC.Cells[7, 1].LoadFromDataTable(dt, false);
                            wsBigC.DeleteColumn(1);

                            string[] colorGroup = new string[] { "#B4C6E7", "#FFE699" };
                            int indColorGroup = 0;
                            string[] colorCate = new string[] { "#D9E1F2", "#ED7D31" };
                            int indColorCate = 0;
                            string[] colorBrand = new string[] { "#A9D08E", "#8EA9DB" };
                            int indColorBrand = 0;
                            string[] colorDivision = new string[] { "#FFFF00", "#F4B084", "#FFE699", "#6699FF" };
                            int indColorDivision = 0;

                            foreach (DataRow dr in promotionList.Rows)
                            {
                                string promotion = Convert.ToString(dr["ColName"]);
                                string[] key = promotion.Split('_');
                                if (key.Length == 5)
                                {
                                    wsBigC.Cells[2, colStart].Value = key[0];
                                    wsBigC.Cells[3, colStart].Value = key[1];
                                    wsBigC.Cells[4, colStart].Value = key[2];
                                    wsBigC.Cells[5, colStart].Value = key[3];
                                    wsBigC.Cells[6, colStart].Value = key[4];

                                    switch (key[4])
                                    {
                                        case "Visibility":

                                            ExcelFormats.FormatCell(wsBigC.Cells[5, colStart - 2, 5, colStart], colorGroup[indColorGroup % 2], false, ExcelHorizontalAlignment.Center);
                                            indColorGroup++;
                                            wsBigC.Cells[5, colStart - 2, 5, colStart].Merge = true;
                                            ExcelFormats.FormatCell(wsBigC.Cells[6, colStart], "#A9D08E", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        case "Target":
                                            ExcelFormats.FormatCell(wsBigC.Cells[6, colStart], "#D9E1F2", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        case "Actual":
                                            ExcelFormats.FormatCell(wsBigC.Cells[6, colStart], "#F4B084", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else if (key.Length == 3)
                                {
                                    wsBigC.Cells[2, colStart].Value = key[0];
                                    wsBigC.Cells[3, colStart].Value = key[1];
                                    wsBigC.Cells[4, colStart, 6, colStart].Merge = true;
                                    wsBigC.Cells[4, colStart].Value = key[2];
                                    ExcelFormats.FormatCell(wsBigC.Cells[4, colStart], "#FFFF00", false, ExcelHorizontalAlignment.Center);
                                    if (key[2] == "ACTUAL/TARGET (%)")
                                    {
                                        wsBigC.Cells[3, colStartBrand, 3, colStart + 1].Merge = true;
                                        ExcelFormats.FormatCell(wsBigC.Cells[3, colStartBrand, 3, colStart + 1], colorBrand[indColorBrand % 2], false, ExcelHorizontalAlignment.Center);
                                        colStartBrand = colStart + 2;
                                        indColorBrand++;
                                    }
                                }
                                colStart++;
                            }
                            ///     merge division
                            colStart = 15; colStartDivision = 15; colStartCate = 15;
                            string division = Convert.ToString(wsBigC.Cells[2, colStart].Value);
                            for (int col = colStart + 1; col < wsBigC.Dimension.Columns + 2; col++)
                            {
                                if (division != Convert.ToString(wsBigC.Cells[2, col].Value))
                                {
                                    wsBigC.Cells[2, colStartDivision, 2, col - 1].Merge = true;
                                    ExcelFormats.FormatCell(wsBigC.Cells[2, colStartDivision], colorDivision[indColorDivision], false, ExcelHorizontalAlignment.Center);
                                    colStartDivision = col;
                                    indColorDivision++;
                                    division = Convert.ToString(wsBigC.Cells[2, col].Value);
                                }
                            }
                            string category = Convert.ToString(wsBigC.Cells[4, colStart].Value);
                            for (int col = colStart + 1; col < wsBigC.Dimension.Columns + 2; col++)
                            {
                                if (Convert.ToString(wsBigC.Cells[4, col].Value) == "VISIBILITY/ACTUAL (%)")
                                {
                                    wsBigC.Columns[col - 1, col].Style.Numberformat.Format = "0%";
                                    colStartCate = col + 1;
                                    category = Convert.ToString(wsBigC.Cells[4, col + 1].Value);
                                }
                                else if (category != Convert.ToString(wsBigC.Cells[4, col].Value))
                                {
                                    wsBigC.Cells[4, colStartCate, 4, col - 1].Merge = true;
                                    ExcelFormats.FormatCell(wsBigC.Cells[4, colStartCate], colorCate[indColorCate % 2], false, ExcelHorizontalAlignment.Center);
                                    colStartCate = col;
                                    indColorCate++;
                                    category = Convert.ToString(wsBigC.Cells[4, col].Value);
                                }
                            }
                            ExcelFormats.Border(wsBigC, 2, 1, wsBigC.Dimension.Rows, wsBigC.Dimension.Columns);
                        }

                        colStart = 15; colStartDivision = 15; colStartBrand = 15; colStartCate = 15;
                        dt = ds.Tables[2];
                        var wsCOOP = xls.Workbook.Worksheets["Summary COOP"];
                        if (wsCOOP != null)
                        {
                            wsCOOP.Cells[1, 2].Value = "PROMOTION REPORT FROM: " + dataJson.fromdate + " - TO: " + dataJson.todate;
                            wsCOOP.Cells[7, 1].LoadFromDataTable(dt, false);
                            wsCOOP.DeleteColumn(1);

                            string[] colorGroup = new string[] { "#B4C6E7", "#FFE699" };
                            int indColorGroup = 0;
                            string[] colorCate = new string[] { "#D9E1F2", "#ED7D31" };
                            int indColorCate = 0;
                            string[] colorBrand = new string[] { "#A9D08E", "#8EA9DB" };
                            int indColorBrand = 0;
                            string[] colorDivision = new string[] { "#FFFF00", "#F4B084", "#FFE699", "#6699FF" };
                            int indColorDivision = 0;

                            foreach (DataRow dr in promotionList.Rows)
                            {
                                string promotion = Convert.ToString(dr["ColName"]);
                                string[] key = promotion.Split('_');
                                if (key.Length == 5)
                                {
                                    wsCOOP.Cells[2, colStart].Value = key[0];
                                    wsCOOP.Cells[3, colStart].Value = key[1];
                                    wsCOOP.Cells[4, colStart].Value = key[2];
                                    wsCOOP.Cells[5, colStart].Value = key[3];
                                    wsCOOP.Cells[6, colStart].Value = key[4];

                                    switch (key[4])
                                    {
                                        case "Visibility":

                                            ExcelFormats.FormatCell(wsCOOP.Cells[5, colStart - 2, 5, colStart], colorGroup[indColorGroup % 2], false, ExcelHorizontalAlignment.Center);
                                            indColorGroup++;
                                            wsCOOP.Cells[5, colStart - 2, 5, colStart].Merge = true;
                                            ExcelFormats.FormatCell(wsCOOP.Cells[6, colStart], "#A9D08E", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        case "Target":
                                            ExcelFormats.FormatCell(wsCOOP.Cells[6, colStart], "#D9E1F2", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        case "Actual":
                                            ExcelFormats.FormatCell(wsCOOP.Cells[6, colStart], "#F4B084", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else if (key.Length == 3)
                                {
                                    wsCOOP.Cells[2, colStart].Value = key[0];
                                    wsCOOP.Cells[3, colStart].Value = key[1];
                                    wsCOOP.Cells[4, colStart, 6, colStart].Merge = true;
                                    wsCOOP.Cells[4, colStart].Value = key[2];
                                    ExcelFormats.FormatCell(wsCOOP.Cells[4, colStart], "#FFFF00", false, ExcelHorizontalAlignment.Center);
                                    if (key[2] == "ACTUAL/TARGET (%)")
                                    {
                                        wsCOOP.Cells[3, colStartBrand, 3, colStart + 1].Merge = true;
                                        ExcelFormats.FormatCell(wsCOOP.Cells[3, colStartBrand, 3, colStart + 1], colorBrand[indColorBrand % 2], false, ExcelHorizontalAlignment.Center);
                                        colStartBrand = colStart + 2;
                                        indColorBrand++;
                                    }
                                }
                                colStart++;
                            }
                            ///     merge division
                            colStart = 15; colStartDivision = 15; colStartCate = 15;
                            string division = Convert.ToString(wsCOOP.Cells[2, colStart].Value);
                            for (int col = colStart + 1; col < wsCOOP.Dimension.Columns + 2; col++)
                            {
                                if (division != Convert.ToString(wsCOOP.Cells[2, col].Value))
                                {
                                    wsCOOP.Cells[2, colStartDivision, 2, col - 1].Merge = true;
                                    ExcelFormats.FormatCell(wsCOOP.Cells[2, colStartDivision], colorDivision[indColorDivision], false, ExcelHorizontalAlignment.Center);
                                    colStartDivision = col;
                                    indColorDivision++;
                                    division = Convert.ToString(wsCOOP.Cells[2, col].Value);
                                }
                            }
                            string category = Convert.ToString(wsCOOP.Cells[4, colStart].Value);
                            for (int col = colStart + 1; col < wsCOOP.Dimension.Columns + 2; col++)
                            {
                                if (Convert.ToString(wsCOOP.Cells[4, col].Value) == "VISIBILITY/ACTUAL (%)")
                                {
                                    wsCOOP.Columns[col - 1, col].Style.Numberformat.Format = "0%";
                                    colStartCate = col + 1;
                                    category = Convert.ToString(wsCOOP.Cells[4, col + 1].Value);
                                }
                                else if (category != Convert.ToString(wsCOOP.Cells[4, col].Value))
                                {
                                    wsCOOP.Cells[4, colStartCate, 4, col - 1].Merge = true;
                                    ExcelFormats.FormatCell(wsCOOP.Cells[4, colStartCate], colorCate[indColorCate % 2], false, ExcelHorizontalAlignment.Center);
                                    colStartCate = col;
                                    indColorCate++;
                                    category = Convert.ToString(wsCOOP.Cells[4, col].Value);
                                }
                            }
                            ExcelFormats.Border(wsCOOP, 2, 1, wsCOOP.Dimension.Rows, wsCOOP.Dimension.Columns);
                        }

                        colStart = 15; colStartDivision = 15; colStartBrand = 15; colStartCate = 15;
                        dt = ds.Tables[3];
                        var wsOther = xls.Workbook.Worksheets["Summary Other"];
                        if (wsOther != null)
                        {
                            wsOther.Cells[1, 2].Value = "PROMOTION REPORT FROM: " + dataJson.fromdate + " - TO: " + dataJson.todate;
                            wsOther.Cells[7, 1].LoadFromDataTable(dt, false);
                            wsOther.DeleteColumn(1);

                            string[] colorGroup = new string[] { "#B4C6E7", "#FFE699" };
                            int indColorGroup = 0;
                            string[] colorCate = new string[] { "#D9E1F2", "#ED7D31" };
                            int indColorCate = 0;
                            string[] colorBrand = new string[] { "#A9D08E", "#8EA9DB" };
                            int indColorBrand = 0;
                            string[] colorDivision = new string[] { "#FFFF00", "#F4B084", "#FFE699", "#6699FF" };
                            int indColorDivision = 0;

                            foreach (DataRow dr in promotionList.Rows)
                            {
                                string promotion = Convert.ToString(dr["ColName"]);
                                string[] key = promotion.Split('_');
                                if (key.Length == 5)
                                {
                                    wsOther.Cells[2, colStart].Value = key[0];
                                    wsOther.Cells[3, colStart].Value = key[1];
                                    wsOther.Cells[4, colStart].Value = key[2];
                                    wsOther.Cells[5, colStart].Value = key[3];
                                    wsOther.Cells[6, colStart].Value = key[4];

                                    switch (key[4])
                                    {
                                        case "Visibility":

                                            ExcelFormats.FormatCell(wsOther.Cells[5, colStart - 2, 5, colStart], colorGroup[indColorGroup % 2], false, ExcelHorizontalAlignment.Center);
                                            indColorGroup++;
                                            wsOther.Cells[5, colStart - 2, 5, colStart].Merge = true;
                                            ExcelFormats.FormatCell(wsOther.Cells[6, colStart], "#A9D08E", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        case "Target":
                                            ExcelFormats.FormatCell(wsOther.Cells[6, colStart], "#D9E1F2", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        case "Actual":
                                            ExcelFormats.FormatCell(wsOther.Cells[6, colStart], "#F4B084", false, ExcelHorizontalAlignment.Center);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else if (key.Length == 3)
                                {
                                    wsOther.Cells[2, colStart].Value = key[0];
                                    wsOther.Cells[3, colStart].Value = key[1];
                                    wsOther.Cells[4, colStart, 6, colStart].Merge = true;
                                    wsOther.Cells[4, colStart].Value = key[2];
                                    ExcelFormats.FormatCell(wsOther.Cells[4, colStart], "#FFFF00", false, ExcelHorizontalAlignment.Center);
                                    if (key[2] == "ACTUAL/TARGET (%)")
                                    {
                                        wsOther.Cells[3, colStartBrand, 3, colStart + 1].Merge = true;
                                        ExcelFormats.FormatCell(wsOther.Cells[3, colStartBrand, 3, colStart + 1], colorBrand[indColorBrand % 2], false, ExcelHorizontalAlignment.Center);
                                        colStartBrand = colStart + 2;
                                        indColorBrand++;
                                    }
                                }
                                colStart++;
                            }
                            ///     merge division
                            colStart = 15; colStartDivision = 15; colStartCate = 15;
                            string division = Convert.ToString(wsOther.Cells[2, colStart].Value);
                            for (int col = colStart + 1; col < wsOther.Dimension.Columns + 2; col++)
                            {
                                if (division != Convert.ToString(wsOther.Cells[2, col].Value))
                                {
                                    wsOther.Cells[2, colStartDivision, 2, col - 1].Merge = true;
                                    ExcelFormats.FormatCell(wsOther.Cells[2, colStartDivision], colorDivision[indColorDivision], false, ExcelHorizontalAlignment.Center);
                                    colStartDivision = col;
                                    indColorDivision++;
                                    division = Convert.ToString(wsOther.Cells[2, col].Value);
                                }
                            }
                            string category = Convert.ToString(wsOther.Cells[4, colStart].Value);
                            for (int col = colStart + 1; col < wsOther.Dimension.Columns + 2; col++)
                            {
                                if (Convert.ToString(wsOther.Cells[4, col].Value) == "VISIBILITY/ACTUAL (%)")
                                {
                                    wsOther.Columns[col - 1, col].Style.Numberformat.Format = "0%";
                                    colStartCate = col + 1;
                                    category = Convert.ToString(wsOther.Cells[4, col + 1].Value);
                                }
                                else if (category != Convert.ToString(wsOther.Cells[4, col].Value))
                                {
                                    wsOther.Cells[4, colStartCate, 4, col - 1].Merge = true;
                                    ExcelFormats.FormatCell(wsOther.Cells[4, colStartCate], colorCate[indColorCate % 2], false, ExcelHorizontalAlignment.Center);
                                    colStartCate = col;
                                    indColorCate++;
                                    category = Convert.ToString(wsOther.Cells[4, col].Value);
                                }
                            }
                            ExcelFormats.Border(wsOther, 2, 1, wsOther.Dimension.Rows, wsOther.Dimension.Columns);
                        }
                    }


                    xls.Save();
                    return new ResultInfo(200, "Successful", string.Format("{0}://{1}/{2}/{3}", Scheme, Host, subfoler, fileName));
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }

    }
}
