using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class CustomerTargetController : SpiralBaseController
    {
        public readonly ICustomerTargetService _service;
        private readonly ICustomersService _CustomerService;
        private readonly IEmployeeTypesService _EmployeeTypeService;
        IWebHostEnvironment _FRoot;
        public CustomerTargetController(CustomerTargetContext _context, IWebHostEnvironment F, CustomersContext Cus, EmployeeTypeContext employeeTypeContext)
        {
            _service = new CustomerTargetService(_context);
            _FRoot = F;
            _CustomerService = new CustomersService(Cus);
            _EmployeeTypeService = new EmployeeTypesService(employeeTypeContext);
        }

        [HttpPost("Filter")]
        public ActionResult<ResultInfo> Filter([FromBody] string JsonData)
        {
            try
            {
                var data = Task.Run(() => _service.Filter(AccountId, UserId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No Data!", null, data.Result);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("Insert")]
        public ActionResult<ResultInfo> Insert([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(AccountId, UserId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Insert Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "Insert Failed!", null, data.Result);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("Update")]
        public ActionResult<ResultInfo> Update([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(AccountId, UserId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Update Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "Update Failed!", null, data.Result);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] int Id)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.Delete(AccountId, UserId, Id));
                if (data.Result > 0)
                {
                    return new ResultInfo(200, "Delete Successfully!", null);
                }
                else
                {
                    return new ResultInfo(500, "Delete Failed!", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);

            string folder = _FRoot.WebRootPath;
            string subfolder = "export/CustomerTarget";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Customer Target List_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_CustomerTarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, UserId, JsonData)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["CustomerTarget"];

                            sheet.Cells[4, 1].LoadFromDataTable(data.Tables[0], false);

                            ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                            sheet.Cells[4, 1, sheet.Dimension.End.Row, 1].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                            sheet.Cells[4, 8, sheet.Dimension.End.Row, 8].Style.Numberformat.Format = "0%";
                            sheet.Cells[4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        if (data.Tables[1].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Customer"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[1], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Position"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[2], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                        if (data.Tables[3].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Report"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[3], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                        pk.Save();
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template()
        {
            string folder = _FRoot.WebRootPath;
            string subfolder = "export/CustomerTarget";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template Customer Target List_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_CustomerTarget.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(AccountId, UserId, null)))
                {
                    using (var pk = new ExcelPackage(file))
                    {
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet = pk.Workbook.Worksheets["Customer"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[1], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }

                        if (data.Tables[2].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Position"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[2], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                        if (data.Tables[3].Rows.Count > 0)
                        {

                            var sheet = pk.Workbook.Worksheets["Report"];

                            sheet.Cells[3, 2].LoadFromDataTable(data.Tables[3], false);
                            sheet.Cells[3, 2, sheet.Dimension.End.Row, 2].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                            sheet.Cells[2, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            ExcelFormats.Border(sheet, 3, 2, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                        }
                        pk.Save();
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace.ToString());
            }
        }

        public class CustomerTarget_Import
        {
            public int CustomerId { get; set; }
            public int PositionId { get; set; }
            public string Report { get; set; }
            public Double Percent { get; set; }
            public Double Target { get; set; }
            public int FromDate { get; set; }
            public int ToDate { get; set; }
        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile)
        {
            string folder = _FRoot.WebRootPath;
            if (ifile != null && ifile.Files[0] != null)
            {
                var file = ifile.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        if (package != null && package.Workbook.Worksheets["CustomerTarget"] != null)
                        {
                            try
                            {
                                List<CustomerTarget_Import> dataImport = new List<CustomerTarget_Import>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["CustomerTarget"];

                                List<CustomersEntity> CustomerList = Task.Run(() => _CustomerService.GetList(AccountId)).Result;
                                List<EmployeeTypesEntity> EmployeeTypeList = Task.Run(() => _EmployeeTypeService.GetDynamic()).Result;
                                if (sheet != null)
                                {
                                    // Check data input
                                    #region Check data input
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        CustomerTarget_Import item = new CustomerTarget_Import();
                                        var CustomerCode = sheet.Cells[row, 2].Value;
                                        var AccountCode = sheet.Cells[row, 4].Value;
                                        var PositionName = sheet.Cells[row, 6].Value;
                                        var Report = sheet.Cells[row, 7].Value;
                                        var Percent = sheet.Cells[row, 8].Value;
                                        var Target = sheet.Cells[row, 9].Value;
                                        var FromDate = sheet.Cells[row, 10].Value;
                                        var ToDate = sheet.Cells[row, 11].Value;

                                        #region check
                                        DateTime checkDate;
                                        if (!string.IsNullOrEmpty(Convert.ToString(Percent)) 
                                            && string.IsNullOrEmpty(Convert.ToString(CustomerCode)) 
                                            && string.IsNullOrEmpty(Convert.ToString(AccountCode))
                                            && string.IsNullOrEmpty(Convert.ToString(Report)))
                                        {
                                             
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Percent))
                                            && string.IsNullOrEmpty(Convert.ToString(CustomerCode))
                                            && string.IsNullOrEmpty(Convert.ToString(AccountCode))
                                            && string.IsNullOrEmpty(Convert.ToString(Report)))
                                        {
                                            return new ResultInfo(500, "Percent : không được để trống (nếu đã để trống CustomerCode, AccountCode, Report) - Cell[" + row + ",8]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode))
                                            && (string.IsNullOrEmpty(Convert.ToString(AccountCode)) || string.IsNullOrEmpty(Convert.ToString(Report))))
                                        {
                                            return new ResultInfo(500, "AccountCode/Report : không được để trống (nếu đã nhập CustomerCode) - Cell[" + row + ",4]", "");
                                        }

                                        //if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode))
                                        //   && !string.IsNullOrEmpty(Convert.ToString(AccountCode))
                                        //   && string.IsNullOrEmpty(Convert.ToString(Report)))
                                        //{
                                        //    return new ResultInfo(500, "Report : không được để trống (nếu đã nhập CustomerCode) - Cell[" + row + ",4]", "");
                                        //}

                                        //if (string.IsNullOrEmpty(Convert.ToString(CustomerCode)))
                                        //{
                                        //    return new ResultInfo(500, "CustomerCode : không được để trống - Cell[" + row + ",2]", "");
                                        //}
                                        //if (string.IsNullOrEmpty(Convert.ToString(AccountCode)))
                                        //{
                                        //    return new ResultInfo(500, "AccountCode: không được để trống - Cell[" + row + ",4]", "");
                                        //}
                                        //if (string.IsNullOrEmpty(Convert.ToString(Report)))
                                        //{
                                        //    return new ResultInfo(500, "Report : không được để trống - Cell[" + row + ",7]", "");
                                        //}

                                        if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(500, "FromDate : không được để trống - Cell[" + row + ",10]", "");
                                        }
                                        else
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(FromDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(500, "FromDate : không đúng định dạng - Cell[" + row + ",10]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {
                                            if (!DateTime.TryParseExact(Convert.ToString(ToDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                return new ResultInfo(500, "ToDate : không đúng định dạng - Cell[" + row + ",11]", "");
                                            }
                                        }

                                        #endregion check

                                        #region add
                                        if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode)) && !string.IsNullOrEmpty(Convert.ToString(AccountCode)))
                                        {
                                            var tempCus = CustomerList.Where(c => c.CustomerCode == Convert.ToString(CustomerCode).Trim() && c.AccountCode == Convert.ToString(AccountCode).Trim()).FirstOrDefault();
                                            if (tempCus != null)
                                            {
                                                item.CustomerId = tempCus.Id;
                                            }
                                            else
                                            {
                                                return new ResultInfo(500, "CustomerCode/AccountCode : không tồn tại - Cell[" + row + ",2]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(PositionName)))
                                        {
                                            var tempEmpType = EmployeeTypeList.Where(e => e.TypeName.ToString().ToLower() == Convert.ToString(PositionName).Trim().ToString().ToLower()).FirstOrDefault();
                                            if (tempEmpType != null)
                                            {
                                                item.PositionId = tempEmpType.Id;
                                            }
                                            else
                                            {
                                                return new ResultInfo(500, "Position : không tồn tại - Cell[" + row + ",6]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Report))) item.Report = Convert.ToString(Report);
                                        if (!string.IsNullOrEmpty(Convert.ToString(Percent)))  item.Percent = Convert.ToDouble(Percent);
                                        if (!string.IsNullOrEmpty(Convert.ToString(Target))) item.Target = Convert.ToDouble(Target);

                                        if (!string.IsNullOrEmpty(Convert.ToString(FromDate))) {
                                            var keyFrom = FromDate.ToString().Split("-");
                                            if(keyFrom.Length == 3)
                                            {
                                                var tempFromDate = keyFrom[0] + keyFrom[1] + keyFrom[2];
                                                item.FromDate = Convert.ToInt32(tempFromDate);
                                            }
                                            else
                                            {
                                                return new ResultInfo(500, "FromDate : không đúng định dạng - Cell[" + row + ",10]", "");
                                            }
                                        }
                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {
                                            var keyTo = ToDate.ToString().Split("-");
                                            if (keyTo.Length == 3)
                                            {
                                                var tempToDate = keyTo[0] + keyTo[1] + keyTo[2];
                                                item.ToDate = Convert.ToInt32(tempToDate);
                                            }
                                            else
                                            {
                                                return new ResultInfo(500, "ToDate : không đúng định dạng - Cell[" + row + ",11]", "");
                                            }
                                        }

                                        #endregion add
                                        dataImport.Add(item);
                                    }
                                    #endregion Check data input

                                    // Send data import
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(AccountId, UserId, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(200, string.Format("Import Thành công: {0} dòng", dataImport.Count), "");
                                        }
                                    }

                                }
                                return new ResultInfo(500, "File rỗng", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), ex.StackTrace.ToString());
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "File rỗng", "");
        }
    }
}
