using OfficeOpenXml;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ImportNotify
    {
        public static DataTable tableNotify(string TableName)
        {
            DataTable dataTable = new DataTable(TableName);
            DataColumn col1 = new DataColumn("Title", typeof(string));
            DataColumn col2 = new DataColumn("Body", typeof(string));
            DataColumn col3 = new DataColumn("HyperLinks", typeof(string));
            DataColumn col4 = new DataColumn("UserId", typeof(int));
            DataColumn col5 = new DataColumn("TypeReport", typeof(string));
            DataColumn col6 = new DataColumn("ImageUrl", typeof(string));
            dataTable.Columns.Add(col1); dataTable.Columns.Add(col2);
            dataTable.Columns.Add(col3); dataTable.Columns.Add(col4); dataTable.Columns.Add(col5); dataTable.Columns.Add(col6);
            return dataTable;
        }
        public static string ReadNotify(ref DataTable dt, List<EmployeeModel> employees, ExcelWorksheet sheet, string TableName)
        {
            string Alert = "";
            int e_row = sheet.Dimension.End.Row, e_col = sheet.Dimension.End.Column;
            int userId = 0;
            for (int row = 3; row <= e_row; row++)
            {
                var col_1 = sheet.Cells[row, 2].Value;
                var col_2 = sheet.Cells[row, 4].Value;
                var col_4 = sheet.Cells[row, 5].Value;
                var col_5 = sheet.Cells[row, 6].Value;
                var col_6 = sheet.Cells[row, 8].Value;
                var hyperLinks = sheet.Cells[row, 7].Value;
                var imageUrl = sheet.Cells[row, 8].Value;
                if (col_1 == null)
                {
                    Alert += " Mã nhân viên không được để trống dòng(" + row + " colum " + 2 + ")";
                }
                else
                {
                    var empcheck = (from e in employees
                                    where e.EmployeeCode == col_1.ToString()
                                    select e).FirstOrDefault();
                    if (empcheck == null || empcheck.Id == null)
                    {
                        Alert += " Mã nhân viên không hợp lệ (" + row + " colum " + 2 + ")";
                    }
                    else
                        userId = empcheck.Id.Value;
                }
                if (col_2 == null || col_2.ToString() == "" || col_2.ToString().Length < 4 || col_2.ToString().Length > 250)
                {
                    Alert += "Tiêu đề không được để trống hoặc quá ngắn (<4 kí tự) hoặc vượt quá 250 kí tự";
                }
                if (col_4 == null || col_4.ToString() == "" || col_4.ToString().Length < 4)
                {
                    Alert += "Nội dung không được để trống hoặc quá ngắn (<4 kí tự)";
                }
                if (col_5 == null || col_5.ToString() == "" || col_5.ToString().Length > 16)
                {
                    Alert += "Nhóm thông báo không được để trống hoặc vượt quá 16 kí tự";
                }
                if (Alert.Length > 2)
                {
                    return Alert;
                }
                else
                {
                    DataRow dr = dt.NewRow();
                    dr["UserId"] = userId;
                    dr["Title"] = col_2;
                    dr["Body"] = col_4;
                    dr["TypeReport"] = col_5;
                    if (string.IsNullOrEmpty(Convert.ToString(hyperLinks)))
                    {
                        dr["HyperLinks"] = null;
                    }
                    else
                    {
                        dr["HyperLinks"] = Convert.ToString(hyperLinks);
                    }
                    if (string.IsNullOrEmpty(Convert.ToString(imageUrl)))
                        dr["ImageUrl"] = null;
                    else
                        dr["ImageUrl"] = Convert.ToString(imageUrl);
                    dt.Rows.Add(dr);
                }
            }
            return Alert;
        }

    }
}
