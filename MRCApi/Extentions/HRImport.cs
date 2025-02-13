

using OfficeOpenXml;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
namespace MRCApi.Extentions
{
    public class HRImport
    {
        public static DataTable dtCreate()
        {
            DataTable dtTemp = new DataTable();
            for (int n = 1; n < 17; n++)
            {
                DataColumn dc = new DataColumn("Col" + n);
                dtTemp.Columns.Add(dc);
            }
            return dtTemp;
        }
        public static void ReadData(ref DataTable dtData, ExcelWorksheet sheet)
        {
            int rowEnd = sheet.Dimension.Rows, colEnd = sheet.Dimension.Rows;
            int Step = 1;
            DataRow rowNew;
            for (int row = 5; row <= rowEnd; row++)
            {
                rowNew = dtData.NewRow();
                for (int col = 1; col <= colEnd; col++)
                {
                    if (col < 9)
                    {
                        rowNew[col] = sheet.Cells[row, col].Value;
                        Step = 1;
                    }
                    else
                    {
                        if (Step == 10)//Doc den nhom cuoi cung
                        {
                            dtData.Rows.Add(rowNew);
                            Step = 1;
                            //Reset new row
                            rowNew = dtData.NewRow();
                        }
                        else
                        {
                            var CellValue = sheet.Cells[row, col].Value;
                            rowNew[8 + Step] = CellValue;
                            Step++;
                        }
                    }
                }
            }
        }
    }
}
