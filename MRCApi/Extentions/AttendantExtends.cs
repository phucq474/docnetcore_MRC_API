using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.Identity.Client.SSHCertificates;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Packaging.Ionic.Zip;
using OfficeOpenXml.Style;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class AttendantExtends
    {
        public static async Task<ResultInfo> Report_Attendant_RawData(int accountId, int userId, string jsonData, IAttendantService service, IWebHostEnvironment _webHostEnvironment, HostString host, string scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/Attendant";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Attendant Rawdata_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo file = new FileInfo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => service.Report_Attendant_RawData(userId, jsonData, accountId)))
                {
                    if (data.Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Rawdata");
                            sheet.Cells[1, 1].Value = "ATTENDANT RAWDATA";
                            sheet.Cells[1, 1].Style.Font.Size = 20;
                            sheet.Cells[1, 1].Style.Font.Bold = true;
                            sheet.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                            sheet.Cells[1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                            sheet.Row(1).Height = 38;
                            sheet.Cells[1, 1, 1, 5].Merge = true;
                            ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 5], "#0070C0", true, ExcelHorizontalAlignment.Center);

                            sheet.Cells[2, 1].Value = "From:";
                            sheet.Cells[2, 2].Value = dataJson.fromdate;
                            sheet.Cells[3, 1].Value = "To:";
                            sheet.Cells[3, 2].Value = dataJson.todate;

                            sheet.Cells[4, 1].LoadFromDataTable(data, true);

                            ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, sheet.Dimension.End.Column], "#9BC2E6", true, ExcelHorizontalAlignment.Center);

                            for (int r = 5; r <= sheet.Dimension.End.Row; r++)
                            {
                                for (int c = 15; c <= sheet.Dimension.End.Column; c++)
                                {
                                    if (c <= 20)
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
                                    else if (c > 22)
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
                            sheet.Column(7).Width = 30;
                            sheet.Column(8).Width = 30;



                            #region AttendantTotal
                            DataTable dt_total = Task.Run(() => service.Timesheet_Export_Total(accountId, userId, jsonData)).Result;
                            var sheet_total = pk.Workbook.Worksheets.Add("Attendant Total");
                            sheet_total.Cells[1, 1].Value = "ATTENDANT TOTAL";
                            sheet_total.Cells[1, 1].Style.Font.Size = 18;
                            sheet_total.Cells[1, 1, 1, 8].Merge = true;

                            sheet_total.Cells[2, 1].Value = "From:";
                            sheet_total.Cells[2, 2].Value = dataJson.fromdate;
                            sheet_total.Cells[2, 3].Value = "To:";
                            sheet_total.Cells[2, 4].Value = dataJson.todate;

                            sheet_total.Row(1).Height = 35;
                            sheet_total.Row(3).Height = 35;
                            ExcelFormats.FormatCell(sheet_total.Cells[1, 1, 1, 8], "#E2EFDA", true, ExcelHorizontalAlignment.Center);

                            sheet_total.Cells[3, 1].LoadFromDataTable(dt_total, true);
                            ExcelFormats.FormatCell(sheet_total.Cells[3, 1, 3, sheet_total.Dimension.End.Column], "#00872B", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet_total, 3, 1, sheet_total.Dimension.End.Row, sheet_total.Dimension.End.Column);
                            sheet_total.Cells[3, 1, sheet_total.Dimension.End.Row, sheet_total.Dimension.End.Column].AutoFitColumns();
                            #endregion

                            pk.Save();
                        }
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", scheme, host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
                    }

                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public static async Task<ResultInfo> Timesheet_Export(int accountId, int userId, string jsonData, ITimesheetService _service, IWebHostEnvironment hostingEnvironment, HostString host, string scheme, ICalendarService _calendarService, IAttendantService _attendantService)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);
            string folder = hostingEnvironment.WebRootPath;
            string subfoler = "export/" + accountId.ToString() + "/Attendant";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = "Attendant_Report_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".xlsx";
            string fileExport = Path.Combine(folder, subfoler, fileName);
            FileInfo file = new FileInfo(fileExport);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var pk = new ExcelPackage(file))
            {
                try
                {

                    #region TimeSheet 
                    List<CalendarEntity> lisCalendar = _calendarService.GetList(null, null, null);
                    DataTable dtAtt = await Task.Run(() => _service.Timesheet_Export(accountId, userId, jsonData));
                    if (dtAtt.Rows.Count > 0)
                    {
                        var sheet_wsAtt = pk.Workbook.Worksheets.Add("Attendant");

                        sheet_wsAtt.Cells[1, 1].Value = "ATTENDANT REPORT";
                        sheet_wsAtt.Cells[1, 1].Style.Font.Size = 20;
                        sheet_wsAtt.Cells[1, 1].Style.Font.Bold = true;
                        sheet_wsAtt.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                        sheet_wsAtt.Cells[1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet_wsAtt.Row(1).Height = 38;
                        sheet_wsAtt.Cells[1, 1, 1, 5].Merge = true;
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[1, 1, 1, 5], "#0070C0", true, ExcelHorizontalAlignment.Center);

                        sheet_wsAtt.Cells[2, 1].Value = "From:";
                        sheet_wsAtt.Cells[2, 2].Value = dataJson.fromdate;
                        sheet_wsAtt.Cells[3, 1].Value = "To:";
                        sheet_wsAtt.Cells[3, 2].Value = dataJson.todate;

                        sheet_wsAtt.Cells[6, 1].LoadFromDataTable(dtAtt, true);

                        if (dataJson.accountName == "Fonterra")
                        {
                            int start_1 = 1;
                            int end_1 = 1;
                            int start_2 = 1;
                            int end_2 = 1;
                            int start_3 = 1;
                            int end_3 = 1;
                            int start_4 = 1;
                            int end_4 = 1;
                            int start_5 = 1;
                            int end_5 = 1;
                            int start_6 = 1;
                            int end_6 = 1;
                            int start_7 = 1;
                            int end_7 = 1;

                            #region header
                            for (int c = 1; c <= dtAtt.Columns.Count; c++)
                            {
                                string header = Convert.ToString(sheet_wsAtt.Cells[6, c].Value);
                                string[] key = header.Split("_");
                                if (key.Count() > 1)
                                {
                                    sheet_wsAtt.Cells[6, c].Value = key[1];

                                    if (key[0].ToUpper() == "1")
                                    {
                                        CalendarEntity colDate = lisCalendar.Where(p => p.Date.ToString("yyyy-MM-dd") == key[1]).FirstOrDefault();

                                        if (colDate != null)
                                        {
                                            sheet_wsAtt.Cells[4, c].Value = colDate.DayOfWeekName;
                                            sheet_wsAtt.Cells[5, c].Value = colDate.DayOfWeekNameVN;
                                        }

                                        if (start_1 == 1)
                                        {
                                            start_1 = c;
                                        }

                                        end_1 = c;
                                    }
                                    else if (key[0].ToUpper() == "2")
                                    {
                                        if (start_2 == 1)
                                        {
                                            start_2 = c;
                                        }

                                        end_2 = c;
                                    }
                                    else if (key[0].ToUpper() == "3")
                                    {
                                        if (start_3 == 1)
                                        {
                                            start_3 = c;
                                        }

                                        end_3 = c;
                                    }
                                    else if (key[0].ToUpper() == "4")
                                    {
                                        if (start_4 == 1)
                                        {
                                            start_4 = c;
                                        }

                                        end_4 = c;
                                    }
                                    else if (key[0].ToUpper() == "5")
                                    {
                                        if (start_5 == 1)
                                        {
                                            start_5 = c;
                                        }

                                        end_5 = c;
                                    }
                                    else if (key[0].ToUpper() == "6")
                                    {
                                        if (start_6 == 1)
                                        {
                                            start_6 = c;
                                        }

                                        end_6 = c;
                                    }
                                    else if (key[0].ToUpper() == "7")
                                    {
                                        if (start_7 == 1)
                                        {
                                            start_7 = c;
                                        }

                                        end_7 = c;
                                    }
                                }
                            }
                            #endregion

                            #region body

                            for (int c = start_1; c <= dtAtt.Columns.Count; c++)
                            {
                                for (int r = 7; r <= sheet_wsAtt.Dimension.End.Row; r++)
                                {
                                    if (c >= start_1 && c <= end_1) // Col Date 
                                    {
                                        sheet_wsAtt.Cells[r, c].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                        if (Convert.ToString(sheet_wsAtt.Cells[4, c].Value).ToUpper() == "SUNDAY")
                                        {
                                            sheet_wsAtt.Cells[4, c, 6, c].Style.Font.Color.SetColor(Color.Red);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        string str = Convert.ToString(sheet_wsAtt.Cells[r, c].Value);
                                        string[] keyDay = str.Split("_");

                                        if (keyDay.Count() > 1)
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = keyDay[0];

                                            if (!string.IsNullOrEmpty(keyDay[1]))
                                            {
                                                ExcelFormats.FormatCell(sheet_wsAtt.Cells[r, c], keyDay[1], false, ExcelHorizontalAlignment.Center);
                                            }

                                            if (!string.IsNullOrEmpty(keyDay[2]))
                                            {
                                                // Add note
                                                sheet_wsAtt.Cells[r, c].AddComment(keyDay[2], "Spiral");
                                            }

                                        }
                                    }
                                    else if (c >= start_2 && c <= end_2) // Summary
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_2)
                                        {
                                            sheet_wsAtt.Cells[6, start_2, 6, end_2].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_2, 6, end_2], "#ADD8E6", true, ExcelHorizontalAlignment.Center);
                                        }

                                        if (c == start_2)  // Tổng ngày công thực tế
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"X\")+COUNTIF({0}:{1},\"AL/2\")/2+COUNTIF({0}:{1},\"UL/2\")/2+COUNTIF({0}:{1},\"SI/2\")/2+COUNTIF({0}:{1},\"H/2\")/2+COUNTIF({0}:{1},\"X/2\")/2+COUNTIF({0}:{1},\"BL/2\")/2+COUNTIF({0}:{1},\"CL/2\")/2+COUNTIF({0}:{1},\"NB/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 1)  // Tổng ngày công X/2
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"X/2\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }

                                    }
                                    else if (c >= start_3 && c <= end_3)
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_3)
                                        {
                                            sheet_wsAtt.Cells[4, start_3].Value = "Ngày nghỉ được hưởng lương";
                                            sheet_wsAtt.Cells[4, start_3, 5, end_3].Merge = true;
                                            sheet_wsAtt.Cells[4, start_3, 5, end_3].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[4, start_3, 5, end_3], "#525252", true, ExcelHorizontalAlignment.Center);
                                            sheet_wsAtt.Cells[6, start_3, 6, end_3].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_3, 6, end_3], "#548235", true, ExcelHorizontalAlignment.Center);
                                        }

                                        if (c == start_3)  // COVID
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"COVID\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 1)  // H
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF(J{0}:AH{0},\"H\") +COUNTIF(J{0}:AH{0},\"H/2\")/2", r);
                                        }
                                        else if (c == start_3 + 2)  // NB
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"NB\")+COUNTIF({0}:{1},\"NB/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 3)  // CL
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"CL\")+COUNTIF({0}:{1},\"CL/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 4)  // KK
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"KK\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 5)  // AL
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"AL\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 6)  // AL/2
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"AL/2\")/2 + {2}/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address, sheet_wsAtt.Cells[r, end_2].Address);
                                        }
                                        else if (c == start_3 + 7)  // BL
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"BL\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 8)  // BL/2
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"BL/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 9)  // W
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"W\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_3 + 10)  // F
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"F\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                    }
                                    else if (c >= start_4 && c <= end_4)
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_4)
                                        {
                                            sheet_wsAtt.Cells[4, start_4].Value = "Ngày nghỉ không hưởng lương";
                                            sheet_wsAtt.Cells[4, start_4, 5, end_4].Merge = true;
                                            sheet_wsAtt.Cells[4, start_4, 5, end_4].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[4, start_4, 5, end_4], "#FF0000", true, ExcelHorizontalAlignment.Center);
                                            sheet_wsAtt.Cells[6, start_4, 6, end_4].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_4, 6, end_4], "#FF0000", true, ExcelHorizontalAlignment.Center);
                                        }

                                        if (c == start_4)  // UL
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"UL\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_4 + 1)  // UL/2
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"UL/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                    }
                                    else if (c >= start_5 && c <= end_5)
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_5)
                                        {
                                            sheet_wsAtt.Cells[4, start_5].Value = "Ngày nghỉ hưởng chế độ BHXH";
                                            sheet_wsAtt.Cells[4, start_5, 5, end_5].Merge = true;
                                            sheet_wsAtt.Cells[4, start_5, 5, end_5].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[4, start_5, 5, end_5], "#FF0000", true, ExcelHorizontalAlignment.Center);
                                            sheet_wsAtt.Cells[6, start_5, 6, end_5].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_5, 6, end_5], "#FF0000", true, ExcelHorizontalAlignment.Center);
                                        }

                                        if (c == start_5)  // SI
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"SI\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_5 + 1)  // SI/2
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"SI/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_5 + 2)  // ML
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"ML\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                    }
                                    else if (c >= start_6 && c <= end_6)
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_6)
                                        {
                                            sheet_wsAtt.Cells[6, start_6, 6, end_6].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_6, 6, end_6], "#ADD8E6", true, ExcelHorizontalAlignment.Center);
                                        }

                                        if (c == start_6)  // Tổng ngày OFF
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"OFF\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_6 + 2)  // Chênh lệch
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-(SUM({1}:{2})+{3})",
                                                        sheet_wsAtt.Cells[r, start_6 + 1].Address,
                                                        sheet_wsAtt.Cells[r, start_3].Address,
                                                        sheet_wsAtt.Cells[r, end_5].Address,
                                                        sheet_wsAtt.Cells[r, start_2].Address);
                                        }
                                    }
                                    else if (c >= start_7 && c <= end_7)
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_7)
                                        {
                                            sheet_wsAtt.Cells[6, start_7, 6, end_7].Style.Font.Color.SetColor(color: Color.White);
                                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_7, 6, end_7], "#FFD966", true, ExcelHorizontalAlignment.Center);
                                        }

                                        if (c == start_7 + 1)  // Phép còn lại
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-({1}+{2})",
                                                        sheet_wsAtt.Cells[r, start_7].Address,
                                                        sheet_wsAtt.Cells[r, start_3 + 5].Address,
                                                        sheet_wsAtt.Cells[r, start_3 + 6].Address);
                                        }
                                        else if (c == start_7 + 3)  // Nghỉ bù lễ (CL) còn lại
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-{1}",
                                                        sheet_wsAtt.Cells[r, start_7 + 2].Address,
                                                        sheet_wsAtt.Cells[r, start_3 + 3].Address);
                                        }
                                    }
                                }

                            }


                            #endregion

                            #region Format
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, 1, 6, start_1 - 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_1, 6, end_1], "#F8CBAD", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[4, start_1, 5, end_1], "#FFE699", true, ExcelHorizontalAlignment.Center);
                            //ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_2, 6, end_2], "#ADD8E6", true, ExcelHorizontalAlignment.Center);
                            //ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_3, 6, end_3], "#FFD966", true, ExcelHorizontalAlignment.Center);

                            //if (end_4 > end_3) ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_4, 6, end_4], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            sheet_wsAtt.Cells[4, start_1, 5, end_1].Style.Font.Size = 9;
                            ExcelFormats.Border(sheet_wsAtt, 6, 1, sheet_wsAtt.Dimension.End.Row, dtAtt.Columns.Count);
                            ExcelFormats.Border(sheet_wsAtt, 4, start_1, 5, end_1);

                            sheet_wsAtt.Cells[4, 1, 6, sheet_wsAtt.Dimension.End.Column].Style.WrapText = true;
                            sheet_wsAtt.Cells[6, 1, sheet_wsAtt.Dimension.End.Row, start_1 - 1].AutoFitColumns(8);
                            sheet_wsAtt.View.ZoomScale = 80;

                            #endregion
                        }
                        else
                        {
                            int start_1 = 1;
                            int end_1 = 1;
                            int start_2 = 1;
                            int end_2 = 1;
                            int start_3 = 1;
                            int end_3 = 1;
                            int start_4 = 1;
                            int end_4 = 1;
                            #region header
                            for (int c = 1; c <= dtAtt.Columns.Count; c++)
                            {
                                string header = Convert.ToString(sheet_wsAtt.Cells[6, c].Value);
                                string[] key = header.Split("_");
                                if (key.Count() > 1)
                                {
                                    sheet_wsAtt.Cells[6, c].Value = key[1];

                                    if (key[0].ToUpper() == "1")
                                    {
                                        CalendarEntity colDate = lisCalendar.Where(p => p.Date.ToString("yyyy-MM-dd") == key[1]).FirstOrDefault();

                                        if (colDate != null)
                                        {
                                            sheet_wsAtt.Cells[4, c].Value = colDate.DayOfWeekName;
                                            sheet_wsAtt.Cells[5, c].Value = colDate.DayOfWeekNameVN;
                                        }

                                        if (start_1 == 1)
                                        {
                                            start_1 = c;
                                        }

                                        end_1 = c;
                                    }
                                    else if (key[0].ToUpper() == "2")
                                    {
                                        if (start_2 == 1)
                                        {
                                            start_2 = c;
                                        }

                                        end_2 = c;
                                    }
                                    else if (key[0].ToUpper() == "3")
                                    {
                                        if (start_3 == 1)
                                        {
                                            start_3 = c;
                                        }

                                        end_3 = c;
                                    }
                                    else if (key[0].ToUpper() == "4")
                                    {
                                        if (start_4 == 1)
                                        {
                                            start_4 = c;
                                        }

                                        end_4 = c;
                                    }
                                }
                            }
                            #endregion

                            #region body

                            for (int c = start_1; c <= dtAtt.Columns.Count; c++)
                            {
                                for (int r = 7; r <= sheet_wsAtt.Dimension.End.Row; r++)
                                {
                                    if (c >= start_1 && c <= end_1) // Col Date 
                                    {
                                        sheet_wsAtt.Cells[r, c].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                        if (Convert.ToString(sheet_wsAtt.Cells[4, c].Value).ToUpper() == "SUNDAY")
                                        {
                                            sheet_wsAtt.Cells[4, c, 6, c].Style.Font.Color.SetColor(Color.Red);
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        string str = Convert.ToString(sheet_wsAtt.Cells[r, c].Value);
                                        string[] keyDay = str.Split("_");

                                        if (keyDay.Count() > 1)
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = keyDay[0];

                                            if (!string.IsNullOrEmpty(keyDay[1]))
                                            {
                                                ExcelFormats.FormatCell(sheet_wsAtt.Cells[r, c], keyDay[1], false, ExcelHorizontalAlignment.Center);
                                            }

                                            if (!string.IsNullOrEmpty(keyDay[2]))
                                            {
                                                // Add note
                                                sheet_wsAtt.Cells[r, c].AddComment(keyDay[2], "Spiral");
                                            }

                                        }
                                    }
                                    else if (c >= start_2) // Summary
                                    {
                                        if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                        {
                                            sheet_wsAtt.Cells[r, c].Value = null;
                                        }

                                        if (c == start_2)  // x/2
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"X/2\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 3)  // Tổng ngày công thực tế
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"X\")+COUNTIF({0}:{1},\"X/2\")/2+COUNTIF({0}:{1},\"KK\")+COUNTIF({0}:{1},\"KK/2\")/2+COUNTIF({0}:{1},\"BL/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 4)  // Nghỉ hưởng lương
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"AL\")+COUNTIF({0}:{1},\"AL/2\")/2+COUNTIF({0}:{1},\"CL\")+COUNTIF({0}:{1},\"CL/2\")/2+COUNTIF({0}:{1},\"CT\")+COUNTIF({0}:{1},\"CT/2\")/2+COUNTIF({0}:{1},\"NB\")+COUNTIF({0}:{1},\"NB/2\")/2+{2}/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address, sheet_wsAtt.Cells[r, start_2].Address);
                                        }
                                        else if (c == start_2 + 5)  // Holiday
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"H\")+COUNTIF({0}:{1},\"H/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 6)  // Chấm công offline
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"OL\")+COUNTIF({0}:{1},\"OL/2\")/2+COUNTIF({0}:{1},\"BL\")+COUNTIF({0}:{1},\"BL/2\")/2+COUNTIF({0}:{1},\"ND\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 7)  // Tổng ngày OFF
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"OFF\")+COUNTIF({0}:{1},\"OFF/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 8)  // Tổng số ngày công
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=SUM({0}:{1})",
                                                        sheet_wsAtt.Cells[r, start_2 + 3].Address, sheet_wsAtt.Cells[r, start_2 + 6].Address);
                                        }
                                        else if (c == start_2 + 10)  // Chênh lệch
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-{1}",
                                                        sheet_wsAtt.Cells[r, c - 1].Address, sheet_wsAtt.Cells[r, c - 2].Address);
                                        }
                                        else if (c == start_2 + 11)  // Tổng ngày công tính lương
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=IF({3}<>\"\",SUM({0}:{1},{2}),MIN({2},27))",
                                                        sheet_wsAtt.Cells[r, start_1 - 1].Address, sheet_wsAtt.Cells[r, start_1 + 2].Address, sheet_wsAtt.Cells[r, start_1 + 3].Address, sheet_wsAtt.Cells[r, c - 3].Address);
                                        }
                                        else if (c == start_2 + 13)  // Số phép sử dụng trong tháng
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"AL\")+COUNTIF({0}:{1},\"AL/2\")/2",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 14)  // Số phép sử dụng trong tháng
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-{1}",
                                                        sheet_wsAtt.Cells[r, c - 2].Address, sheet_wsAtt.Cells[r, c - 1].Address);
                                        }
                                        else if (c == start_2 + 16)  // Nghỉ bù lễ (CL) sử dụng tháng này
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"CL\")",
                                                        sheet_wsAtt.Cells[r, start_1].Address, sheet_wsAtt.Cells[r, end_1].Address);
                                        }
                                        else if (c == start_2 + 17)  // Nghỉ bù lễ (CL) còn lại
                                        {
                                            sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-{1}",
                                                       sheet_wsAtt.Cells[r, c - 2].Address, sheet_wsAtt.Cells[r, c - 1].Address);
                                        }
                                        else
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                            {
                                                Double tmpCol;
                                                if (Double.TryParse(Convert.ToString(sheet_wsAtt.Cells[r, c].Value), out tmpCol))
                                                {
                                                    sheet_wsAtt.Cells[r, c].Value = tmpCol;
                                                }
                                            }
                                        }

                                    }
                                }
                            }


                            #endregion

                            #region Format
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, 1, 6, start_1 - 1], "#A9D08E", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_1, 6, end_1], "#F8CBAD", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[4, start_1, 5, end_1], "#FFE699", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_2, 6, end_2], "#ADD8E6", true, ExcelHorizontalAlignment.Center);
                            ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_3, 6, end_3], "#FFD966", true, ExcelHorizontalAlignment.Center);

                            if (end_4 > end_3) ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, start_4, 6, end_4], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                            sheet_wsAtt.Cells[4, start_1, 5, end_1].Style.Font.Size = 9;
                            ExcelFormats.Border(sheet_wsAtt, 6, 1, sheet_wsAtt.Dimension.End.Row, dtAtt.Columns.Count);
                            ExcelFormats.Border(sheet_wsAtt, 4, start_1, 5, end_1);

                            sheet_wsAtt.Cells[4, 1, 6, sheet_wsAtt.Dimension.End.Column].Style.WrapText = true;
                            sheet_wsAtt.Cells[6, 1, sheet_wsAtt.Dimension.End.Row, start_1 - 1].AutoFitColumns(8);
                            sheet_wsAtt.View.ZoomScale = 80;

                            #endregion
                        }

                        #region TimesheetDetail
                        DataTable detail = Task.Run(() => _service.Timesheet_Export_Detail(accountId, userId, jsonData)).Result;
                        var sheetDetail = pk.Workbook.Worksheets.Add("Timesheets Detail");
                        sheetDetail.Cells[1, 1].Value = "XÁC NHẬN CÔNG";
                        sheetDetail.Cells[1, 1].Style.Font.Size = 18;

                        sheetDetail.Cells[1, 1, 1, 8].Merge = true;
                        sheetDetail.Row(1).Height = 22.5;
                        sheetDetail.Row(3).Height = 22.5;
                        ExcelFormats.FormatCell(sheetDetail.Cells[1, 1, 1, 8], "#D9E1F2", true, ExcelHorizontalAlignment.Center);

                        sheetDetail.Cells[3, 1].LoadFromDataTable(detail, true);
                        sheetDetail.Cells[3, 1, 3, sheetDetail.Dimension.End.Column].Style.Font.Color.SetColor(Color.White);
                        ExcelFormats.FormatCell(sheetDetail.Cells[3, 1, 3, sheetDetail.Dimension.End.Column], "#305496", true, ExcelHorizontalAlignment.Center);

                        ExcelFormats.Border(sheetDetail, 3, 1, sheetDetail.Dimension.End.Row, sheetDetail.Dimension.End.Column);
                        sheetDetail.Cells[3, 1, sheetDetail.Dimension.End.Row, sheetDetail.Dimension.End.Column].AutoFitColumns();
                        #endregion

                        DataTable tbShift = await Task.Run(() => _service.AttendantReport_ShiftList(accountId));
                        if (tbShift.Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets.Add("Ký hiệu Attendant");

                            sheet.Cells[2, 2].LoadFromDataTable(tbShift, true);
                            sheet.Cells[2, 2, 2, sheet.Dimension.End.Column].Style.Font.Color.SetColor(Color.White);
                            ExcelFormats.FormatCell(sheet.Cells[2, 2, 2, sheet.Dimension.End.Column], "red", true, ExcelHorizontalAlignment.Center);

                            for (int r = 3; r <= sheet.Dimension.End.Row; r++)
                            {
                                if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, sheet.Dimension.End.Column].Value)))
                                {
                                    ExcelFormats.FormatCell(sheet.Cells[r, 3], Convert.ToString(sheet.Cells[r, sheet.Dimension.End.Column].Value), false, ExcelHorizontalAlignment.Center);
                                }
                            }

                            sheet.DeleteColumn(sheet.Dimension.End.Column);
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns(9);
                            ExcelFormats.Border(sheet, 2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }

                    }
                    #endregion

                    #region RawData
                    DataTable data = await Task.Run(() => _attendantService.Report_Attendant_RawData(userId, jsonData, accountId));
                    if (data.Rows.Count > 0)
                    {

                        var sheet = pk.Workbook.Worksheets.Add("Rawdata");
                        sheet.Cells[1, 1].Value = "ATTENDANT RAWDATA";
                        sheet.Cells[1, 1].Style.Font.Size = 20;
                        sheet.Cells[1, 1].Style.Font.Bold = true;
                        sheet.Cells[1, 1].Style.Font.Color.SetColor(Color.White);
                        sheet.Cells[1, 1].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                        sheet.Row(1).Height = 38;
                        sheet.Cells[1, 1, 1, 5].Merge = true;
                        ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, 5], "#0070C0", true, ExcelHorizontalAlignment.Center);

                        sheet.Cells[2, 1].Value = "From:";
                        sheet.Cells[2, 2].Value = dataJson.fromdate;
                        sheet.Cells[3, 1].Value = "To:";
                        sheet.Cells[3, 2].Value = dataJson.todate;

                        sheet.Cells[4, 1].LoadFromDataTable(data, true);

                        ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, sheet.Dimension.End.Column], "#9BC2E6", true, ExcelHorizontalAlignment.Center);

                        for (int r = 5; r <= sheet.Dimension.End.Row; r++)
                        {
                            for (int c = 15; c <= sheet.Dimension.End.Column; c++)
                            {
                                if (c <= 20)
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
                                else if (c > 22)
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
                        sheet.Column(7).Width = 30;
                        sheet.Column(8).Width = 30;
                    }
                    #endregion

                    #region AttendantTotal
                    DataTable dt_total = Task.Run(() => _service.Timesheet_Export_Total(accountId, userId, jsonData)).Result;
                    var sheet_total = pk.Workbook.Worksheets.Add("Attendant Total");
                    sheet_total.Cells[1, 1].Value = "ATTENDANT TOTAL";
                    sheet_total.Cells[1, 1].Style.Font.Size = 18;
                    sheet_total.Cells[1, 1, 1, 8].Merge = true;

                    sheet_total.Cells[2, 1].Value = "From:";
                    sheet_total.Cells[2, 2].Value = dataJson.fromdate;
                    sheet_total.Cells[2, 3].Value = "To:";
                    sheet_total.Cells[2, 4].Value = dataJson.todate;

                    sheet_total.Row(1).Height = 35;
                    sheet_total.Row(3).Height = 35;
                    ExcelFormats.FormatCell(sheet_total.Cells[1, 1, 1, 8], "#E2EFDA", true, ExcelHorizontalAlignment.Center);

                    sheet_total.Cells[3, 1].LoadFromDataTable(dt_total, true);
                    ExcelFormats.FormatCell(sheet_total.Cells[3, 1, 3, sheet_total.Dimension.End.Column], "#00872B", true, ExcelHorizontalAlignment.Center);
                    ExcelFormats.Border(sheet_total, 3, 1, sheet_total.Dimension.End.Row, sheet_total.Dimension.End.Column);
                    sheet_total.Cells[3, 1, sheet_total.Dimension.End.Row, sheet_total.Dimension.End.Column].AutoFitColumns();
                    #endregion

                    #region WorkingPlan
                    DataTable dt_wp = Task.Run(() => _service.Timesheet_Export_WorkingPlan(accountId, userId, jsonData)).Result;
                    var sheet_wp = pk.Workbook.Worksheets.Add("WorkingPlan");
                    sheet_wp.Cells[1, 1].Value = "WORKING PLAN";
                    sheet_wp.Cells[1, 1].Style.Font.Size = 18;
                    sheet_wp.Cells[1, 1, 1, 8].Merge = true;

                    sheet_wp.Cells[2, 1].Value = "From:";
                    sheet_wp.Cells[2, 2].Value = dataJson.fromdate;
                    sheet_wp.Cells[2, 3].Value = "To:";
                    sheet_wp.Cells[2, 4].Value = dataJson.todate;

                    sheet_wp.Row(1).Height = 35;
                    sheet_wp.Row(3).Height = 35;
                    ExcelFormats.FormatCell(sheet_wp.Cells[1, 1, 1, 8], "#E2EFDA", true, ExcelHorizontalAlignment.Center);

                    sheet_wp.Cells[5, 1].LoadFromDataTable(dt_wp, true);
                    ExcelFormats.Border(sheet_wp, 3, 1, sheet_wp.Dimension.End.Row, dt_wp.Columns.Count);

                    #region header
                    int startColDate = 1, endColDate = 1;
                    string[] listColor = { "#55D978", "#FAE1E1" };
                    int indColor = 0;
                    for (int c = 1; c <= dt_wp.Columns.Count; c++)
                    {
                        string header = Convert.ToString(sheet_wp.Cells[5, c].Value);
                        string[] keyHeader = header.Split("_");
                        if (keyHeader.Count() > 1)
                        {
                            if (startColDate == 1)
                            {
                                startColDate = c;
                            }
                            endColDate = c;
                            sheet_wp.Cells[3, c].Value = keyHeader[0];
                            sheet_wp.Cells[4, c].Value = keyHeader[1];
                            sheet_wp.Cells[5, c].Value = keyHeader[2];
                        }
                        else
                        {
                            sheet_wp.Cells[3, c].Value = header;
                            sheet_wp.Cells[4, c].Value = header;
                        }
                    }
                    #endregion

                    #region body
                    for (int c = 1; c <= dt_wp.Columns.Count; c++)
                    {
                        if (c < startColDate || c > endColDate)
                        {
                            sheet_wp.Cells[3, c, 5, c].Merge = true;
                        }

                        if (c >= startColDate)
                        {
                            for (int r = 6; r <= sheet_wp.Dimension.End.Row; r++)
                            {
                                if (c <= endColDate)
                                {
                                    string strBody = Convert.ToString(sheet_wp.Cells[r, c].Value);
                                    string[] keyBody = strBody.Split("_");
                                    if (keyBody.Count() > 1)
                                    {
                                        sheet_wp.Cells[r, c].Value = keyBody[0];
                                        if (!string.IsNullOrEmpty(keyBody[1]))
                                        {
                                            ExcelFormats.FormatCell(sheet_wp.Cells[r, c], keyBody[1], false, ExcelHorizontalAlignment.Center);
                                        }
                                    }
                                }
                                else
                                {
                                    if (!string.IsNullOrEmpty(Convert.ToString(sheet_wp.Cells[r, c].Value)))
                                    {
                                        int tmpNum;
                                        if (Int32.TryParse(Convert.ToString(sheet_wp.Cells[r, c].Value), out tmpNum))
                                        {
                                            sheet_wp.Cells[r, c].Value = tmpNum;
                                        }
                                    }
                                }
                            }
                        }
                    }
                    #endregion

                    #region format
                    int startCol = startColDate, endCol = startColDate;
                    string strCol = Convert.ToString(sheet_wp.Cells[3, startCol].Value);
                    for (int c = startColDate; c <= endColDate; c++)
                    {
                        if (strCol == Convert.ToString(sheet_wp.Cells[3, c].Value))
                        {
                            endCol = c;
                            if (c == endColDate)
                            {
                                sheet_wp.Cells[3, startCol, 3, endCol].Merge = true;
                                sheet_wp.Cells[4, startCol, 4, endCol].Merge = true;

                                ExcelFormats.FormatCell(sheet_wp.Cells[3, startCol, 5, endCol], listColor[indColor], true, ExcelHorizontalAlignment.Center);
                            }
                        }
                        else
                        {
                            sheet_wp.Cells[3, startCol, 3, endCol].Merge = true;
                            sheet_wp.Cells[4, startCol, 4, endCol].Merge = true;
                            ExcelFormats.FormatCell(sheet_wp.Cells[3, startCol, 5, endCol], listColor[indColor], true, ExcelHorizontalAlignment.Center);

                            indColor++;
                            if (indColor >= listColor.Length)
                            {
                                indColor = 0;
                            }

                            startCol = c;
                            endCol = c;
                            strCol = Convert.ToString(sheet_wp.Cells[3, c].Value);
                        }
                    }

                    sheet_wp.Cells[3, 1, 5, startColDate - 1].Style.Font.Color.SetColor(Color.White);
                    ExcelFormats.FormatCell(sheet_wp.Cells[3, 1, 5, startColDate - 1], "#305496", true, ExcelHorizontalAlignment.Center);
                    ExcelFormats.FormatCell(sheet_wp.Cells[3, endColDate + 1, 5, dt_wp.Columns.Count], "#FBFD3E", true, ExcelHorizontalAlignment.Center);

                    sheet_wp.Cells[3, startColDate, sheet_wp.Dimension.End.Row, endColDate].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    sheet_wp.Cells[3, 1, sheet_wp.Dimension.End.Row, sheet_wp.Dimension.End.Column].AutoFitColumns();
                    sheet_wp.Cells[3, 1, 5, sheet_wp.Dimension.End.Column].Style.WrapText = true;
                    #endregion

                    #endregion


                    #region ChangePlan
                    DataTable dt_changeplan = Task.Run(() => _service.Timesheet_Export_ChangePlan(accountId, userId, jsonData)).Result;
                    var sheet_cp = pk.Workbook.Worksheets.Add("Change Plan");
                    sheet_cp.Cells[1, 1].Value = "ĐỔI LỊCH LÀM VIỆC";
                    sheet_cp.Cells[1, 1].Style.Font.Size = 18;
                    sheet_cp.Cells[1, 1, 1, 8].Merge = true;

                    sheet_cp.Cells[2, 1].Value = "From:";
                    sheet_cp.Cells[2, 2].Value = dataJson.fromdate;
                    sheet_cp.Cells[2, 3].Value = "To:";
                    sheet_cp.Cells[2, 4].Value = dataJson.todate;

                    sheet_cp.Row(1).Height = 35;
                    sheet_cp.Row(3).Height = 35;
                    ExcelFormats.FormatCell(sheet_cp.Cells[1, 1, 1, 8], "#D9E1F2", true, ExcelHorizontalAlignment.Center);

                    sheet_cp.Cells[3, 1].LoadFromDataTable(dt_changeplan, true);
                    sheet_cp.Cells[3, 1, 3, sheet_cp.Dimension.End.Column].Style.Font.Color.SetColor(Color.White);
                    ExcelFormats.FormatCell(sheet_cp.Cells[3, 1, 3, sheet_cp.Dimension.End.Column], "#305496", true, ExcelHorizontalAlignment.Center);
                    ExcelFormats.Border(sheet_cp, 3, 1, sheet_cp.Dimension.End.Row, sheet_cp.Dimension.End.Column);
                    sheet_cp.Cells[3, 1, sheet_cp.Dimension.End.Row, sheet_cp.Dimension.End.Column].AutoFitColumns();
                    #endregion

                    #region ByStore
                    DataTable dtByStore = Task.Run(() => _service.Timesheet_Export_ByStore(accountId, userId, jsonData)).Result;
                    var sheet_byStore = pk.Workbook.Worksheets.Add("ATTENDANT BY STORE");
                    sheet_byStore.Cells[1, 1].Value = "ATTENDANT BY STORE";
                    sheet_byStore.Cells[1, 1].Style.Font.Size = 18;
                    sheet_byStore.Cells[1, 1, 1, 8].Merge = true;

                    sheet_byStore.Cells[2, 1].Value = "From:";
                    sheet_byStore.Cells[2, 2].Value = dataJson.fromdate;
                    sheet_byStore.Cells[2, 3].Value = "To:";
                    sheet_byStore.Cells[2, 4].Value = dataJson.todate;

                    sheet_byStore.Row(1).Height = 35;
                    ExcelFormats.FormatCell(sheet_byStore.Cells[1, 1, 1, 8], "#305496", true, ExcelHorizontalAlignment.Center, "white");

                    if (dtByStore.Rows.Count > 0)
                    {
                        sheet_byStore.Cells[4, 1].LoadFromDataTable(dtByStore, true);


                        int start = 1;
                        int end = 1;

                        for (int c = 1; c <= dtByStore.Columns.Count; c++)
                        {
                            if (!string.IsNullOrEmpty(Convert.ToString(sheet_byStore.Cells[4, c].Value)))
                            {
                                string[] strHead = Convert.ToString(sheet_byStore.Cells[4, c].Value).Split("_");
                                if (strHead.Length > 1)
                                {
                                    if (start == 1)
                                    {
                                        start = c;
                                    }
                                    end = c;
                                    sheet_byStore.Cells[3, c].Value = strHead[0];
                                    sheet_byStore.Cells[4, c].Value = strHead[1];

                                    ExcelFormats.FormatCell(sheet_byStore.Cells[3, c], "#C6E0B4", false, ExcelHorizontalAlignment.Center);
                                    if (strHead[1] == "WP")
                                    {
                                        ExcelFormats.FormatCell(sheet_byStore.Cells[4, c], "#FFD966", false, ExcelHorizontalAlignment.Center);

                                    }
                                    else
                                    {
                                        ExcelFormats.FormatCell(sheet_byStore.Cells[4, c], "#F4B084", false, ExcelHorizontalAlignment.Center);
                                    }
                                }
                                else
                                {
                                    sheet_byStore.Cells[3, c].Value = Convert.ToString(sheet_byStore.Cells[4, c].Value);
                                    sheet_byStore.Cells[3, c, 4, c].Merge = true;

                                    ExcelFormats.FormatCell(sheet_byStore.Cells[3, c, 4, c], "#FCE4D6", true, ExcelHorizontalAlignment.Center);
                                }
                            }
                        }
                        sheet_byStore.Cells[4, start, sheet_byStore.Dimension.End.Row, sheet_byStore.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        int endM = start, startM = start;
                        string strTmp = Convert.ToString(sheet_byStore.Cells[3, start].Value);
                        for (int c = start; c <= dtByStore.Columns.Count; c++)
                        {
                            if (c <= end)
                            {
                                if (Convert.ToString(sheet_byStore.Cells[3, c].Value) == strTmp)
                                {
                                    endM = c;
                                    if (c == end)
                                    {
                                        sheet_byStore.Cells[3, startM, 3, endM].Merge = true;
                                    }
                                }
                                else
                                {
                                    sheet_byStore.Cells[3, startM, 3, endM].Merge = true;
                                    startM = c;
                                    endM = c;
                                    strTmp = Convert.ToString(sheet_byStore.Cells[3, c].Value);
                                }
                            }
                            else
                            {
                                for (int r = 5; r <= sheet_byStore.Dimension.End.Row; r++)
                                {
                                    if(c == dtByStore.Columns.Count - 1)
                                    {
                                        sheet_byStore.Cells[r, c].Formula = string.Format("=SUMIF({0},\"WP\",{1})",
                                             sheet_byStore.Cells[4, start, 4, end].Address, sheet_byStore.Cells[r, start, r, end].Address);
                                    }
                                    else
                                    {
                                        sheet_byStore.Cells[r, c].Formula = string.Format("=SUMIF({0},\"Actual\",{1})",
                                             sheet_byStore.Cells[4, start, 4, end].Address, sheet_byStore.Cells[r, start, r, end].Address);

                                        var f = sheet_byStore.ConditionalFormatting.AddExpression(sheet_byStore.Cells[r, c]);
                                        f.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                        f.Formula = string.Format("={0}<{1}", sheet_byStore.Cells[r, c], sheet_byStore.Cells[r, c - 1]);
                                    }
                                 
                                }
                            }

                        }

                        sheet_byStore.Cells[3, 1, 4, sheet_byStore.Dimension.End.Column].Style.WrapText = true;
                        ExcelFormats.Border(sheet_byStore, 3, 1, sheet_byStore.Dimension.End.Row, sheet_byStore.Dimension.End.Column);
                        sheet_byStore.Cells[3, 1, sheet_byStore.Dimension.End.Row, sheet_byStore.Dimension.End.Column].AutoFitColumns();
                    }

                    #endregion

                    #region ByEmployee
                    DataTable dtByEmployee = Task.Run(() => _service.Timesheet_Export_ByEmployee(accountId, userId, jsonData)).Result;
                    var sheet_byEmpoyee = pk.Workbook.Worksheets.Add("ATTENDANT BY EMPLOYEE");
                    sheet_byEmpoyee.Cells[1, 1].Value = "ATTENDANT BY EMPLOYEE";
                    sheet_byEmpoyee.Cells[1, 1].Style.Font.Size = 18;
                    sheet_byEmpoyee.Cells[1, 1, 1, 8].Merge = true;

                    sheet_byEmpoyee.Cells[2, 1].Value = "From:";
                    sheet_byEmpoyee.Cells[2, 2].Value = dataJson.fromdate;
                    sheet_byEmpoyee.Cells[2, 3].Value = "To:";
                    sheet_byEmpoyee.Cells[2, 4].Value = dataJson.todate;

                    sheet_byEmpoyee.Row(1).Height = 35;
                    ExcelFormats.FormatCell(sheet_byEmpoyee.Cells[1, 1, 1, 8], "#305496", true, ExcelHorizontalAlignment.Center, "white");

                    if(dtByEmployee.Rows.Count > 0)
                    {
                        sheet_byEmpoyee.Cells[4, 1].LoadFromDataTable(dtByEmployee, true);


                        int start = 1;
                        int end = 1;

                        for(int c = 1; c <= dtByEmployee.Columns.Count; c++)
                        {
                            if (!string.IsNullOrEmpty(Convert.ToString(sheet_byEmpoyee.Cells[4, c].Value)))
                            {
                                string [] strHead = Convert.ToString(sheet_byEmpoyee.Cells[4, c].Value).Split("_");
                                if(strHead.Length > 1)
                                {
                                    if(start == 1)
                                    {
                                        start = c;
                                    }
                                    end = c;
                                    sheet_byEmpoyee.Cells[3, c].Value = strHead[0]; 
                                    sheet_byEmpoyee.Cells[4, c].Value = strHead[1];

                                    ExcelFormats.FormatCell(sheet_byEmpoyee.Cells[3, c], "#C6E0B4", false, ExcelHorizontalAlignment.Center);
                                    if (strHead[1] == "WP")
                                    {
                                        ExcelFormats.FormatCell(sheet_byEmpoyee.Cells[4, c], "#FFD966", false, ExcelHorizontalAlignment.Center);

                                    }
                                    else if (strHead[1] == "Actual")
                                    {
                                        ExcelFormats.FormatCell(sheet_byEmpoyee.Cells[4, c], "#F4B084", false, ExcelHorizontalAlignment.Center);
                                    }
                                    else
                                    {
                                        ExcelFormats.FormatCell(sheet_byEmpoyee.Cells[4, c], "#9BC2E6", false, ExcelHorizontalAlignment.Center);
                                        for (int r = 5; r <= sheet_byEmpoyee.Dimension.End.Row; r++)
                                        {
                                            sheet_byEmpoyee.Cells[r, c].Formula = string.Format("=IFERROR({0}/{1},\"-\")",
                                                sheet_byEmpoyee.Cells[r, c - 1].Address, sheet_byEmpoyee.Cells[r, c - 2].Address);
                                            sheet_byEmpoyee.Cells[r, c].Style.Numberformat.Format = "#0%";
                                        }
                                    }
                                }
                                else
                                {
                                    sheet_byEmpoyee.Cells[3, c].Value = Convert.ToString(sheet_byEmpoyee.Cells[4, c].Value);
                                    sheet_byEmpoyee.Cells[3, c, 4, c].Merge = true;
                                    ExcelFormats.FormatCell(sheet_byEmpoyee.Cells[3, c, 4, c], "#FCE4D6", true, ExcelHorizontalAlignment.Center);
                                }
                            }
                        }

                        sheet_byEmpoyee.Cells[4, start, sheet_byEmpoyee.Dimension.End.Row, sheet_byEmpoyee.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                        int endM = start, startM = start;   
                        string strTmp = Convert.ToString(sheet_byEmpoyee.Cells[3, start].Value);
                        for (int c = start; c <= dtByEmployee.Columns.Count; c++)
                        {
                            if(c <= end)
                            {
                                if (Convert.ToString(sheet_byEmpoyee.Cells[3, c].Value) == strTmp)
                                {
                                    endM = c;
                                    if (c == end)
                                    {
                                        sheet_byEmpoyee.Cells[3, startM, 3, endM].Merge = true;
                                    }
                                }
                                else
                                {
                                    sheet_byEmpoyee.Cells[3, startM, 3, endM].Merge = true;
                                    startM = c;
                                    endM = c;
                                    strTmp = Convert.ToString(sheet_byEmpoyee.Cells[3, c].Value);
                                }
                            }
                            else
                            {
                                for(int r = 5; r <= sheet_byEmpoyee.Dimension.End.Row; r++)
                                {
                                    if (c == dtByEmployee.Columns.Count - 2)
                                    {
                                        sheet_byEmpoyee.Cells[r, c].Formula = string.Format("=SUMIF({0},\"WP\",{1})",
                                             sheet_byEmpoyee.Cells[4, start, 4, end].Address, sheet_byEmpoyee.Cells[r, start, r, end].Address);
                                    }
                                    else if (c == dtByEmployee.Columns.Count - 1)
                                    {
                                        sheet_byEmpoyee.Cells[r, c].Formula = string.Format("=SUMIF({0},\"Actual\",{1})",
                                             sheet_byEmpoyee.Cells[4, start, 4, end].Address, sheet_byEmpoyee.Cells[r, start, r, end].Address);

                                        var f = sheet_byEmpoyee.ConditionalFormatting.AddExpression(sheet_byEmpoyee.Cells[r, c]);
                                        f.Style.Fill.BackgroundColor.Color = ColorTranslator.FromHtml("#FF0000");
                                        f.Formula = string.Format("={0}<{1}", sheet_byEmpoyee.Cells[r, c], sheet_byEmpoyee.Cells[r, c - 1]);
                                    }
                                    else
                                    {
                                        sheet_byEmpoyee.Cells[r, c].Formula = string.Format("=IFERROR({0}/{1},\"-\")",
                                            sheet_byEmpoyee.Cells[r, c - 1].Address, sheet_byEmpoyee.Cells[r, c - 2].Address);
                                        sheet_byEmpoyee.Cells[r, c].Style.Numberformat.Format = "#0%";
                                    }
                                }
                            }
                           
                        }
                        sheet_byEmpoyee.Cells[3, 1, 4, sheet_byEmpoyee.Dimension.End.Column].Style.WrapText = true;
                        ExcelFormats.Border(sheet_byEmpoyee, 3, 1, sheet_byEmpoyee.Dimension.End.Row, sheet_byEmpoyee.Dimension.End.Column);
                        sheet_byEmpoyee.Cells[3, 1, sheet_byEmpoyee.Dimension.End.Row, sheet_byEmpoyee.Dimension.End.Column].AutoFitColumns();
                    }

                    #endregion

                    

                    pk.Save();
                    return new ResultInfo(200, "Successful", string.Format("{0}://{1}/{2}/{3}", scheme, host, subfoler, fileName));

                }
                catch (Exception ex)
                {
                    return new ResultInfo(500, ex.Message, ex.StackTrace);
                }
            }
        }


    }
}

