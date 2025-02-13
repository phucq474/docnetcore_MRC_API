using OfficeOpenXml;
using OfficeOpenXml.Style;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Text;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ExcelExtends
    {
        public static byte[] CreateExcelContent(DataTable data)
        {
            byte[] fileContents;
            using (var package = new ExcelPackage())
            {
                var worksheet = package.Workbook.Worksheets.Add("Sheet1");
                worksheet.Cells.LoadFromDataTable(data, true);
                worksheet.Cells[1, 10, 1, 100].Style.Border.Top.Style = ExcelBorderStyle.Hair;
                // So many things you can try but you got the idea.
                // Finally when you're done, export it to byte array.
                fileContents = package.GetAsByteArray();
            }
            return fileContents;
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
        public static object cellGender(ExcelRange r)
        {
            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                {
                    int v = 3;
                    switch (r.Value.ToString().ToLower())
                    {
                        case "female":
                            v = 1;
                            break;
                        case "male":
                            v = 2;
                            break;
                    }
                    return v;
                }
                return DBNull.Value;
            }
            catch
            {
                return DBNull.Value;
            }
        }
        public static object cellActive(ExcelRange r)
        {
            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                {
                    int v = 1;
                    switch (r.Value.ToString().ToLower())
                    {
                        case "active":
                            v = 1;
                            break;
                        case "inactive":
                            v = 0;
                            break;
                    }
                    return v;

                }
                return 1;
            }
            catch
            {
                return 0;
            }
        }

        public static object cellMarital(ExcelRange r)
        {
            try
            {
                if (r.Value != null && !string.IsNullOrEmpty(r.Value.ToString()))
                {
                    int? v = null;
                    switch (r.Value.ToString().ToLower())
                    {
                        case "single":
                            v = 1;
                            break;
                        case "married":
                            v = 2;
                            break;
                    }
                    return v;
                }
                return DBNull.Value;
            }
            catch
            {
                return DBNull.Value;
            }
        }
        public static string bodau(string accented)
        {
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = accented.Normalize(System.Text.NormalizationForm.FormD);
            return regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }
        public static string RemoveSpecialCharacters(string str)
        {
            StringBuilder sb = new StringBuilder();
            foreach (char c in str)
            {
                if ((c >= '0' && c <= '9') || (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || c == '.' || c == '_')
                {
                    sb.Append(c);
                }
            }
            return sb.ToString();
        }
    }
}
