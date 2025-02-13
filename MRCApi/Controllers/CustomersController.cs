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
using SpiralEntity.Models;

namespace MRCApi.Controllers
{
    public class CustomersController : SpiralBaseController
    {
        private readonly ICustomersService _service;
        private readonly IChannelService _serviceChannel;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public CustomersController(CustomersContext _context, IWebHostEnvironment webHost, ChannelContext channelContext)
        {
            _service = new CustomersService(_context);
            _serviceChannel = new ChannelService(channelContext);
            this._webHostEnvironment = webHost;
        }
        [HttpGet("GetList")]
        public ActionResult<List<CustomersEntity>> GetList([FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            var data = _service.GetList(accId.Value);
            return data;
        }
        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter([FromBody] string JsonData, [FromHeader] int? accId)
        {
            Task<DataTable> data = Task.Run(() => _service.Filter(accId ?? AccountId, JsonData));
            return data.Result;
        }
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Insert(accId ?? AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
        [HttpPost("Update")]
        public ActionResult<DataTable> Update([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Update(accId ?? AccountId, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }

        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/customer";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = string.Format("Danh sách Customers _{0}.xlsx", DateTime.Now.ToString("yyyyMMdd_HHmmss"));
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Customers.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(accId ?? AccountId, JsonData)))
                {
                    if (data.Tables.Count > 0)
                    {
                        using (var package = new ExcelPackage(file))
                        {
                            if (data.Tables[0].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Customers"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                                sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                                sheet.Column(7).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                                sheet.Cells[4, sheet.Dimension.End.Column - 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            }
                            else
                            {
                                return new ResultInfo(0, "Không có dữ liệu", "");
                            }

                            if (data.Tables[1].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Parent"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            }

                            if (data.Tables[2].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Account"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[2], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[2].Columns.Count], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            }

                            if (data.Tables[3].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Channel"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[3], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[3].Columns.Count], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            }
                            package.Save();
                        }
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template([FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/customer";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = string.Format("Đăng ký Customers _{0}.xlsx", DateTime.Now.ToString("yyyyMMdd_HHmmss"));
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Customers.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (DataSet data = await Task.Run(() => _service.Export( accId ?? AccountId, null)))
                {
                    if (data.Tables.Count > 0)
                    {
                        using (var package = new ExcelPackage(file))
                        {

                            var sheet1 = package.Workbook.Worksheets["DS Customers"];
                            sheet1.Cells[3, 1].LoadFromDataTable(data.Tables[0], true);

                            ExcelFormats.FormatCell(sheet1.Cells[3, 1, 3, data.Tables[0].Columns.Count], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet1, 3, 1, sheet1.Dimension.End.Row, sheet1.Dimension.End.Column);

                            if (data.Tables[1].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Parent"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            }

                            if (data.Tables[2].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Account"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[2], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[2].Columns.Count], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            }

                            if (data.Tables[3].Rows.Count > 0)
                            {
                                var sheet = package.Workbook.Worksheets["DS Channel"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[3], true);

                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, data.Tables[3].Columns.Count], "#A9D08E", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            }

                            package.Save();
                        }
                        return (new ResultInfo(1, "Xuất File mẫu thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        public class CustomerImport
        {
            public string CustomerCode { get; set; }
            public string CustomerName { get; set; }
            public int ParentId { get; set; }
            public int? account_Id { get; set; }
            public string AccountCode { get; set; }
            public string AccountName { get; set; }
            public int? OrderBy { get; set; }
            public int? ChannelId { get; set; }
            public string Status { get; set; }
        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            string folder = _webHostEnvironment.WebRootPath;
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
                        if (package != null && package.Workbook.Worksheets["DS Customers"] != null)
                        {
                            try
                            {
                                List<CustomerImport> dataImport = new List<CustomerImport>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["DS Customers"];
                                List<CustomersEntity> listCus = _service.GetList(accId ?? AccountId);
                                List<ChannelEntity> lisChannel = _serviceChannel.GetList(accId ?? AccountId);
                                var listAccount = _service.GetAccountList(accId ?? AccountId).Result;
                                if (sheet != null)
                                {

                                    // Check data input
                                    #region Check data input
                                    for (int row = 4; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        CustomerImport item = new CustomerImport();
                                        var Channel = sheet.Cells[row, 2].Value;
                                        var ParentCode = sheet.Cells[row, 3].Value;
                                        var CustomerCode = sheet.Cells[row, 5].Value;
                                        var CustomerName = sheet.Cells[row, 6].Value;
                                        var account_Id = sheet.Cells[row, 7].Value;
                                        var AccountCode = sheet.Cells[row, 8].Value;
                                        var AccountName = sheet.Cells[row, 9].Value;
                                        var OrderBy = sheet.Cells[row, 10].Value;
                                        var Status = sheet.Cells[row, 11].Value;


                                        #region check
                                        if (!string.IsNullOrEmpty(Convert.ToString(Channel)))
                                        {
                                            var tmp = lisChannel.Where(p => p.ChannelName == Convert.ToString(Channel)).FirstOrDefault();
                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "Channel Name: không tồn tại - Cell[" + row + ",2]", "");
                                            }
                                            else
                                            {
                                                item.ChannelId = tmp.Id;
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ParentCode)))
                                        {
                                            var check = listCus.Where(p => p.CustomerCode == Convert.ToString(ParentCode)).FirstOrDefault();
                                            if (check == null)
                                            {
                                                return new ResultInfo(0, "Parent Code: không tồn tại - Cell[" + row + ",3]", "");
                                            }
                                            else
                                            {
                                                item.ParentId = check.Id;
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode)))
                                        {
                                            item.CustomerCode = Convert.ToString(CustomerCode);
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "CustomerCode: không được để trống - Cell[" + row + ",5]", "");
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(CustomerName)))
                                        {
                                            item.CustomerName = Convert.ToString(CustomerName);
                                        }
                                        else
                                        {
                                            return new ResultInfo(0, "CustomerName: không được để trống - Cell[" + row + ",6]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(account_Id)))
                                        {
                                            if ((!string.IsNullOrEmpty(Convert.ToString(AccountCode))) && (string.IsNullOrEmpty(Convert.ToString(AccountName))))
                                            {
                                                return new ResultInfo(0, "AccountName: không được để trống khi đã điền AccountCode - Cell[" + row + ",9]", "");
                                            }
                                            if ((string.IsNullOrEmpty(Convert.ToString(AccountCode))) && (!string.IsNullOrEmpty(Convert.ToString(AccountName))))
                                            {
                                                return new ResultInfo(0, "AccountCode: không được để trống khi đã điền AccountName - Cell[" + row + ",8]", "");
                                            }

                                            if ((!string.IsNullOrEmpty(Convert.ToString(AccountCode))) && (!string.IsNullOrEmpty(Convert.ToString(AccountName))))
                                            { 
                                                int tmpId = 0;
                                                string tmpCode = null;
                                                string tmpName = null;
                                                for (int i = 0; i < listAccount.Rows.Count; i++)
                                                {
                                                    if (Convert.ToString(listAccount.Rows[i]["Code"]).ToUpper() == Convert.ToString(AccountCode).ToUpper() 
                                                        && Convert.ToString(listAccount.Rows[i]["Name"]).ToUpper() == Convert.ToString(AccountName).ToUpper())
                                                    {
                                                        tmpId = Convert.ToInt32(listAccount.Rows[i]["Id"]);
                                                        tmpCode = Convert.ToString(listAccount.Rows[i]["Code"]);
                                                        tmpName = Convert.ToString(listAccount.Rows[i]["Name"]);
                                                        break;
                                                    }
                                                }

                                                if (tmpId > 0)
                                                {
                                                    item.account_Id = tmpId;
                                                    item.AccountCode = tmpCode;
                                                    item.AccountName = tmpName;
                                                }
                                                else
                                                {
                                                    item.AccountCode = Convert.ToString(AccountCode);
                                                    item.AccountName = Convert.ToString(AccountName);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            int tmpId = 0;
                                            string tmpCode = null;
                                            string tmpName = null;
                                            for (int i = 0; i < listAccount.Rows.Count; i++)
                                            {
                                                if (Convert.ToInt32(listAccount.Rows[i]["Id"].ToString()) == Convert.ToInt32(account_Id))
                                                {
                                                    tmpId = Convert.ToInt32(listAccount.Rows[i]["Id"]);
                                                    tmpCode = Convert.ToString(listAccount.Rows[i]["Code"]);
                                                    tmpName = Convert.ToString(listAccount.Rows[i]["Name"]);
                                                    break;
                                                }
                                            }

                                            if (tmpId > 0)
                                            {
                                                item.account_Id = tmpId;
                                                item.AccountCode = tmpCode;
                                                item.AccountName = tmpName;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "AccountId: không tồn tại - Cell[" + row + ",7]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(OrderBy)))
                                        {
                                            item.OrderBy = Convert.ToInt32(OrderBy);
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Status)))
                                        {
                                            item.Status = Convert.ToString(Status);
                                        }

                                        dataImport.Add(item);
                                        #endregion check
                                    }
                                    #endregion Check data input

                                    // Send data import
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(accId ?? AccountId, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} rows", dataImport.Count), "");
                                        }
                                    }

                                }
                                return new ResultInfo(0, "Dữ liệu rỗng", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), "");
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "Dữ liệu rỗng", "");
        }

        [HttpPost("NewCustomer/Filter")]
        public async Task<ResultInfo> NewCustomer_Filter([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.NewCustomer_Filter(accId ?? AccountId, UserId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No Data!", null);

                }

            }
            catch(Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            } 
        }
        [HttpPost("NewCustomer/Filter/Detail")]
        public async Task<ResultInfo> NewCustomer_Filter_Detail([FromHeader] int Id, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.NewCustomer_Filter_Detail(accId ?? AccountId, UserId, Id));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Get List Successfully!", null, data.Result);
                }
                else
                {
                    return new ResultInfo(500, "No Data!", null);

                }

            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("NewCustomer/Export")]
        public async Task<ResultInfo> NewCustomer_Export([FromBody] string JsonData, [FromHeader] int? accId)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/customer";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = string.Format("New Customers List_{0}.xlsx", DateTime.Now.ToString("yyyyMMdd_HHmmss"));
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_NewCustomer.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            try
            {
                using (DataTable data = await Task.Run(() => _service.NewCustomer_Export(accId ?? AccountId, UserId, JsonData)))
                {
                    if (data.Rows.Count > 0)
                    {
                        using (var package = new ExcelPackage(file))
                        {
                            
                            var sheet = package.Workbook.Worksheets["DS"];
                            sheet.Cells[2, 3].Value = dataJson.fromdate;
                            sheet.Cells[2, 5].Value = dataJson.todate;
                            sheet.Cells[3, 1].LoadFromDataTable(data, true);

                            ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, sheet.Dimension.End.Column], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                            ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                            sheet.Cells[4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();
                            sheet.Column(1).Style.HorizontalAlignment = OfficeOpenXml.Style.ExcelHorizontalAlignment.Center;
                            package.Save();
                        }
                        return (new ResultInfo(1, "Xuất File thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                    }
                    else
                    {
                        return new ResultInfo(0, "Không có dữ liệu", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpGet("GetAccountList")]
        public ActionResult<DataTable> GetAccountList([FromHeader] int? accId)
        {
            var data = _service.GetAccountList(accId ?? AccountId);
            return data.Result;
        }
    }
}
