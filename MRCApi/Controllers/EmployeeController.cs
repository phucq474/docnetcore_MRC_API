using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using MRCApi.ClientModel;
using MRCApi.Extentions;
using DocumentFormat.OpenXml.Bibliography;

namespace MRCApi.Controllers
{
    public class EmployeeController : SpiralBaseController
    {
        public readonly IEmployeeService _service;
        public readonly IShopService _storeservice;
        public readonly IAccountService _accountService;
        private readonly FirebaseService _firebaseService;

        IWebHostEnvironment _FRoot;
        public EmployeeController(EmployeeContext _context, IWebHostEnvironment F, ShopContext _storecontext, AccountContext accountContext)
        {
            _service = new EmployeeService(_context);
            _storeservice = new ShopService(_storecontext);
            _accountService = new AccountService(accountContext);
            _FRoot = F;

            string serviceAccountFilePath = "path/to/your-service-account-file.json";
            _firebaseService = new FirebaseService(serviceAccountFilePath);

        }
        [HttpPost("Filter")]

        public ActionResult<List<EmployeeModel>> EmployeeGetDynamic([FromBody] EmployeeListSearch para, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                Task<List<EmployeeModel>> data = Task.Run(() => _service.EmployeeGetDynamic(Convert.ToInt32(accId), UserId, para.TypeId, para.SupId, para.EmployeeCode, para.EmployeeName, para.UserName, para.PhoneNumber, para.CMND, para.Status));
                data.Wait(200);
                return data.Result;
            }
            catch (Exception ex)
            {
                return new List<EmployeeModel>();
            }
        }
        [HttpGet("ListEmployeeType")]
        public async Task<ActionResult> GetEmployeeType([FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                var result = await _service.GetListEmployeeType(Convert.ToInt32(accId));
                return Ok(result);
            }
            catch (Exception ex)
            {
                return null;
            }
        }
        [HttpGet("ListEmployeeDDL")]
        public ActionResult<List<EmployeeDropDownListModel>> GetEmployeeByDDL([FromHeader] int? accId, [FromHeader] int? employeeId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                Task<List<EmployeeDropDownListModel>> data = Task.Run(() => _service.GetEmployeeDDL(Convert.ToInt32(accId), employeeId ?? UserId, null, null, null,null));
                return data.Result;
            }
            catch (Exception ex)
            {
                return null;
            }
           
        }
        [HttpGet("changepass")]
        public async Task<ActionResult> ChangePass([FromHeader] string oldpass, [FromHeader] string newpass)
        {
            var results = await _service.ChangePass(AccountId, oldpass, newpass, EmployeeId);
            if (results > 0)
                return Ok(results);
            else
                return Ok(results);

        }
        [HttpGet("GetInfoById")]
        public ActionResult<DataSet> Employee_GetInfoByEmployeeId([FromHeader] Int64 EmployeeId, [FromHeader] int? accId)
        {
            accId = accId != null ? accId : AccountId;
            Task<DataSet> data = Task.Run(() => _service.Employee_GetInfoByEmployeeId(Convert.ToInt32(accId), UserId,EmployeeId));
            return data.Result;
        }
        [HttpPost("EmployeeSave")]
        public async Task<ResultInfo> Employee_Save([FromForm] EmployeeSaveModel EmployeeObj, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;

                string ImageUrl = null;
                string UrlCMNDAfter = null, UrlCMNDBefore = null;
                if (EmployeeObj.FileCMNDBefore != null)
                {
                    string sWebRootFolder = _FRoot.WebRootPath; 
                    var fileCMNDBefore = EmployeeObj.FileCMNDBefore;
                    var fileNameCMNDBefore = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(fileCMNDBefore.FileName).ToLower();
                    var EmpCode = EmployeeObj.EmployeeCode;
                    string path = sWebRootFolder + "/upload/ImageProfile/" + EmpCode + "/";

                    if (!System.IO.Directory.Exists(path))
                    {
                        System.IO.Directory.CreateDirectory(path);
                    }
                    string linkBefore = path + fileNameCMNDBefore;

                    using (var fstream = System.IO.File.Create(linkBefore))
                    {
                        await fileCMNDBefore.CopyToAsync(fstream);
                    }
                    var urlCMNDBefore = "/upload/ImageProfile/" + EmpCode + "/" + fileNameCMNDBefore;

                    UrlCMNDBefore = urlCMNDBefore;
                }
                if (EmployeeObj.FileCMNDAfter != null)
                {
                    string sWebRootFolder = _FRoot.WebRootPath;
                    var fileCMNDAfter = EmployeeObj.FileCMNDAfter;
                    var fileNameCMNDAfter = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(fileCMNDAfter.FileName).ToLower();
                    var EmpCode = EmployeeObj.EmployeeCode;
                    string path = sWebRootFolder + "/upload/ImageProfile/" + EmpCode + "/";
                    if (!System.IO.Directory.Exists(path))
                    {
                        System.IO.Directory.CreateDirectory(path);
                    }
                    string linkAfter = path + fileNameCMNDAfter;

                    using (var fstream = System.IO.File.Create(linkAfter))
                    {
                        await fileCMNDAfter.CopyToAsync(fstream);
                    }
                    var urlCMNDAfter = "/upload/ImageProfile/" + EmpCode + "/" + fileNameCMNDAfter;
                    UrlCMNDAfter = urlCMNDAfter;
                }

                if (EmployeeObj.ImageProfile != null)
                {
                    string sWebRootFolder = _FRoot.WebRootPath;
                    var imageProfile = EmployeeObj.ImageProfile;
                    var fileName = Guid.NewGuid().ToString() + System.IO.Path.GetExtension(imageProfile.FileName).ToLower();
                    var EmpCode = EmployeeObj.EmployeeCode;
                    string path = sWebRootFolder + "/upload/ImageProfile/" + EmpCode + "/";
                    if (!System.IO.Directory.Exists(path))
                    {
                        System.IO.Directory.CreateDirectory(path);
                    }
                    string imageUrl = path + fileName;

                    using (var fstream = System.IO.File.Create(imageUrl))
                    {
                        await imageProfile.CopyToAsync(fstream);
                    }
                    ImageUrl = "/upload/ImageProfile/" + EmpCode + "/" + fileName;
                }
                var result = await Task.Run(() => _service.Employee_Save(Convert.ToInt32(accId), UserId, EmployeeObj.JsonData, ImageUrl, EmployeeObj.Password, UrlCMNDAfter, UrlCMNDBefore));
                if (result != null)
                {
                    return new ResultInfo(result[0].Status, result[0].Message, result[0].FileUrl);
                }
                else
                    return new ResultInfo(500, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpGet("EmployeeByCode")]

        public ActionResult<int> Employee_GetByEmployeeCodeOrUserName([FromHeader] string EmployeeCode, [FromHeader] int? accId)
        {
            accId = accId != null ? accId : AccountId;
            Task<EmployeesEntity> data = Task.Run(() => _service.GetByEmployeeCode(Convert.ToInt32(accId), EmployeeCode));
            if (data.Result != null)
                return data.Result.Id;
            return 0;
        }
        [HttpGet("UpdateStatus")]
        public async Task<ResultInfo> Employee_UpdateStatus([FromHeader] int EmployeeId, [FromHeader] int Status)
        {
            try
            {
                int result = await Task.Run(() => _service.Employee_UpdateStatus(AccountId, UserId, EmployeeId));
                if (result > 0)
                {
                    return new ResultInfo(200, "Thành công", "");
                }
                else
                    return new ResultInfo(500, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpGet("ResetPass")]
        public async Task<ResultInfo> Employee_ResetPass([FromHeader] int EmployeeId)
        {
            try
            {
                int result = await Task.Run(() => _service.Employee_ResetPass(EmployeeId, AccountId));
                if (result > 0)
                {
                    return new ResultInfo(200, "Thành công", "");
                }
                else
                    return new ResultInfo(500, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpPost("Import")]
        public async Task<ResultInfo> Employee_Import([FromForm] IFormFile fileUpload, [FromHeader] int? accId)
        {
            //string sWebRootFolder = _FRoot.WebRootPath;fileUpload
            //return EmployeeExtends.Import(fileUpload, sWebRootFolder, _service, AccountId, UserId, User.Identity.Name);
            try
            {
                accId = accId != null ? accId : AccountId;
                var acc = _accountService.GetListAccount(Convert.ToInt32(accId), UserId).Result;
                string accountName = acc[0].AccountName;
                var stream = fileUpload.OpenReadStream();
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (var package = new ExcelPackage(stream))
                {
                    ExcelWorkbook workBook = package.Workbook;
                    if (workBook != null && workBook.Worksheets.Count > 0)
                    {
                        var sheet = workBook.Worksheets["DS Nhân viên"];
                        if (sheet != null)
                        {
                            List<EmployeeModel> dataImport = new List<EmployeeModel>();

                            if(accountName == "Fonterra")
                            {
                                for (int row = 5; row <= sheet.Dimension.End.Row; row++)
                                {
                                    string EmployeeCode = Convert.ToString(sheet.Cells[row, 2].Value);
                                    string LastName = Convert.ToString(sheet.Cells[row, 3].Value);
                                    string FirstName = Convert.ToString(sheet.Cells[row, 4].Value);
                                    string FullName = Convert.ToString(sheet.Cells[row, 5].Value);
                                    string UserName = Convert.ToString(sheet.Cells[row, 6].Value);
                                    string TypeId = Convert.ToString(sheet.Cells[row, 7].Value);
                                    string ParentCode = Convert.ToString(sheet.Cells[row, 9].Value);
                                    string FromDateParent = Convert.ToString(sheet.Cells[row, 11].Value);
                                    string ToDateParent = Convert.ToString(sheet.Cells[row, 12].Value);
                                    string WorkingDate = Convert.ToString(sheet.Cells[row, 13].Value);
                                    string ResignedDate = Convert.ToString(sheet.Cells[row, 14].Value);
                                    string WorkingStatus = Convert.ToString(sheet.Cells[row, 15].Value);
                                    string FromDate = Convert.ToString(sheet.Cells[row, 17].Value);
                                    string ToDate = Convert.ToString(sheet.Cells[row, 18].Value);
                                    string Gender = Convert.ToString(sheet.Cells[row, 19].Value);
                                    string Marital = Convert.ToString(sheet.Cells[row, 20].Value);
                                    string BirthDay = Convert.ToString(sheet.Cells[row, 21].Value);
                                    string Email = Convert.ToString(sheet.Cells[row, 22].Value);
                                    string Mobile = Convert.ToString(sheet.Cells[row, 23].Value);
                                    string Address = Convert.ToString(sheet.Cells[row, 24].Value);
                                    string City = Convert.ToString(sheet.Cells[row, 25].Value);
                                    string IdentityCardNumber = Convert.ToString(sheet.Cells[row, 27].Value);
                                    string IdentityCardDate = Convert.ToString(sheet.Cells[row, 28].Value);
                                    string IdentityCardBy = Convert.ToString(sheet.Cells[row, 29].Value);
                                    string Status = Convert.ToString(sheet.Cells[row, 30].Value);
                                    string StartDate = Convert.ToString(sheet.Cells[row, 31].Value);

                                    EmployeeModel item = new EmployeeModel();

                                    if (!EmployeeExtends.CheckString(EmployeeCode))
                                    {
                                        return new ResultInfo(500, string.Format("Mã nhân viên: không được để trống - Dòng {0}, Cột {1}", row, 2), "");
                                    }
                                    else
                                    {
                                        item.EmployeeCode = EmployeeCode;
                                    }

                                    if (EmployeeExtends.CheckString(FirstName))
                                    {
                                        item.FisrtName = FirstName;
                                    }

                                    if (EmployeeExtends.CheckString(LastName))
                                    {
                                        item.LastName = LastName;
                                    }

                                    if (!EmployeeExtends.CheckString(FullName))
                                    {
                                        return new ResultInfo(500, string.Format("Họ và tên: không được để trống - Dòng {0}, Cột {1}", row, 5), "");
                                    }
                                    else
                                    {
                                        item.FullName = FullName;
                                    }

                                    if (!EmployeeExtends.CheckString(UserName))
                                    {
                                        return new ResultInfo(500, string.Format("Tài khoản: không được để trống - Dòng {0}, Cột {1}", row, 6), "");
                                    }
                                    else
                                    {
                                        //if (_service.CheckValidByEmployeeCode(AccountId, EmployeeCode, UserName) == false)
                                        //{
                                        //    return new ResultInfo(500, string.Format("Tài khoản: đã tồn tại - Dòng {0}, Cột {1}", row, 6), "");
                                        //}
                                        item.Username = UserName;
                                    }

                                    if (!EmployeeExtends.CheckString(TypeId))
                                    {
                                        return new ResultInfo(500, string.Format("Id Chức vụ: không được để trống - Dòng {0}, Cột {1}", row, 7), "");
                                    }
                                    else
                                    {
                                        item.TypeId = Convert.ToInt32(TypeId);
                                    }

                                    if (!EmployeeExtends.CheckString(ParentCode))
                                    {
                                        return new ResultInfo(500, string.Format("Mã Quản lý: không được để trống - Dòng {0}, Cột {1}", row, 9), "");
                                    }
                                    else
                                    {
                                        var parent = await Task.Run(() => _service.GetEmployeeByCode(AccountId, ParentCode));
                                        if (parent == null)
                                        {
                                            return new ResultInfo(500, string.Format("Mã Quản lý: không tồn tại - Dòng {0}, Cột {1}", row, 9), "");
                                        }

                                        item.ParentId = Convert.ToInt32(parent.Id);
                                    }

                                    if (!EmployeeExtends.CheckString(FromDateParent))
                                    {
                                        return new ResultInfo(500, string.Format("Quản lý/Từ ngày: không được để trống - Dòng {0}, Cột {1}", row, 11), "");
                                    }
                                    else
                                    {
                                        if (!EmployeeExtends.CheckDate(FromDateParent))
                                        {
                                            return new ResultInfo(500, string.Format("Quản lý/Từ ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 11), "");
                                        }
                                        else
                                        {
                                            item.FromDateParent = Convert.ToInt32(Convert.ToDateTime(FromDateParent).ToString("yyyy-MM-dd").Replace("-", ""));
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(ToDateParent))
                                    {
                                        if (!EmployeeExtends.CheckDate(ToDateParent))
                                        {
                                            return new ResultInfo(500, string.Format("Quản lý/Đến ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 12), "");
                                        }
                                        else
                                        {
                                            item.ToDateParent = Convert.ToInt32(Convert.ToDateTime(ToDateParent).ToString("yyyy-MM-dd").Replace("-", ""));
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(WorkingDate))
                                    {
                                        return new ResultInfo(500, string.Format("Ngày vào làm: không được để trống - Dòng {0}, Cột {1}", row, 13), "");
                                    }
                                    else
                                    {
                                        if (!EmployeeExtends.CheckDate(WorkingDate))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày vào làm: không đúng định dạng - Dòng {0}, Cột {1}", row, 13), "");
                                        }
                                        else
                                        {
                                            item.WorkingDate = Convert.ToDateTime(WorkingDate);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(ResignedDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(ResignedDate))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày nghỉ việc: không đúng định dạng - Dòng {0}, Cột {1}", row, 14), "");
                                        }
                                        else
                                        {
                                            item.ResignedDate = Convert.ToDateTime(ResignedDate);
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(WorkingStatus))
                                    {
                                        return new ResultInfo(500, string.Format("Trạng thái làm việc/Id: không được để trống - Dòng {0}, Cột {1}", row, 15), "");
                                    }
                                    else
                                    {
                                        if (WorkingStatus.Equals("6") && !EmployeeExtends.CheckString(ToDate))
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái Thai Sản: phải có ngày kết thúc - Dòng {0}, Cột {1}", row, 18), "");
                                        }
                                        else
                                        {
                                            item.WorkingStatusId = Convert.ToInt32(WorkingStatus);
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(FromDate))
                                    {
                                        return new ResultInfo(500, string.Format("Trạng thái làm việc/Từ ngày: không được để trống - Dòng {0}, Cột {1}", row, 17), "");
                                    }
                                    else
                                    {
                                        if (!EmployeeExtends.CheckDate(FromDate))
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái làm việc/Từ ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 17), "");
                                        }
                                        else
                                        {
                                            item.FromDate = Convert.ToDateTime(FromDate);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(ToDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(ToDate))
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái làm việc/Đến ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 18), "");
                                        }
                                        else
                                        {
                                            item.ToDate = Convert.ToDateTime(ToDate);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(Gender))
                                    {
                                        if (Gender.ToLower() == "female" || Gender.ToLower() == "nữ")
                                        {
                                            item.Gender = 1;
                                        }
                                        else if (Gender.ToLower() == "male" || Gender.ToLower() == "nam")
                                        {
                                            item.Gender = 2;
                                        }
                                        else
                                        {
                                            item.Gender = null;
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(Marital))
                                    {
                                        if (Marital.ToLower() == "single" || Marital.ToLower() == "độc thân")
                                        {
                                            item.Marital = 1;
                                        }
                                        else if (Marital.ToLower() == "married" || Marital.ToLower() == "đã lập gia đình")
                                        {
                                            item.Marital = 2;
                                        }
                                        else
                                        {
                                            item.Marital = null;
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(BirthDay))
                                    {
                                        if (!EmployeeExtends.CheckDate(BirthDay))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày sinh: không đúng định dạng - Dòng {0}, Cột {1}", row, 21), "");
                                        }
                                        else
                                        {
                                            item.Birthday = Convert.ToDateTime(BirthDay);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(Email))
                                    {
                                        item.Email = Email;
                                    }

                                    if (EmployeeExtends.CheckString(Mobile))
                                    {
                                        item.Mobile = Mobile;
                                    }

                                    if (EmployeeExtends.CheckString(Address))
                                    {
                                        item.Address = Address;
                                    }

                                    if (EmployeeExtends.CheckString(City))
                                    {
                                        item.City = City;
                                    }

                                    if (EmployeeExtends.CheckString(IdentityCardNumber))
                                    {
                                        item.IdentityCardNumber = IdentityCardNumber;
                                    }

                                    if (EmployeeExtends.CheckString(IdentityCardBy))
                                    {
                                        item.IdentityCardBy = IdentityCardBy;
                                    }

                                    if (EmployeeExtends.CheckString(IdentityCardDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(IdentityCardDate))
                                        {
                                            return new ResultInfo(500, string.Format("CMND/CCCD/Ngày cấp: không đúng định dạng - Dòng {0}, Cột {1}", row, 28), "");
                                        }
                                        else
                                        {
                                            item.IdentityCardDate = Convert.ToDateTime(IdentityCardDate);
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(Status))
                                    {
                                        return new ResultInfo(500, string.Format("Trạng thái hoạt động: không được để trống - Dòng {0}, Cột {1}", row, 30), "");
                                    }
                                    else
                                    {
                                        if (Status != "0" && Status != "1")
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái hoạt động: không đúng định dạng - Dòng {0}, Cột {1}", row, 30), "");
                                        }
                                        else
                                        {
                                            item.Status = Convert.ToInt32(Status);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(StartDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(StartDate))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày bắt đầu FTR: không đúng định dạng - Dòng {0}, Cột {1}", row, 31), "");
                                        }
                                        else
                                        {
                                            item.StartDate = Convert.ToDateTime(StartDate);
                                        }
                                    }

                                    dataImport.Add(item);
                                }
                            }
                            else
                            {
                                for (int row = 5; row <= sheet.Dimension.End.Row; row++)
                                {
                                    string EmployeeCode = Convert.ToString(sheet.Cells[row, 3].Value);
                                    string LastName = Convert.ToString(sheet.Cells[row, 4].Value);
                                    string FirstName = Convert.ToString(sheet.Cells[row, 5].Value);
                                    string FullName = Convert.ToString(sheet.Cells[row, 6].Value);
                                    string UserName = Convert.ToString(sheet.Cells[row, 7].Value);
                                    string TypeId = Convert.ToString(sheet.Cells[row, 8].Value);
                                    string ParentCode = Convert.ToString(sheet.Cells[row, 10].Value);
                                    string FromDateParent = Convert.ToString(sheet.Cells[row, 12].Value);
                                    string ToDateParent = Convert.ToString(sheet.Cells[row, 13].Value);
                                    string WorkingDate = Convert.ToString(sheet.Cells[row, 14].Value);
                                    string ResignedDate = Convert.ToString(sheet.Cells[row, 15].Value);
                                    string WorkingStatus = Convert.ToString(sheet.Cells[row, 16].Value);
                                    string FromDate = Convert.ToString(sheet.Cells[row, 18].Value);
                                    string ToDate = Convert.ToString(sheet.Cells[row, 19].Value);
                                    //string ActualDate = Convert.ToString(sheet.Cells[row, 19].Value);
                                    string Gender = Convert.ToString(sheet.Cells[row, 20].Value);
                                    string Marital = Convert.ToString(sheet.Cells[row, 21].Value);
                                    string BirthDay = Convert.ToString(sheet.Cells[row, 22].Value);
                                    string Email = Convert.ToString(sheet.Cells[row, 23].Value);
                                    string Mobile = Convert.ToString(sheet.Cells[row, 24].Value);
                                    string Address = Convert.ToString(sheet.Cells[row, 25].Value);
                                    //string TemporaryAddress = Convert.ToString(sheet.Cells[row, 26].Value);
                                    string City = Convert.ToString(sheet.Cells[row, 26].Value);
                                    string IdentityCardNumber = Convert.ToString(sheet.Cells[row, 28].Value);
                                    string IdentityCardDate = Convert.ToString(sheet.Cells[row, 29].Value);
                                    string IdentityCardBy = Convert.ToString(sheet.Cells[row, 30].Value);
                                    //string BHYT = Convert.ToString(sheet.Cells[row, 32].Value);
                                    //string DateVaccin1 = Convert.ToString(sheet.Cells[row, 33].Value);
                                    //string TypeVaccin1 = Convert.ToString(sheet.Cells[row, 34].Value);
                                    //string DateVaccin2 = Convert.ToString(sheet.Cells[row, 35].Value);
                                    //string TypeVaccin2 = Convert.ToString(sheet.Cells[row, 36].Value);
                                    //string VaccinStatus = Convert.ToString(sheet.Cells[row, 37].Value);
                                    //string ReasonNoVaccin = Convert.ToString(sheet.Cells[row, 38].Value);
                                    //string imei0 = Convert.ToString(sheet.Cells[row, 39].Value);
                                    //string imei1 = Convert.ToString(sheet.Cells[row, 40].Value);
                                    //string imei2 = Convert.ToString(sheet.Cells[row, 41].Value);
                                    //string checkIMEI = Convert.ToString(sheet.Cells[row, 42].Value);
                                    string Status = Convert.ToString(sheet.Cells[row, 31].Value);

                                    EmployeeModel item = new EmployeeModel();

                                    if (!EmployeeExtends.CheckString(EmployeeCode))
                                    {
                                        return new ResultInfo(500, string.Format("Mã nhân viên: không được để trống - Dòng {0}, Cột {1}", row, 2), "");
                                    }
                                    else
                                    {
                                        item.EmployeeCode = EmployeeCode;
                                    }

                                    if (EmployeeExtends.CheckString(FirstName))
                                    {
                                        item.FisrtName = FirstName;
                                    }

                                    if (EmployeeExtends.CheckString(LastName))
                                    {
                                        item.LastName = LastName;
                                    }

                                    if (!EmployeeExtends.CheckString(FullName))
                                    {
                                        return new ResultInfo(500, string.Format("Họ và tên: không được để trống - Dòng {0}, Cột {1}", row, 6), "");
                                    }
                                    else
                                    {
                                        item.FullName = FullName;
                                    }

                                    if (!EmployeeExtends.CheckString(UserName))
                                    {
                                        return new ResultInfo(500, string.Format("Tài khoản: không được để trống - Dòng {0}, Cột {1}", row, 7), "");
                                    }
                                    else
                                    {
                                    
                                        item.Username = UserName;
                                    }

                                    if (!EmployeeExtends.CheckString(TypeId))
                                    {
                                        return new ResultInfo(500, string.Format("Id Chức vụ: không được để trống - Dòng {0}, Cột {1}", row, 8), "");
                                    }
                                    else
                                    {
                                        item.TypeId = Convert.ToInt32(TypeId);
                                    }

                                    if (!EmployeeExtends.CheckString(ParentCode))
                                    {
                                        return new ResultInfo(500, string.Format("Mã Quản lý: không được để trống - Dòng {0}, Cột {1}", row, 10), "");
                                    }
                                    else
                                    {
                                        var parent = await Task.Run(() => _service.GetEmployeeByCode(AccountId, ParentCode));
                                        if (parent == null)
                                        {
                                            return new ResultInfo(500, string.Format("Mã Quản lý: không tồn tại - Dòng {0}, Cột {1}", row, 10), "");
                                        }

                                        item.ParentId = Convert.ToInt32(parent.Id);
                                    }

                                    if (!EmployeeExtends.CheckString(FromDateParent))
                                    {
                                        return new ResultInfo(500, string.Format("Quản lý/Từ ngày: không được để trống - Dòng {0}, Cột {1}", row, 12), "");
                                    }
                                    else
                                    {
                                        if (!EmployeeExtends.CheckDate(FromDateParent))
                                        {
                                            return new ResultInfo(500, string.Format("Quản lý/Từ ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 12), "");
                                        }
                                        else
                                        {
                                            item.FromDateParent = Convert.ToInt32(Convert.ToDateTime(FromDateParent).ToString("yyyy-MM-dd").Replace("-", ""));
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(ToDateParent))
                                    {
                                        if (!EmployeeExtends.CheckDate(ToDateParent))
                                        {
                                            return new ResultInfo(500, string.Format("Quản lý/Đến ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 13), "");
                                        }
                                        else
                                        {
                                            item.ToDateParent = Convert.ToInt32(Convert.ToDateTime(ToDateParent).ToString("yyyy-MM-dd").Replace("-", ""));
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(WorkingDate))
                                    {
                                        return new ResultInfo(500, string.Format("Ngày vào làm: không được để trống - Dòng {0}, Cột {1}", row, 14), "");
                                    }
                                    else
                                    {
                                        if (!EmployeeExtends.CheckDate(WorkingDate))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày vào làm: không đúng định dạng - Dòng {0}, Cột {1}", row, 14), "");
                                        }
                                        else
                                        {
                                            item.WorkingDate = Convert.ToDateTime(WorkingDate);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(ResignedDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(ResignedDate))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày nghỉ việc: không đúng định dạng - Dòng {0}, Cột {1}", row, 15), "");
                                        }
                                        else
                                        {
                                            item.ResignedDate = Convert.ToDateTime(ResignedDate);
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(WorkingStatus))
                                    {
                                        return new ResultInfo(500, string.Format("Trạng thái làm việc/Id: không được để trống - Dòng {0}, Cột {1}", row, 16), "");
                                    }
                                    else
                                    {
                                        if (WorkingStatus.Equals("6") && !EmployeeExtends.CheckString(ToDate))
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái Thai Sản: phải có ngày kết thúc - Dòng {0}, Cột {1}", row, 19), "");
                                        }
                                        else
                                        {
                                            item.WorkingStatusId = Convert.ToInt32(WorkingStatus);
                                        }
                                    }

                                    if (!EmployeeExtends.CheckString(FromDate))
                                    {
                                        return new ResultInfo(500, string.Format("Trạng thái làm việc/Từ ngày: không được để trống - Dòng {0}, Cột {1}", row, 18), "");
                                    }
                                    else
                                    {
                                        if (!EmployeeExtends.CheckDate(FromDate))
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái làm việc/Từ ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 18), "");
                                        }
                                        else
                                        {
                                            item.FromDate = Convert.ToDateTime(FromDate);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(ToDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(ToDate))
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái làm việc/Đến ngày: không đúng định dạng - Dòng {0}, Cột {1}", row, 19), "");
                                        }
                                        else
                                        {
                                            item.ToDate = Convert.ToDateTime(ToDate);
                                        }
                                    }

                                   

                                    if (EmployeeExtends.CheckString(Gender))
                                    {
                                        if (Gender.ToLower() == "female" || Gender.ToLower() == "nữ")
                                        {
                                            item.Gender = 1;
                                        }
                                        else if (Gender.ToLower() == "male" || Gender.ToLower() == "nam")
                                        {
                                            item.Gender = 2;
                                        }
                                        else
                                        {
                                            item.Gender = null;
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(Marital))
                                    {
                                        if (Marital.ToLower() == "single" || Marital.ToLower() == "độc thân")
                                        {
                                            item.Marital = 1;
                                        }
                                        else if (Marital.ToLower() == "married" || Marital.ToLower() == "đã lập gia đình")
                                        {
                                            item.Marital = 2;
                                        }
                                        else
                                        {
                                            item.Marital = null;
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(BirthDay))
                                    {
                                        if (!EmployeeExtends.CheckDate(BirthDay))
                                        {
                                            return new ResultInfo(500, string.Format("Ngày sinh: không đúng định dạng - Dòng {0}, Cột {1}", row, 22), "");
                                        }
                                        else
                                        {
                                            item.Birthday = Convert.ToDateTime(BirthDay);
                                        }
                                    }

                                    if (EmployeeExtends.CheckString(Email))
                                    {
                                        item.Email = Email;
                                    }

                                    if (EmployeeExtends.CheckString(Mobile))
                                    {
                                        item.Mobile = Mobile;
                                    }

                                    if (EmployeeExtends.CheckString(Address))
                                    {
                                        item.Address = Address;
                                    }

                                    //if (EmployeeExtends.CheckString(TemporaryAddress))
                                    //{
                                    //    item.TemporaryAddress = TemporaryAddress;
                                    //}

                                    if (EmployeeExtends.CheckString(City))
                                    {
                                        item.City = City;
                                    }

                                    if (EmployeeExtends.CheckString(IdentityCardNumber))
                                    {
                                        item.IdentityCardNumber = IdentityCardNumber;
                                    }

                                    if (EmployeeExtends.CheckString(IdentityCardBy))
                                    {
                                        item.IdentityCardBy = IdentityCardBy;
                                    }

                                    if (EmployeeExtends.CheckString(IdentityCardDate))
                                    {
                                        if (!EmployeeExtends.CheckDate(IdentityCardDate))
                                        {
                                            return new ResultInfo(500, string.Format("CMND/CCCD/Ngày cấp: không đúng định dạng - Dòng {0}, Cột {1}", row, 29), "");
                                        }
                                        else
                                        {
                                            item.IdentityCardDate = Convert.ToDateTime(IdentityCardDate);
                                        }
                                    }

                                    

                                    if (!EmployeeExtends.CheckString(Status))
                                    {
                                        return new ResultInfo(500, string.Format("Trạng thái hoạt động: không được để trống - Dòng {0}, Cột {1}", row, 31), "");
                                    }
                                    else
                                    {
                                        if (Status != "0" && Status != "1")
                                        {
                                            return new ResultInfo(500, string.Format("Trạng thái hoạt động: không đúng định dạng - Dòng {0}, Cột {1}", row, 31), "");
                                        }
                                        else
                                        {
                                            item.Status = Convert.ToInt32(Status);
                                        }
                                    }


                                    if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 2].Value)))
                                    {
                                        item.OldCode = Convert.ToString(sheet.Cells[row, 2].Value);
                                    }


                                    dataImport.Add(item);
                                }
                            }

                            
                            if (dataImport.Count > 0)
                            {
                                string json = JsonConvert.SerializeObject(dataImport);
                                var Result = await Task.Run(() => _service.Import_VNM(Convert.ToInt32(accId), UserId, json));
                                if (Result > 0)
                                {
                                    return new ResultInfo(200, string.Format("Import thành công: {0} dòng", dataImport.Count), "");
                                }
                                else
                                {
                                    return new ResultInfo(500, "Thất bại", "");
                                }
                            }
                            else
                            {
                                return new ResultInfo(500, "No data", "");
                            }
                        }
                        else
                        {
                            return new ResultInfo(500, "File rỗng", "");
                        }
                    }
                    else
                    {
                        return new ResultInfo(500, "File rỗng", "");
                    }
                }
            }
            catch(Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

        [HttpGet("Template")]
        public async Task<ResultInfo> Template([FromHeader] int? accId)
        {
            accId = accId != null ? accId : AccountId;
            var acc = _accountService.GetListAccount(Convert.ToInt32(accId), UserId).Result;
            string accountName = acc[0].AccountName;

            string folder = _FRoot.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Template_ImportEmployee_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ImportEmployee.xlsx"));
             
            if(accountName == "Fonterra")
            {
                fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ImportEmployee_FTR.xlsx"));
            }
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using (DataSet data = await Task.Run(() => _service.Export(UserId, accId.Value)))
            {
                using (var package = new ExcelPackage(file))
                {
                    if (data.Tables[0].Rows.Count > 0)
                    {
                        var sheet = package.Workbook.Worksheets["DS Nhân viên"];
                        sheet.Cells[5, 1].LoadFromDataTable(data.Tables[0], false);

                        ExcelFormats.Border(sheet, 5, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                    }

                    if (data.Tables[1].Rows.Count > 0)
                    {
                        var sheet = package.Workbook.Worksheets["Chức vụ"];
                        sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                        ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                    }

                    if (data.Tables[2].Rows.Count > 0)
                    {
                        var sheet = package.Workbook.Worksheets["Trạng thái làm việc"];
                        sheet.Cells[2, 1].LoadFromDataTable(data.Tables[2], true);

                        ExcelFormats.Border(sheet, 2, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                    }

                    if (data.Tables[3].Rows.Count > 0)
                    {
                        var sheet = package.Workbook.Worksheets["Khu vực"];
                        sheet.Cells[3, 1].LoadFromDataTable(data.Tables[3], true);

                        ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);

                    }
                    package.Save();
                }
            }
            return (new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));

        }
        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string Json, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId : AccountId;
                var acc = _accountService.GetListAccount(Convert.ToInt32(accId), UserId).Result;
                string accountName = acc[0].AccountName;

                string folder = _FRoot.WebRootPath;
                string subfolder = "export/" + AccountId.ToString();

                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                string fileName = $"Danh sách nhân viên_{accId.Value.ToString()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);

                FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ExportEmployee_V2.xlsx"));
                if(accountName == "MARICO MT")
                {
                    fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_ExportEmployee_MRC.xlsx"));
                }
                FileInfo file = fileInfo.CopyTo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataTable data = await Task.Run(() => _service.MT_Employee_Export(accId.Value, UserId, Json)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets[0];
                        if (sheet != null)
                        {
                            if (data.Rows.Count > 0)
                            {
                                sheet.Cells[5, 1].LoadFromDataTable(data, false);
                                if(accountName != "MARICO MT" && accId != 1)
                                {
                                    sheet.Cells[3, sheet.Dimension.End.Column].Value = "Ngày vào làm";
                                }
                                ExcelFormatTimeShift.BorderCell(sheet.Cells[5, 1, sheet.Dimension.End.Row, data.Columns.Count]);
                                sheet.Cells.AutoFitColumns(10);
                            }
                            else
                            {
                                return (new ResultInfo(-1, "Không có dữ liệu", null));
                            }
                        }
                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Xuất file thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
         }

        [HttpGet("EmployeeWorkingDelete")]

        public async Task<ResultInfo> EmployeeWorking_Delete([FromHeader] int Id, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                var result = await Task.Run(() => _service.EmployeeWorking_Delete(Convert.ToInt32(accId), UserId, Id));
                if (result != null)
                    return new ResultInfo(result[0].Status, result[0].Message, result[0].FileUrl);
                else
                    return new ResultInfo(500, "Không thành công", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, null);
            }
        }
        [HttpGet("EmployeeWorkingUpdate")]
        public async Task<ResultInfo> EmployeeWorking_Update([FromHeader] int Id, [FromHeader] int FromDate, [FromHeader] int? ToDate, [FromHeader] int? ActualDate, [FromHeader] string Comment, [FromHeader] int? MaternityStatus)
        {
            if (string.IsNullOrEmpty(Comment) || string.IsNullOrWhiteSpace(Comment))
                Comment = null;
            try
            {
                var result = await Task.Run(() => _service.EmployeeWorking_Update(Id, FromDate, ToDate == 0 ? null : ToDate, ActualDate == 0 ? null : ActualDate, MaternityStatus == 0 ? null : MaternityStatus, Comment));
                if (result.Count > 0)
                    return new ResultInfo(result[0].Status, result[0].Message, "");
                else
                    return new ResultInfo(500, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpGet("imei/filter")]
        public ActionResult<DataTable> imei_filter([FromHeader] string jsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.imei_filter(AccountId, UserId, jsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                {
                    return BadRequest(-1);
                }
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("imei/insert")]
        public ActionResult<DataTable> imei_insert([FromBody] string jsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.imei_insert(AccountId, UserId, jsonData));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                {
                    return BadRequest(-1);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("imei/getdata")]
        public ActionResult<DataTable> imei_getdata([FromHeader] int employeeId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.imei_getdata(AccountId, employeeId));
                if (data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                else
                {
                    return BadRequest(-1);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("imei/save")]
        public async Task<ResultInfo> imei_save([FromBody] string JsonIMEI)
        {
            try
            {
                string accessToken = Task.Run(() => _firebaseService.GetAccessTokenAsync()).Result;

                var result = await Task.Run(() => _service.imei_save(AccountId, UserId, JsonIMEI));
                if (result != null)
                {
                    if (result[0].Status == 200)
                    {
                        List<EmployeeIMEIModel> list_jsonIMEI = JsonConvert.DeserializeObject<List<EmployeeIMEIModel>>(JsonIMEI);
                        List<EmployeeIMEIModel> list_IMEI = list_jsonIMEI.Where(p => p.imei != null && p.status == 0 && p.token != null && p.employeeId != null).ToList();
                       
                        if (list_IMEI.Count > 0)
                        {
                            foreach (EmployeeIMEIModel item in list_IMEI)
                            {
                                var x = Task.Run(() => NotificationsManager.SendMessage(AccountId, accessToken, item.token, "System", string.Format("Tài khoản trên thiết bị này đã bị khóa bởi {0}", EmployeeName), "signOut", null, null, null, null, null, null));
                                x.Wait(100);
                            }
                        }
                    }

                    return new ResultInfo(result[0].Status, result[0].Message, result[0].FileUrl);
                }
                else
                    return new ResultInfo(500, "Không thành công", "");

            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
        [HttpPost("EmployeeParent/Save")]
        public async Task<ResultInfo> EmployeeParent_Save([FromBody] string Json, [FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                var data = await Task.Run(() => _service.EmployeeParent_Save(accId.Value, UserId, Json));
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Cập nhật Quản lý thành công", null, data);
                }
                else
                {
                    return new ResultInfo(500, "Cập nhật Quản lý thất bại", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace, null);
            }
        }

        [HttpPost("EmployeePosition/Save")]
        public async Task<ResultInfo> EmployeePosition_Save([FromBody] string Json)
        {
            try
            {
                var data = await Task.Run(() => _service.EmployeePosition_Save(AccountId, UserId, Json));
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Cập nhật Vị trí thành công", null, data);
                }
                else
                {
                    return new ResultInfo(500, "Cập nhật Vị trí thất bại", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace, null);
            }
        }

        [HttpPost("GetListCity")]
        public async Task<ResultInfo> GetListCity([FromHeader] int? accId)
        {
            try
            {
                accId = accId != null ? accId.Value : AccountId;
                var data = await Task.Run(() => _service.GetListCity(accId.Value, UserId));
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Thành công", null, data);
                }
                else
                {
                    return new ResultInfo(500, "No data", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace, null);
            }
        }
        [HttpGet("GetShopByEmployee")]
        public ActionResult<ResultInfo> GetShopByEmployee([FromHeader] int? workDate, [FromHeader] int employeeId)
        {
            try
            {
                DataTable data = Task.Run(() => _service.GetShopByEmployee(AccountId, employeeId, workDate)).Result;
                if(data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "Success", "", data);
                }
                else
                {
                    return new ResultInfo(500, "No data");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
    }
}