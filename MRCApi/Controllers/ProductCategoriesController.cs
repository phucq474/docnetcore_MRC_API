using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class ProductCategoriesController : SpiralBaseController
    {
        private readonly IProductCategoriesService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public ProductCategoriesController (ProductCategoriesContext context, IWebHostEnvironment webHost)
        {
            _service = new ProductCategoriesService(context);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("GetList")]
        public ActionResult<List<ProductCategoriesEntity>> GetList([FromHeader] int? accId)
        {
            List<ProductCategoriesEntity> data = _service.GetList(accId ?? AccountId);
            return data;
        }
        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(AccountId, JsonData));
                return data.Result;
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"ProductCategories_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_ProductCategory.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.Export(AccountId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets["Category"];
                        if (sheet != null)
                        {
                            if (data.Rows.Count > 0)
                            {
                                ExcelFormatTimeShift.BorderCell(sheet.Cells[4, 1, data.Rows.Count + 3, data.Columns.Count]);
                                //load data
                                sheet.Cells[4, 1].LoadFromDataTable(data, false);
                            }
                            else
                            {
                                return (new ResultInfo(-1, "No data", null));
                            }
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return (new ResultInfo(-2, ex.Message, null));
            }
        }
        [HttpGet("Template")]
        public ResultInfo Template()
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template ProductCategories_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_ProductCategory.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            return (new ResultInfo(1, "Xuất Template thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
        }

        public class ImportModel
        {
            public int? Id { get; set; }
            public string Division { get; set; }
            public string Brand { get; set; }
            public string BrandVN { get; set; }
            public string Category { get; set; }
            public string CategoryVN { get; set; }
            public string SubCategory { get; set; }
            public string SubCategoryVN { get; set; }
            public string Variant { get; set; }
            public int? SortList { get; set; }
        }

        [HttpPost("Import")]
        public async Task<ActionResult<ResultInfo>> Import([FromForm] IFormCollection ifile)
        {
            string folder = _webHostEnvironment.WebRootPath;
            if (ifile != null && ifile.Files.Count > 0)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage packpage = new ExcelPackage(memoryStream))
                    {
                        if (packpage != null && packpage.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                List<ImportModel> dataImport = new List<ImportModel>();
                                ExcelWorksheet sheet = packpage.Workbook.Worksheets["Category"];

                                if (sheet != null)
                                {
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        ImportModel item = new ImportModel();
                                        var Id = sheet.Cells[row, 2].Value;
                                        var Division = sheet.Cells[row, 4].Value;
                                        var Brand = sheet.Cells[row, 6].Value;
                                        var BrandVN = sheet.Cells[row, 7].Value;
                                        var Category = sheet.Cells[row, 9].Value;
                                        var CategoryVN = sheet.Cells[row, 10].Value;
                                        var SubCategory = sheet.Cells[row, 12].Value;
                                        var SubCategoryVN = sheet.Cells[row, 13].Value;
                                        var Variant = sheet.Cells[row, 15].Value;
                                        var SortList = sheet.Cells[row, 16].Value;

                                        if (string.IsNullOrEmpty(Convert.ToString(Division)))
                                        {
                                            return new ResultInfo(0, string.Format("Division không được để trống Cell[{0},4]", row), ""); 
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Brand)))
                                        {
                                            return new ResultInfo(0, string.Format("Brand không được để trống Cell[{0},6]", row), "");
                                        }

                                        // add 
                                        if (string.IsNullOrEmpty(Convert.ToString(Id)))
                                        {
                                            item.Id = null;
                                        }
                                        else
                                        {
                                            item.Id = Convert.ToInt32(Id);
                                        }
                                        if (string.IsNullOrEmpty(Convert.ToString(SortList)))
                                        {
                                            item.SortList = null;
                                        }
                                        else
                                        {
                                            item.SortList = Convert.ToInt32(SortList);
                                        }

                                        item.Division = Convert.ToString(Division);
                                        item.Brand = Convert.ToString(Brand);
                                        item.BrandVN = Convert.ToString(BrandVN);
                                        item.Category = Convert.ToString(Category); 
                                        item.CategoryVN = Convert.ToString(CategoryVN);
                                        item.SubCategory = string.IsNullOrEmpty(Convert.ToString(SubCategory)) ? null: Convert.ToString(SubCategory);
                                        item.SubCategoryVN = string.IsNullOrEmpty(Convert.ToString(SubCategoryVN)) ? null : Convert.ToString(SubCategoryVN);
                                        item.Variant = string.IsNullOrEmpty(Convert.ToString(Variant)) ? null : Convert.ToString(Variant);

                                        dataImport.Add(item);
                                    }
                                    if (dataImport.Count > 0)
                                    {
                                        string jsondata = JsonConvert.SerializeObject(dataImport);
                                        var value = Task.Run(() => _service.Import(AccountId, jsondata)).Result;
                                        if (value > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} row", dataImport.Count), null);
                                        }
                                    }
                                }
                                return (new ResultInfo(-1, "Data is empty", null));
                            }
                            catch (Exception ex)
                            {
                                return (new ResultInfo(-2, ex.Message, null));
                            }
                        }
                    }
                }
                return (new ResultInfo(-1, "Data is empty", null));
            }
            else
            {
                return (new ResultInfo(-1, "File not found", null));
            }
        }
    }
}
