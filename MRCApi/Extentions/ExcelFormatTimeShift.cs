using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ExcelFormatTimeShift
    {
        public static void BorderCell(ExcelRange excelRanges)
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
        public static void ColorCell(ExcelRange sheetdata, string color)
        {
            sheetdata.Style.Fill.PatternType = ExcelFillStyle.Solid;
            sheetdata.Style.Fill.BackgroundColor.SetColor(ColorTranslator.FromHtml(color)); 
        }

        public static DataTable TableTimeShift(string table)
        {
            DataTable data = new DataTable(table);
            DataColumn col1 = new DataColumn("ShopCode", typeof(string));
            DataColumn col3 = new DataColumn("CategoryCode", typeof(string));
            DataColumn col5 = new DataColumn("Shift", typeof(string));
            DataColumn col6 = new DataColumn("From", typeof(string));
            DataColumn col7= new DataColumn("To", typeof(string));
            DataColumn col8 = new DataColumn("From1", typeof(string));
            DataColumn col9 = new DataColumn("To1", typeof(string));
            DataColumn col10 = new DataColumn("FromDate");
            DataColumn col11 = new DataColumn("ToDate");

            data.Columns.Add(col1);
            data.Columns.Add(col3);
            data.Columns.Add(col5);
            data.Columns.Add(col6);
            data.Columns.Add(col7);
            data.Columns.Add(col8);
            data.Columns.Add(col9);
            data.Columns.Add(col10);
            data.Columns.Add(col11);

            return data;
        }

        public static string ReadData(ref DataTable data, ExcelWorksheet sheet,List<string> listShopCode)
        {
            string Alert = "";
            int end_row = sheet.Dimension.Rows;
            while (sheet.Cells[end_row, 1].Value == null)
            {
                end_row--;
            }
            for (int row = 4; row <= end_row; row++)
            {
                var ShopCode = sheet.Cells[row, 1].Value;
                var CategoryCode = sheet.Cells[row, 3].Value;
                var Shift = sheet.Cells[row, 5].Value;
                var From = sheet.Cells[row, 6].Value;
                var To = sheet.Cells[row, 7].Value;
                var From1 = sheet.Cells[row, 8].Value;
                var To1 = sheet.Cells[row, 9].Value;
                var FromDate = sheet.Cells[row, 10].Value;
                var ToDate = sheet.Cells[row, 11].Value;

                if(string.IsNullOrEmpty(Convert.ToString(ShopCode)) && string.IsNullOrEmpty(Convert.ToString(CategoryCode)) &&
                    string.IsNullOrEmpty(Convert.ToString(Shift)) && string.IsNullOrEmpty(Convert.ToString(From)) &&
                    string.IsNullOrEmpty(Convert.ToString(To)) && string.IsNullOrEmpty(Convert.ToString(From1)) &&
                    string.IsNullOrEmpty(Convert.ToString(To1)) && string.IsNullOrEmpty(Convert.ToString(FromDate)) &&
                    string.IsNullOrEmpty(Convert.ToString(ToDate))
                    )
                {
                    continue;
                }

                int check = 0;
                if (string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                {
                    Alert += "ShopCode không được để trống. (Row: " + row + " Colum: 1 )";
                }
                else
                {
                    foreach(var item in listShopCode)
                    {
                        if (item == ShopCode.ToString())
                        {
                            check++;
                        }
                    }
                    if(check == 0)
                    {
                        Alert += "ShopCode không tồn tại. (Row: " + row + " Colum: 1)";
                    }
                }
                if (string.IsNullOrEmpty(Convert.ToString(Shift)))
                {
                    Alert += "Shift không được để trống. (Row: " + row + " Colum: 5)";
                }
                if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                {
                    Alert += "FromDate không được để trống. (Row: " + row + " Colum: 10 )";
                }
                if (string.IsNullOrEmpty(Convert.ToString(From)))
                {
                    Alert += "From1 không được để trống. (Row: " + row + " Colum: 6 )";
                }
                if (string.IsNullOrEmpty(Convert.ToString(To)))
                {
                    Alert += "To1 không được để trống. (Row: " + row + " Colum: 7 )";
                }
                // check
                if (Alert.Length > 1)
                {
                    return Alert;
                }
                else
                {
                    DataRow dataRow = data.NewRow();
                    dataRow["ShopCode"] = ShopCode;
                    if (string.IsNullOrEmpty(Convert.ToString(CategoryCode)))
                    {
                        dataRow["CategoryCode"] = null;
                    }
                    else
                    {
                        dataRow["CategoryCode"] = CategoryCode;
                    }
                    dataRow["Shift"] = Shift;
           
                      
                    int fromDate_int;
                    DateTime fromDate_ = Convert.ToDateTime(FromDate);
                    fromDate_int = fromDate_.Year * 10000 + fromDate_.Month * 100 + fromDate_.Day;
                    dataRow["FromDate"] = Convert.ToInt32(fromDate_int);

                    if(string.IsNullOrEmpty(Convert.ToString(ToDate)))
                    {
                        dataRow["ToDate"] = null;
                    }
                    else
                    {
                        int toDate_int;
                        DateTime toDate_ = Convert.ToDateTime(ToDate);
                        toDate_int = toDate_.Year * 10000 + toDate_.Month * 100 + toDate_.Day;
                        dataRow["ToDate"] = Convert.ToInt32(toDate_int);
                    }
                    
                    dataRow["From"] = From;
                    dataRow["To"] = To;
                    if (string.IsNullOrEmpty(Convert.ToString(From1)))
                    {
                        dataRow["From1"] = null;
                    }
                    else
                    {
                        dataRow["From1"] = From1;
                    }
                    if (string.IsNullOrEmpty(Convert.ToString(To1)))
                    {
                        dataRow["To1"] = null;
                    }
                    else
                    {
                        dataRow["To1"] = To1;
                    }

                    data.Rows.Add(dataRow);
                }
            }
            return Alert;
        }



    }
}
