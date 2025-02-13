using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ImportShopTarget
    {
        public static DataTable TableShopTarget(string table)
        {
            DataTable data = new DataTable(table);
            DataColumn col1 = new DataColumn("ShopCode", typeof(string));
            DataColumn col2 = new DataColumn("ShopNameVN", typeof(string));
            DataColumn col3 = new DataColumn("Area", typeof(string));
            DataColumn col4 = new DataColumn("ProvinceVN", typeof(string));
            DataColumn col5 = new DataColumn("EmployeeCode", typeof(string));
            DataColumn col6 = new DataColumn("FullName", typeof(string));
            DataColumn col7 = new DataColumn("Visit");
            DataColumn col8 = new DataColumn("Quantity");
            DataColumn col9 = new DataColumn("Amount");
            DataColumn col10 = new DataColumn("Year");
            DataColumn col11 = new DataColumn("Month");
      
           

            data.Columns.Add(col1);
            data.Columns.Add(col2);
            data.Columns.Add(col3);
            data.Columns.Add(col4);
            data.Columns.Add(col5);
            data.Columns.Add(col6);
            data.Columns.Add(col7);
            data.Columns.Add(col8);
            data.Columns.Add(col9);
            data.Columns.Add(col10);
            data.Columns.Add(col11);
           
            return data;
        }

        public static string ReadData(ref DataTable data, ExcelWorksheet sheet, List<string> listShopCode, List<string> listEmployeeCode)
        {
            string Alert = "";
            int end_row = sheet.Dimension.Rows;
            while (sheet.Cells[end_row, 1].Value == null)
            {
                end_row--;
            }
            for (int row = 4; row <= end_row; row++)
            {
                var cel_1 = sheet.Cells[row, 1].Value;
                var cel_2 = sheet.Cells[row, 2].Value;
                var cel_3 = sheet.Cells[row, 3].Value;
                var cel_4 = sheet.Cells[row, 4].Value;
                var cel_5 = sheet.Cells[row, 5].Value;
                var cel_6 = sheet.Cells[row, 6].Value;
                var cel_7 = sheet.Cells[row, 7].Value;
                var cel_8 = sheet.Cells[row, 8].Value;
                var cel_9 = sheet.Cells[row, 9].Value;
                var cel_10 = sheet.Cells[row, 10].Value;
                var cel_11 = sheet.Cells[row, 11].Value;
                int checkshop = 0;
                int checkemployee = 0;
                if (cel_1 == null || cel_1.ToString() == "")
                {
                    Alert += "Mã cửa hàng không được để trống. (Row: " + row + " Colum: " + 1 + ")";
                }
                else
                {
                    foreach (var item in listShopCode)
                    {
                        if (item == cel_1.ToString())
                        {
                            checkshop++;
                        }
                    }
                    if (checkshop == 0)
                    {
                        Alert += "Mã cửa hàng không tồn tại. (Row: " + row + " Colum: 1)";
                    }
                }
                if (cel_5 == null || cel_5.ToString() == "")
                {
                    Alert += "Mã nhân viên không được để trống. (Row: " + row + " Colum: " + 5 + ")";
                }
                else
                {
                    foreach (var item in listEmployeeCode)
                    {
                        if (item == cel_5.ToString())
                        {
                            checkemployee++;
                        }
                    }
                    if (checkemployee == 0)
                    {
                        Alert += "Mã nhân viên không tồn tại. (Row: " + row + " Colum: 5)";
                    }
                }
                if (cel_7 == null && cel_8 == null && cel_9 == null)
                {
                    Alert += "Visit, Số lượng, Tiền: không được để trống cả 3. (Row: " + row + " Colum: 7 - 8 - 9 )";
                }
                else
                {
                    if (cel_7 != null && Convert.ToInt32(cel_7) <= 0)
                    {
                        Alert += "Visit > 0. (Row: " + row + " Colum: 7)";
                    }
                    if (cel_8 != null && Convert.ToInt32(cel_8) <= 0)
                    {
                        Alert += "Số lượng > 0. (Row: " + row + " Colum: 8)";
                    }
                    if (cel_9 != null && Convert.ToDecimal(cel_9) <= 0)
                    {
                        Alert += "Số Tiền > 0. (Row: " + row + " Colum: 9)";
                    }
                }
                if (cel_10 == null || cel_10.ToString() == "")
                {
                    Alert += "Năm không được để trống. (Row: " + row + " Colum: " + 10 + ")";
                }
                if (cel_11 == null || cel_11.ToString() == "")
                {
                    Alert += "Tháng không được để trống. (Row: " + row + " Colum: " + 11 + ")";
                }
                if (Alert.Length > 1)
                {
                    return Alert;
                }
                else
                {
                    DataRow dataRow = data.NewRow();
                    //1
                    if (cel_1 == null || cel_1.ToString() == "")
                    {
                        dataRow["ShopCode"] = null;
                    }
                    else
                    {
                        dataRow["ShopCode"] = cel_1;
                    }
                    //2
                    if (cel_2 == null || cel_2.ToString() == "")
                    {
                        dataRow["ShopNameVN"] = null;
                    }
                    else
                    {
                        dataRow["ShopNameVN"] = cel_2;
                    }
                    //3
                    dataRow["Area"] = cel_3;
                    //4
                    if (cel_4 == null || cel_4.ToString() == "")
                    {
                        dataRow["ProvinceVN"] = null;
                    }
                    else
                    {
                        dataRow["ProvinceVN"] = cel_4;
                    }
                    //5
                    dataRow["EmployeeCode"] = cel_5;
                    //6 
                    dataRow["FullName"] = cel_6;
                    //7 
                    if (cel_7 == null || cel_7.ToString() == "")
                    {
                        dataRow["Visit"] = null;
                    }
                    else
                    {
                        dataRow["Visit"] = Convert.ToInt32(cel_7);
                    }
                    //8
                    if (cel_8 == null || cel_8.ToString() == "")
                    {
                        dataRow["Quantity"] = null;
                    }
                    else
                    {
                        dataRow["Quantity"] = Convert.ToInt32(cel_8);
                    }
                    //9 
                    if (cel_9 == null || cel_9.ToString() == "")
                    {
                        dataRow["Amount"] = null;
                    }
                    else
                    {
                        dataRow["Amount"] = Convert.ToDecimal(cel_9);
                    }
                    //10
                    dataRow["Year"] = Convert.ToInt32(cel_10);
                    //11
                    dataRow["Month"] = Convert.ToInt32(cel_11);

                    data.Rows.Add(dataRow);
                }
            }
            return Alert;
        }
    }
}
