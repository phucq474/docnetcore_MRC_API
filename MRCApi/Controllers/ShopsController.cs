using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
//using Microsoft.AspNetCore.Hosting.Internal;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    [ApiController]
    public class ShopsController : SpiralBaseController
    {
        public readonly IShopService _service;
        public readonly IRegionService _regionService;
        public readonly ICustomersService _customerService;
        public readonly IChannelService _channelService;
        public readonly ISuppliersService _supplierService;
        public readonly IAccountService _accountService;

        IWebHostEnvironment _webHostEnvironment;
        public ShopsController(ShopContext _context, RegionContext _rgContext, IWebHostEnvironment F, CustomersContext customersContext, ChannelContext channelContext, SuppliersContext suppliersContext, AccountContext accountContext)
        {
            _service = new ShopService(_context);
            _regionService = new RegionService(_rgContext);
            _customerService = new CustomersService(customersContext);
            _channelService = new ChannelService(channelContext);
            _supplierService = new SuppliersService(suppliersContext);
            _accountService = new AccountService(accountContext);
            this._webHostEnvironment = F;
        }
        [HttpGet("GetShops")]
        public async Task<List<ShopDDLModel>> GetShops([FromHeader] string json, [FromHeader] int? accId)
        {
            var result = new List<ShopDDLModel>();
            try
            {
                accId = accId ?? AccountId;
                var lst = await _service.GetShopByEmployee(UserId, json, accId.Value);
                if (lst != null)
                    return lst;
                else
                {
                    result.Add(new ShopDDLModel { ShopId = 0, ShopName = "Nodata" });
                    return result;
                }
            }
            catch (Exception ex)
            {
                result.Add(new ShopDDLModel { ShopId = 0, ShopName = "Lỗi  " + ex.Message });
                return result;
            }
        }
        [HttpGet("GetList")]
        public ActionResult<List<ShopsEntity>> GetList([FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            List<ShopsEntity> data = _service.GetList(accId.Value);
            return data;
        }
        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                accId = accId ?? AccountId;
                Task<DataTable> data = Task.Run(() => _service.Filter(accId.Value, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
        [HttpPost("Insert")]
        public ActionResult<DataTable> Insert([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                accId = accId ?? AccountId;
                Task<DataTable> data = Task.Run(() => _service.Insert(accId.Value, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message.ToString());
            }
        }
        [HttpPost("Update")]
        public ActionResult<ResultTableInfo> Update([FromBody] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                accId = accId ?? AccountId;
                Task<DataTable> data = Task.Run(() => _service.Update(accId.Value, JsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return new ResultTableInfo(200, "Update Successfully!", data.Result);
                }
                else
                    return new ResultTableInfo(500, "Update Failed!", null);
            }
            catch (Exception ex)
            {
                return new ResultTableInfo(500, ex.Message, null);
            }
        }
        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData, [FromHeader] string accountName, [FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"DS Cửa hàng _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Shops.xlsx"));
            if (accountName == "MARICO MT") fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Shops_MRC.xlsx"));

            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(accId.Value, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet1 = package.Workbook.Worksheets["DS Cửa hàng"];
                            ExcelFormatTimeShift.BorderCell(sheet1.Cells[5, 1, data.Tables[0].Rows.Count + 4, data.Tables[0].Columns.Count]);
                            sheet1.Cells[5, 1].LoadFromDataTable(data.Tables[0], false);
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }
                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["Chuỗi"];
                            ExcelFormatTimeShift.BorderCell(sheet2.Cells[4, 2, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count + 1]);
                            sheet2.Cells[4, 2].LoadFromDataTable(data.Tables[1], false);
                        }
                        // sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["Loại cửa hàng"];
                            ExcelFormatTimeShift.BorderCell(sheet3.Cells[4, 2, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count + 1]);
                            sheet3.Cells[4, 2].LoadFromDataTable(data.Tables[2], false);
                        }
                        // sheet 4
                        if (data.Tables[3].Rows.Count > 0)
                        {
                            var sheet4 = package.Workbook.Worksheets["Khu vực"];
                            ExcelFormatTimeShift.BorderCell(sheet4.Cells[4, 2, data.Tables[3].Rows.Count + 3, data.Tables[3].Columns.Count + 1]);
                            sheet4.Cells[4, 2].LoadFromDataTable(data.Tables[3], false);
                        }

                        ////Sheet Supplier
                        //if (data.Tables[4].Rows.Count > 0)
                        //{
                        //    var sheet5 = package.Workbook.Worksheets["Nhà phân phối"];
                        //    ExcelFormats.Border(sheet5, 4, 2, data.Tables[4].Rows.Count + 3, data.Tables[4].Columns.Count + 1);
                        //    sheet5.Cells[4, 2].LoadFromDataTable(data.Tables[4], false);
                        //}

                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template([FromHeader] string accountName, [FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Đăng ký DS Cửa hàng_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Shops.xlsx"));
            if (accountName == "MARICO MT") fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Template_Shops_MRC.xlsx"));

            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export(accId.Value, UserId, null)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        // sheet Customers
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets["Chuỗi"];
                            ExcelFormatTimeShift.BorderCell(sheet2.Cells[4, 2, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count + 1]);
                            sheet2.Cells[4, 2].LoadFromDataTable(data.Tables[1], false);
                        }
                        // sheet Channel
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet3 = package.Workbook.Worksheets["Loại cửa hàng"];
                            ExcelFormatTimeShift.BorderCell(sheet3.Cells[4, 2, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count + 1]);
                            sheet3.Cells[4, 2].LoadFromDataTable(data.Tables[2], false);
                        }
                        // sheet Province
                        if (data.Tables[3].Rows.Count > 0)
                        {
                            var sheet4 = package.Workbook.Worksheets["Khu vực"];
                            ExcelFormatTimeShift.BorderCell(sheet4.Cells[4, 2, data.Tables[3].Rows.Count + 3, data.Tables[3].Columns.Count + 1]);
                            sheet4.Cells[4, 2].LoadFromDataTable(data.Tables[3], false);
                        }
                        ////Sheet Supplier
                        //if (data.Tables[4].Rows.Count > 0)
                        //{
                        //    var sheet5 = package.Workbook.Worksheets["Nhà phân phối"];
                        //    ExcelFormats.Border(sheet5, 4, 2, data.Tables[4].Rows.Count + 3, data.Tables[4].Columns.Count + 1);
                        //    sheet5.Cells[4, 2].LoadFromDataTable(data.Tables[4], false);
                        //}


                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            var acc = _accountService.GetListAccount(Convert.ToInt32(accId), UserId).Result;

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
                        if (package != null && package.Workbook.Worksheets["DS Cửa hàng"] != null)
                        {
                            try
                            {
                                List<ShopModel> dataImport = new List<ShopModel>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["DS Cửa hàng"];

                                List<CustomersEntity> customersList = _customerService.GetList(accId.Value);
                                List<RegionEntity> regionsList = _regionService.GetList(accId.Value);
                                List<ChannelEntity> channelList = _channelService.GetList(accId.Value);
                                //List<SuppliersEntity> suppliersList = await Task.Run(() => _supplierService.GetList(AccountId));

                                if (sheet != null)
                                {

                                    for (int row = 5; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        ShopModel item = new ShopModel();
                                        //var SupplierCode = sheet.Cells[row, 2].Value;
                                        var CustomerCode = sheet.Cells[row, 2].Value;
                                        var AccountCode = sheet.Cells[row, 4].Value;
                                        var AccountName = sheet.Cells[row, 5].Value;
                                        var ChannelCode = sheet.Cells[row, 6].Value;
                                        var CodeKH = sheet.Cells[row, 8].Value;
                                        var ShopCode = sheet.Cells[row, 9].Value;
                                        var ShopName = sheet.Cells[row, 10].Value;
                                        var Address = sheet.Cells[row, 11].Value;
                                        var ProvinceId = sheet.Cells[row, 13].Value;
                                        var DistrictId = sheet.Cells[row, 15].Value;
                                        var TownId = sheet.Cells[row, 17].Value;
                                        var Latitude = sheet.Cells[row, 19].Value;
                                        var Longitude = sheet.Cells[row, 20].Value;
                                        var Accuracy = sheet.Cells[row, 21].Value;
                                        var ClosedDate = sheet.Cells[row, 22].Value;
                                        var Frequency = sheet.Cells[row, 23].Value;
                                        var Status = sheet.Cells[row, 24].Value;
                                        //var StoreType = sheet.Cells[row, 9].Value;

                                        if (!string.IsNullOrEmpty(Convert.ToString(CustomerCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(CustomerCode)))
                                        {
                                            var tmp = customersList.Where(p => p.CustomerCode == Convert.ToString(CustomerCode)).FirstOrDefault();
                                            if (!string.IsNullOrEmpty(Convert.ToString(AccountCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(AccountCode))
                                                && !string.IsNullOrEmpty(Convert.ToString(AccountName)) && !string.IsNullOrWhiteSpace(Convert.ToString(AccountName)))
                                            {
                                                tmp = customersList.Where(p => p.CustomerCode == Convert.ToString(CustomerCode) && p.AccountCode == Convert.ToString(AccountCode) && p.AccountName == Convert.ToString(AccountName)).FirstOrDefault();
                                            }
                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "Mã Chuỗi: không tồn tại - Cell[" + row + ",2] hoặc " + "Mã ACC: không tồn tại - Cell[" + row + ", 4] hoặc " + "Tên ACC: không tồn tại - Cell[" + row + ", 5]", "");
                                            }
                                            else
                                            {
                                                item.CustomerId = tmp.Id;
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ChannelCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(ChannelCode)))
                                        {
                                            ChannelEntity tmp = channelList.Where(p => p.ChannelCode == Convert.ToString(ChannelCode)).FirstOrDefault();
                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "Mã Loại cửa hàng: không tồn tại - Cell[" + row + ",6]", "");
                                            }
                                            else
                                            {
                                                item.ChannelId = tmp.Id;
                                            }
                                        }

                                        //if (!string.IsNullOrEmpty(Convert.ToString(SupplierCode)) && !string.IsNullOrWhiteSpace(Convert.ToString(SupplierCode)))
                                        //{
                                        //    var tmp = suppliersList.Where(p => p.SupplierCode == Convert.ToString(SupplierCode)).FirstOrDefault();
                                        //    if (tmp == null)
                                        //    {
                                        //        return new ResultInfo(0, "Mã NPP: không tồn tại - Cell[" + row + ",2]", "");
                                        //    }
                                        //    else
                                        //    {
                                        //        item.SupplierId = tmp.Id;
                                        //    }
                                        //}

                                        //if (string.IsNullOrEmpty(StoreType.ToString()) || string.IsNullOrWhiteSpace(StoreType.ToString()))
                                        //{
                                        //    return new ResultInfo(0, "Kênh: không được để trống - Cell[" + row + ",9]", "");
                                        //}
                                        //else
                                        //{
                                        //    if (!StoreType.ToString().ToLower().Equals("mt") && !StoreType.ToString().ToLower().Equals("al"))
                                        //        return new ResultInfo(0, "Kênh: không hợp lệ - Cell[" + row + ",9]", "");
                                        //}

                                        if (string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                                        {
                                            return new ResultInfo(0, "Mã cửa hàng: không được để trống - Cell[" + row + ",8]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ShopName)))
                                        {
                                            return new ResultInfo(0, "Tên cửa hàng: không được để trống - Cell[" + row + ",9]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(Address)))
                                        {
                                            return new ResultInfo(0, "Địa chỉ: không được để trống - Cell[" + row + ",10]", "");
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ProvinceId)))
                                        {
                                            return new ResultInfo(0, "ProvinceId không được để trống - Cell[" + row + ",12]", "");
                                        }
                                        else
                                        {
                                            var tmpPro = regionsList.Where(p => p.ProvinceCode == Convert.ToString(ProvinceId) && p.DistrictId is null && p.TownId is null).FirstOrDefault();
                                            if (!string.IsNullOrEmpty(Convert.ToString(DistrictId)))
                                            {
                                                tmpPro = regionsList.Where(p => p.ProvinceCode == Convert.ToString(ProvinceId) && p.DistrictId == Convert.ToInt32(DistrictId) && p.TownId is null).FirstOrDefault();
                                                if (!string.IsNullOrEmpty(Convert.ToString(TownId)))
                                                {
                                                    tmpPro = regionsList.Where(p => p.ProvinceCode == Convert.ToString(ProvinceId) && p.DistrictId == Convert.ToInt32(DistrictId) && p.TownId == Convert.ToInt32(TownId)).FirstOrDefault();
                                                }
                                            }

                                            if (tmpPro == null)
                                            {
                                                return new ResultInfo(0, "ProvinceCode || DistrictId || TownId không tồn tại - Cell[" + row + ",12]", "");
                                            }
                                            else
                                            {
                                                item.ProvinceId = tmpPro.Id;
                                            }

                                        }

                                        //if (string.IsNullOrEmpty(Convert.ToString(ProvinceId)))
                                        //{
                                        //    return new ResultInfo(0, "Mã Tỉnh: không được để trống - Cell[" + row + ",12]", "");
                                        //}
                                        //else
                                        //{
                                        //    var tmp = regionsList.Where(p => p.Id == Convert.ToInt32(ProvinceId)).FirstOrDefault();

                                        //    if (tmp == null)
                                        //    {
                                        //        return new ResultInfo(0, "Mã Tỉnh không tồn tại - Cell[" + row + ",12]", "");
                                        //    }
                                        //    else
                                        //    {
                                        //        item.ProvinceId = tmp.Id;
                                        //    }
                                        //}

                                        if (!string.IsNullOrEmpty(Convert.ToString(ClosedDate)) && Convert.ToString(ClosedDate).Length != 10)
                                        {
                                            {
                                                return new ResultInfo(0, "Ngày đóng: không đúng định dạng (yyyy-MM-dd) - Cell[" + row + ",21]", "");
                                            }
                                        }

                                        // add
                                        //item.StoreType = StoreType.ToString().ToUpper().Trim();
                                        item.ShopCode = Convert.ToString(ShopCode);
                                        item.ShopName = Convert.ToString(ShopName);
                                        item.Address = Convert.ToString(Address);

                                        if (!string.IsNullOrEmpty(Convert.ToString(Latitude)))
                                        {
                                            item.Latitude = Convert.ToDecimal(Latitude);
                                        }
                                        else
                                        {
                                            item.Latitude = null;
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Longitude)))
                                        {
                                            item.Longitude = Convert.ToDecimal(Longitude);
                                        }
                                        else
                                        {
                                            item.Longitude = null;
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Accuracy)))
                                        {
                                            item.Accuracy = Convert.ToInt32(Accuracy);
                                        }
                                        else
                                        {
                                            item.Accuracy = null;
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(Frequency)))
                                        {
                                            item.Frequency = Convert.ToInt32(Frequency);
                                        }
                                        else
                                        {
                                            item.Frequency = null;
                                        }

                                        //if (!string.IsNullOrEmpty(Convert.ToString(ClosedDate)))
                                        //{
                                        //    item.ClosedDate = Convert.ToString(ClosedDate);
                                        //}
                                        //else
                                        //{
                                        //    item.ClosedDate = null;
                                        //}

                                        if (!string.IsNullOrEmpty(Convert.ToString(Status)))
                                        {
                                            item.Status = Convert.ToString(Status);

                                            if (Convert.ToString(Status).ToLower().Replace(" ", "") == "inactive")
                                            {
                                                if (string.IsNullOrEmpty(Convert.ToString(ClosedDate)))
                                                {
                                                    return new ResultInfo(0, "Ngày đóng: Cửa hàng Inactive phải có ngày đóng cửa - Cell[" + row + ",21]", "");
                                                }
                                                else
                                                {
                                                    item.ClosedDate = Convert.ToString(ClosedDate);
                                                }
                                            }

                                        }
                                        else
                                        {
                                            item.Status = null;
                                        }


                                        if (!string.IsNullOrEmpty(Convert.ToString(CodeKH)))
                                        {
                                            item.CustomerCode = Convert.ToString(CodeKH);
                                        }
                                        else
                                        {
                                            item.CustomerCode = null;
                                        }

                                        dataImport.Add(item);
                                    }


                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(accId.Value, json));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} dòng", dataImport.Count), "");
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
            return new ResultInfo(0, "File Is Empty", "");
        }
    }
}