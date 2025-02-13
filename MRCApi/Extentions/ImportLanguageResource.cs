using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ImportLanguageResource
    {
        public static DataTable TableLanguageResource(string table)
        {
            DataTable data = new DataTable(table);
            DataColumn col1 = new DataColumn("ResourceName", typeof(string));
            DataColumn col2 = new DataColumn("VietnamValue", typeof(string));
            DataColumn col3 = new DataColumn("EnglishValue", typeof(string));
            data.Columns.Add(col1);
            data.Columns.Add(col2);
            data.Columns.Add(col3);
            return data;
        }

        public static string ReadData(ref DataTable data, ExcelWorksheet sheet)
        {
            string Alert = "";
            
            for(int row = 4; row <= sheet.Dimension.Rows; row++)
            {
                var col_1 = sheet.Cells[row, 1].Value;
                var col_2 = sheet.Cells[row, 2].Value;
                var col_3 = sheet.Cells[row, 3].Value;

                if(string.IsNullOrEmpty(Convert.ToString(col_1)) && string.IsNullOrEmpty(Convert.ToString(col_2)) &&
                    string.IsNullOrEmpty(Convert.ToString(col_3)))
                {
                    continue;
                }


                if (string.IsNullOrEmpty(Convert.ToString(col_1)))
                {
                    Alert += "ResourceName is not allowed to be empty. (Row: " + row + " Colum: " + 1 + ")";
                }
                if (string.IsNullOrEmpty(Convert.ToString(col_2)))
                {
                    Alert += "ResourceName is not allowed to be empty. (Row: " + row + " Colum: " + 2 + ")";
                }
                if (string.IsNullOrEmpty(Convert.ToString(col_3)))
                {
                    Alert += "ResourceName is not allowed to be empty. (Row: " + row + " Colum: " + 3 + ")";
                }

                if (Alert.Length > 1)
                {
                    return Alert;
                }
                else
                {
                    DataRow dataRow = data.NewRow();
                    dataRow["ResourceName"] = col_1;
                    dataRow["VietnamValue"] = col_2;
                    dataRow["EnglishValue"] = col_3;
                    data.Rows.Add(dataRow);
                }
            }
            return Alert;
        }
    }
}
