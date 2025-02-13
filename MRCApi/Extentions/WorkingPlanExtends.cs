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
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class WorkingPlanExtends
    {
        public static async Task<ResultInfo> Template_LLV_PGM(int AccountId, int userId, string jsonData, IWorkingPlanService service, string dataType, IWebHostEnvironment _webHostEnvironment, HostString host, string scheme)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/WorkingPlan";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Dang ky Lich Lam Viec_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/templateExcel/tmp_WorkingPlan.xlsx"));
            if (dataJson.Position == 2)
            {
                fileInfo = new FileInfo(Path.Combine(folder, "export/templateExcel/tmp_WorkingPlan_SS.xlsx"));
            }
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => service.Template_LLV_PGM(userId, jsonData, AccountId)))
                {
                    if (data.Tables[0].Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            var wsChangePlan = pk.Workbook.Worksheets["ChangePlan"];
                            pk.Workbook.Worksheets.Delete(wsChangePlan);
                            if (data.Tables[0].Rows.Count > 0)
                            {
                                var sheet = pk.Workbook.Worksheets["LLV"];
                                sheet.Cells[2, 5].Value = string.Format("Từ ngày: {0} - Đến ngày: {1}", dataJson.fromdate, dataJson.todate);

                                sheet.Cells[6, 1].LoadFromDataTable(data.Tables[0], true);

                                // Format DayName
                                string header = string.Empty;
                                int startColumn = 15;
                                if (dataJson.Position == 2) startColumn = startColumn + 2;
                                for (int c = startColumn; c <= sheet.Dimension.End.Column; c++)
                                {
                                    header = Convert.ToString(sheet.Cells[6, c].Value);
                                    string[] key = header.Split('_');
                                    if (key.Count() == 2)
                                    {
                                        sheet.Column(c).Width = 11.73;
                                        sheet.Cells[5, c].Value = key[0];
                                        sheet.Cells[6, c].Value = key[1];
                                        sheet.Cells[5, c].Style.Font.Color.SetColor(ColorTranslator.FromHtml("#FFFFFF"));
                                        ExcelFormats.FormatCell(sheet.Cells[5, c], "#305496", true, ExcelHorizontalAlignment.Center);
                                        ExcelFormats.FormatCell(sheet.Cells[6, c], "#FFE699", true, ExcelHorizontalAlignment.Center);

                                        if (sheet.Cells[5, c].Value.ToString() == "CN")
                                        {
                                            ExcelFormats.FormatCell(sheet.Cells[5, c], "#C65911", true, ExcelHorizontalAlignment.Center);
                                        }

                                    }

                                }

                                // Merge Header
                                sheet.Cells[4, startColumn, 4, sheet.Dimension.End.Column].Merge = true;
                                sheet.Cells[4, startColumn, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                                // Format Cell all
                                ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[4, startColumn, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();

                            }
                            else
                            {
                                return new ResultInfo(0, "Không có dữ liệu", "");
                            }

                            // Sheet 2
                            if (data.Tables[1].Rows.Count > 0)
                            {
                                var sheet = pk.Workbook.Worksheets["DS ca làm việc"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                                sheet.Cells[3, sheet.Dimension.Columns].Style.Font.Bold = true;
                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, sheet.Dimension.Columns], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                                // Format Cell all
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.Rows + 2, sheet.Dimension.Columns);

                            }

                            pk.Save();
                        }
                        return (new ResultInfo(1, "Xuất File mẫu thành công", string.Format("{0}://{1}/{2}/{3}", scheme, host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
            
        }
    }
}
