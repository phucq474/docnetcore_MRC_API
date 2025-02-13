using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
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
    public class TimesheetController : SpiralBaseController
    {
        public readonly ITimesheetService _service;
        public readonly IEmployeeService _EmployeeService;
        public readonly IMessengerService _MessengerService;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public readonly ICalendarService _calendarService;
        public readonly IAttendantService _attendantService;
        public TimesheetController(TimesheetContext _context,  EmployeeContext _EmployeeContext, MessengerContext _MessengerContext, IWebHostEnvironment hostingEnvironment, CalendarContext calendarContext, AttendantContext attendantContext)
        {
            _service = new TimesheetService(_context);
            _EmployeeService = new EmployeeService(_EmployeeContext);
            _MessengerService = new MessengerService(_MessengerContext);
            _calendarService = new CalendarService(calendarContext);
            _attendantService = new AttendantService(attendantContext);
            this._hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("GetList")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Timesheets_GetList(accId ?? AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
           
        }
        [HttpGet("GetDetail")]
        public ActionResult<DataTable> GetDetail([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            Task<DataTable> data = Task.Run(() => _service.Timesheets_GetDetail(UserId, JsonData, accId ?? AccountId));
            return data.Result;
        }
        [HttpPost("Update")]
        public async Task<AlertModel> Update([FromForm] IFormCollection ifile, [FromHeader] string JsonData, [FromHeader] int? accId)
        {
            try
            {
                // Open JsonData
                string str_jsonData = System.Text.Encoding.UTF8.GetString(Convert.FromBase64String(JsonData));

                TimesheetModel timesheet = new TimesheetModel();
                timesheet = JsonConvert.DeserializeObject<TimesheetModel>(str_jsonData);

                // UpFile

                if (ifile != null && ifile.Files.Count > 0)
                {
                    int Index = 0;
                    List<ImageInfo> lstURL = new List<ImageInfo>();

                    string subfolder = "/upload/images/timesheet/" + DateTime.Now.ToString("yyyyMMdd") + "/";
                    string fullpath = _hostingEnvironment.WebRootPath + subfolder;

                    if (!Directory.Exists(fullpath))
                    {
                        Directory.CreateDirectory(fullpath);
                    }

                    string filename = string.Empty;
                    filename = "Evidence" + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmssfff") + "_" + Convert.ToString(timesheet.EmployeeId) + "_" 
                                + Convert.ToString(timesheet.WorkDate) + Path.GetExtension(ifile.Files[0].FileName);

                    FileInfo fileInfo = new FileInfo(fullpath + filename);

                    if (Directory.Exists(fileInfo.FullName))
                    {
                        Directory.Delete(fileInfo.FullName);
                    }
                    using (FileStream fs = new FileStream(fileInfo.FullName, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                    {
                        await ifile.Files[0].CopyToAsync(fs);
                        await fs.FlushAsync();
                        await fs.DisposeAsync();
                    }
                    lstURL.Add(new ImageInfo(subfolder + filename, filename, Path.GetExtension(ifile.Files[0].FileName).ToLower(), Index));

                    timesheet.Evidence = JsonConvert.SerializeObject(lstURL);

                    if (string.IsNullOrEmpty(Convert.ToString(timesheet.Evidence)))
                    {
                        return new AlertModel(-1, "Upfile failed", null);
                    }
                }

                Task<int> data = Task.Run(() => _service.Timesheets_Update(accId ?? AccountId, EmployeeId, JsonConvert.SerializeObject(timesheet)));
                if (data.Result > 0)
                {
                    return new AlertModel(1, "Successful", null);
                }
                else
                    return new AlertModel(-1, "Fail", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(-1, "Error: " + ex.Message, null);
            }
        }

        //[HttpPost("UploadFiles")]
        //public async Task<AlertModel> UploadFile([FromForm] IFormCollection mFile, [FromHeader] long ShopId, [FromHeader] int EmployeeId, [FromHeader] int WorkDate)
        //{
        //    try
        //    {
        //        int result = 0;
        //        string subfoler = "/uploaded/images/" + AccountId.ToString() + "/";
        //        List<ImageInfo> lstURL = new List<ImageInfo>();
        //        string fullpath = _hostingEnvironment.WebRootPath + subfoler + DateTime.Now.ToString("yyyyMMdd") + "/";
        //        if (!Directory.Exists(fullpath))
        //            Directory.CreateDirectory(fullpath);

        //        string urlImage = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, subfoler + DateTime.Now.ToString("yyyyMMdd") + "/");
        //        foreach (IFormFile uFile in mFile.Files)
        //        {
        //            FileInfo fileInfo = new FileInfo(fullpath + uFile.FileName);
        //            if (Directory.Exists(fileInfo.FullName))
        //                Directory.Delete(fileInfo.FullName);
        //            using (FileStream fs = new FileStream(fileInfo.FullName, FileMode.OpenOrCreate, FileAccess.ReadWrite))
        //            {
        //                await uFile.CopyToAsync(fs);
        //                await fs.FlushAsync();
        //                await fs.DisposeAsync();
        //            }
        //            // lstURL.Add(new ImageInfo(urlImage + uFile.FileName));
        //            PhotoEntity p = new PhotoEntity();
        //            p.PhotoID = 0;
        //            p.ShopId = ShopId;
        //            p.EmployeeId = EmployeeId;
        //            p.AccountId = AccountId;
        //            p.PhotoDate = WorkDate;
        //            p.PhotoType = "ISSUE_Timesheet";
        //            p.PhotoTime = DateTime.Now;
        //            p.CreateDate = DateTime.Now;
        //            p.PhotoPath = urlImage + uFile.FileName;
        //            Task<int> data = Task.Run(() => _photoService.Insert(p));
        //            result += data.Result;
        //        }
        //        return new AlertModel(1, "Successful", null);
        //    }
        //    catch (Exception ex)
        //    {
        //        return new AlertModel(-1, "Error: " + ex.Message, null);
        //    }

        //}

        [HttpGet("Export")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            return await Task.Run(() => AttendantExtends.Timesheet_Export(accId ?? AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme, _calendarService, _attendantService));
        }
        [HttpPost("UnLock")]
        public ActionResult<ResultInfo> Unlock([FromHeader] int workDate, [FromHeader] int employeeId)
        {
            int result = Task.Run(() => _service.Timesheets_Unlock(UserId, employeeId, workDate)).Result;
            
            if(result > 0)
            {
                return new ResultInfo(200, "Thành công", "");
            }
            else
            {
                return new ResultInfo(500, "Thất bại", "");
            }
        }
        [HttpGet("GetShiftList")]
        public ActionResult<ResultInfo> GetShiftList([FromHeader] int? employeeId, [FromHeader] int? accId)
        {
            try
            {
                DataTable data = Task.Run(() => _service.GetShiftList(accId ?? AccountId, UserId, employeeId)).Result;
                if(data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "ok", "", data);
                }
                else
                {
                    return new ResultInfo(0, "No data", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
    }
}
