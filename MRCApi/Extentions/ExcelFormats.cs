using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ExcelFormats
    {
        #region excel function
        public static void Border(ExcelWorksheet sheetdata, int fromrow, int FromCol, int ToRow, int tocol, string Type = null)
        {
            if (Type == null)
            {
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Color.SetColor(Color.Black);
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(Color.Black);
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Color.SetColor(Color.Black);
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Color.SetColor(Color.Black);
            }
            else
            {
                if (Type.Equals("Medium"))
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.BorderAround(ExcelBorderStyle.Medium);
                else
                {
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Color.SetColor(Color.Black);
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(Color.Black);
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Color.SetColor(Color.Black);
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Color.SetColor(Color.Black);
                }
            }

        }
        public static void BorderColor(ExcelWorksheet sheetdata, int fromrow, int FromCol, int ToRow, int tocol, string color, string Type = null, string TypeInside = null)
        {
            if(Type == null)
            {
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Color.SetColor(ColorTranslator.FromHtml(color));
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml(color));
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Color.SetColor(ColorTranslator.FromHtml(color));
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Color.SetColor(ColorTranslator.FromHtml(color));
            }
            else
            {
                if (Type.Equals("Thin"))
                {
                    if (TypeInside == null)
                    {
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.BorderAround(ExcelBorderStyle.Thin, ColorTranslator.FromHtml(color));
                    }
                    else
                    {
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Color.SetColor(ColorTranslator.FromHtml("#C9C9C9"));
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml("#C9C9C9"));
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Color.SetColor(ColorTranslator.FromHtml(color));
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Color.SetColor(ColorTranslator.FromHtml(color));
                      
                        sheetdata.Cells[fromrow, FromCol, fromrow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                        sheetdata.Cells[fromrow, FromCol, fromrow, tocol].Style.Border.Top.Color.SetColor(ColorTranslator.FromHtml(color));
                        sheetdata.Cells[ToRow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                        sheetdata.Cells[ToRow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml(color));
                    }
                }
                else if (Type.Equals("Medium"))
                {
                    if (TypeInside == null)
                    {
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.BorderAround(ExcelBorderStyle.Medium, ColorTranslator.FromHtml(color));
                    }
                    else
                    {
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Color.SetColor(ColorTranslator.FromHtml("#C9C9C9"));
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml("#C9C9C9"));
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Color.SetColor(ColorTranslator.FromHtml(color));
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Style = ExcelBorderStyle.Thin;
                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Color.SetColor(ColorTranslator.FromHtml(color));

                        sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.BorderAround(ExcelBorderStyle.Medium, ColorTranslator.FromHtml(color));
                    }
                }
                else
                {
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Top.Color.SetColor(ColorTranslator.FromHtml(color));
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Bottom.Color.SetColor(ColorTranslator.FromHtml(color));
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Right.Color.SetColor(ColorTranslator.FromHtml(color));
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Style = ExcelBorderStyle.Dotted;
                    sheetdata.Cells[fromrow, FromCol, ToRow, tocol].Style.Border.Left.Color.SetColor(ColorTranslator.FromHtml(color));
                }
            }
            
        }

        public static void FormatCell(ExcelRange cell, string Backcolor, bool Bold = false, ExcelHorizontalAlignment Horizon = ExcelHorizontalAlignment.Left, string color = null)
        {
            cell.Style.Fill.PatternType = ExcelFillStyle.Solid;
            cell.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(Backcolor));
            cell.Style.Font.Bold = Bold;
            // can ngang
            cell.Style.HorizontalAlignment = Horizon;
            // can doc
            cell.Style.VerticalAlignment = ExcelVerticalAlignment.Center;

            if (color != null)
            {
                cell.Style.Font.Color.SetColor(ColorTranslator.FromHtml(color));
            }
        }
        public static object cellRequried(ExcelRange r)
        {
            try
            {
                if (r.Value.ToString().ToLower() == "y" || r.Value.ToString().ToLower() == "yes" || r.Value.ToString().ToLower() == "1")
                    return true;
                if (r.Value.ToString().ToLower() == "n" || r.Value.ToString().ToLower() == "no" || r.Value.ToString().ToLower() == "0")
                    return false;
                return false;
            }
            catch
            {
                return false;
            }
        }
        public static object cellAttendantType(ExcelRange r)
        {
            if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
            {
                if (r.Value.ToString().ToUpper().Replace(" ", "") == "CHECK-IN")
                    return 0;
                else if (r.Value.ToString().ToUpper().Replace(" ", "") == "CHECK-OUT")
                    return 1;
                else
                    return DBNull.Value;
            }
            else
                return DBNull.Value;
        }
        public static object cellString(ExcelRange r)
        {
            if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                return r.Value.ToString().Trim();
            return DBNull.Value;
        }
        public static object cellCode(ExcelRange r)
        {
            object res = DBNull.Value;
            if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
            {
                string Code = r.Value.ToString();
                while (Code.Contains(" "))
                    Code.Replace(" ", "");
                return Code;
            }
            return res;
        }

        public static void FormatCell_Language(ExcelRange excelRanges)
        {
            excelRanges.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            excelRanges.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
            excelRanges.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            excelRanges.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
            excelRanges.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
            excelRanges.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
            excelRanges.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            excelRanges.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);

        }

        public static object cellDecimal(ExcelRange r)
        {

            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                    return Convert.ToDecimal(r.Value.ToString());
                return DBNull.Value;
            }
            catch
            {
                return DBNull.Value;
            }
        }
        public static object cellLong(ExcelRange r)
        {

            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                    return Convert.ToInt64(r.Value.ToString());
                return DBNull.Value;
            }
            catch
            {
                return DBNull.Value;
            }
        }
        public static object cellInt(ExcelRange r)
        {

            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                    return Convert.ToInt32(r.Value.ToString());
                return DBNull.Value;
            }
            catch
            {
                return DBNull.Value;
            }
        }
        public static bool AsCode(string Code)
        {
            string C = Code;
            while (C.Contains(" "))
                C.Replace(" ", "");
            if (Code.Length < 2)
                return false;
            return true;
        }
        public static object cellDatetime(ExcelRange r)
        {
            object dt = DBNull.Value;
            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                    return Convert.ToDateTime(r.Value).ToString("yyyy-MM-dd HH:mm:ss");
                return dt;
            }
            catch
            {
                return dt;
            }
        }
        public static object cellDate(ExcelRange r)
        {
            object dt = DBNull.Value;
            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                    return Convert.ToDateTime(r.Value).ToString("yyyy-MM-dd");
                return dt;
            }
            catch
            {
                return dt;
            }
        }
        #endregion

    }
}
