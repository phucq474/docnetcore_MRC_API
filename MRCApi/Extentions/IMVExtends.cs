using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using OfficeOpenXml;
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
    public class IMVExtends
    {
        public class ListGroupColumnModel
        {
            public int start_1 { get; set; } = 1;
            public int end_1 { get; set; } = 1;
            public int start_2 { get; set; } = 1;
            public int end_2 { get; set; } = 1;
            public int start_3 { get; set; } = 1;
            public int end_3 { get; set; } = 1;
            public int start_4 { get; set; } = 1;
            public int end_4 { get; set; } = 1;
            public int start_5 { get; set; } = 1; 
            public int end_5 { get; set; } = 1;
            public int start_6 { get; set; } = 1;
            public int end_6 { get; set; } = 1;

            public string color_1 { get; set; } = "#DDEBF7";
            public string color_2 { get; set; } = "#FCE4D6";
            public string color_3 { get; set; } = "#FFFF00";
            public string color_4 { get; set; } = "#A9D08E";
            public string color_5 { get; set; } = "#E2EFDA";
            public string color_6 { get; set; } = "#C9C9C9";
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

                        sheet_wsAtt.Cells[1, 1].Value = "BÁO CÁO CHẤM CÔNG";
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

                        ListGroupColumnModel listCol = new ListGroupColumnModel();  
                        
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
                                        sheet_wsAtt.Cells[5, c].Value = colDate.DayOfWeekNameAliasVN;
                                        sheet_wsAtt.Cells[6, c].Value = colDate.Date.ToString("dd/MMM");
                                    }

                                    if (listCol.start_1 == 1)
                                    {
                                        listCol.start_1 = c;
                                    }

                                    listCol.end_1 = c;
                                }
                                else if (key[0].ToUpper() == "2")
                                {
                                    if (listCol.start_2 == 1)
                                    {
                                        listCol.start_2 = c;
                                    }

                                    listCol.end_2 = c;
                                }
                                else if (key[0].ToUpper() == "3")
                                {
                                    if (listCol.start_3 == 1)
                                    {
                                        listCol.start_3 = c;
                                    }

                                    listCol.end_3 = c;
                                }
                                else if (key[0].ToUpper() == "4")
                                {
                                    if (listCol.start_4 == 1)
                                    {
                                        listCol.start_4 = c;
                                    }

                                    listCol.end_4 = c;
                                }
                                else if (key[0].ToUpper() == "5")
                                {
                                    if (listCol.start_5 == 1)
                                    {
                                        listCol.start_5 = c;
                                    }

                                    listCol.end_5 = c;
                                }
                                else if (key[0].ToUpper() == "6")
                                {
                                    if (listCol.start_6 == 1)
                                    {
                                        listCol.start_6 = c;
                                    }

                                    listCol.end_6 = c;
                                }
                            }
                        }
                        #endregion

                        #region body

                        for (int c = listCol.start_1; c <= dtAtt.Columns.Count; c++)
                        {
                            for (int r = 7; r <= sheet_wsAtt.Dimension.End.Row; r++)
                            {
                                if (c >= listCol.start_1 && c <= listCol.end_1) // Col Date 
                                {
                                    sheet_wsAtt.Cells[r, c].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                                    if (Convert.ToString(sheet_wsAtt.Cells[5, c].Value).ToUpper() == "CN")
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
                                            sheet_wsAtt.Cells[r, c].AddComment(keyDay[2], "Note");
                                        }

                                    }
                                }
                                else if (c >= listCol.start_2) // Summary
                                {
                                    if (string.IsNullOrEmpty(Convert.ToString(sheet_wsAtt.Cells[r, c].Value)))
                                    {
                                        sheet_wsAtt.Cells[r, c].Value = null;
                                    }

                                    if (c == listCol.start_2)  // Số ngày làm việc thực tế
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"8\")+COUNTIF({0}:{1},\"AL/2\")/2+COUNTIF({0}:{1},\"UL/2\")/2",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 1)  // Công tác
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"CT\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 2)  // Phép năm
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"AL\")+COUNTIF({0}:{1},\"AL/2\")/2",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 3)  // Nghỉ Lễ Tết
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"PH\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 4)  // Nghỉ chế độ hiếu/hỷ
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"W\")+COUNTIF({0}:{1},\"F\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 5)  // Ngày nghỉ không lương
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"UL\")+COUNTIF({0}:{1},\"UL/2\")/2",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 6)  // Ngày nghỉ hưởng BHXH
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"SI\")+COUNTIF({0}:{1},\"TSFM\")+COUNTIF({0}:{1},\"TSM\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 7)  // Nghỉ tuần
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"OFF\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 8)  // Nhân viên mới
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"NH\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    }
                                    else if (c == listCol.start_2 + 9)  // Nghỉ việc
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=COUNTIF({0}:{1},\"NV\")",
                                                    sheet_wsAtt.Cells[r, listCol.start_1].Address, sheet_wsAtt.Cells[r, listCol.end_1].Address);
                                    } 
                                    else if (c == listCol.start_3)  // Ngày công tính lương
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("=IF(OR(({0}>=1),({1}>=1)),(SUM({2}:{3})),(26-SUM({4},{5})))",
                                                    sheet_wsAtt.Cells[r, listCol.start_2 + 8].Address, sheet_wsAtt.Cells[r, listCol.start_2 + 9].Address,
                                                    sheet_wsAtt.Cells[r, listCol.start_2].Address, sheet_wsAtt.Cells[r, listCol.start_2 + 4].Address,
                                                    sheet_wsAtt.Cells[r, listCol.start_2 + 5].Address, sheet_wsAtt.Cells[r, listCol.start_2 + 6].Address);
                                    }
                                    else if (c == listCol.start_4 + 1)  // Phep con lai
                                    {
                                        sheet_wsAtt.Cells[r, c].Formula = string.Format("={0}-{1}",
                                                    sheet_wsAtt.Cells[r, c - 1].Address, sheet_wsAtt.Cells[r, listCol.start_2 + 2].Address);
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
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, 1, 6, listCol.start_1 - 1], "#DDEBF7", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[4, listCol.start_1, 4, listCol.end_1], "#FFF2CC", true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, listCol.start_1, 6, listCol.end_1], listCol.color_1, true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, listCol.start_2, 6, listCol.end_2], listCol.color_2, true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, listCol.start_3, 6, listCol.end_3], listCol.color_3, true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, listCol.start_4, 6, listCol.end_4], listCol.color_4, true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, listCol.start_5, 6, listCol.end_5], listCol.color_5, true, ExcelHorizontalAlignment.Center);
                        ExcelFormats.FormatCell(sheet_wsAtt.Cells[6, listCol.start_6, 6, listCol.end_6], listCol.color_6, true, ExcelHorizontalAlignment.Center);

                        sheet_wsAtt.Cells[4, listCol.start_1].Value = "CÁC NGÀY TRONG THÁNG";
                        sheet_wsAtt.Cells[4, listCol.start_1, 4, listCol.end_1].Merge = true;
                        sheet_wsAtt.Cells[4, listCol.start_1, 4, listCol.end_1].Style.Font.Color.SetColor(Color.Black);
                        sheet_wsAtt.Row(4).Height = 20;

                        sheet_wsAtt.Cells[5, listCol.start_1, 5, listCol.end_1].Style.Font.Bold = true;
                        sheet_wsAtt.Cells[4, listCol.start_1, sheet_wsAtt.Dimension.End.Row, sheet_wsAtt.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
 
                        ExcelFormats.Border(sheet_wsAtt, 6, 1, sheet_wsAtt.Dimension.End.Row, dtAtt.Columns.Count);
                        ExcelFormats.Border(sheet_wsAtt, 4, listCol.start_1, 5, listCol.end_1);

                        sheet_wsAtt.Cells[4, 1, 6, sheet_wsAtt.Dimension.End.Column].Style.WrapText = true;
                        sheet_wsAtt.Cells[6, 1, sheet_wsAtt.Dimension.End.Row, listCol.start_1 - 1].AutoFitColumns(8);
                        sheet_wsAtt.View.ZoomScale = 80;
                        sheet_wsAtt.Cells.Style.Font.Name = "Times new roman";
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
                                    ExcelFormats.FormatCell(sheet.Cells[r, 3], Convert.ToString(sheet.Cells[r, sheet.Dimension.End.Column].Value), false, ExcelHorizontalAlignment.Left);
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

                        var sheet = pk.Workbook.Worksheets.Add("Raw data");
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
                                else if (c > 24)
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
