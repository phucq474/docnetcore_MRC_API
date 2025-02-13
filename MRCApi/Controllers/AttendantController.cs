
using DocumentFormat.OpenXml.Packaging;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class AttendantController : SpiralBaseController
    {
        public readonly IAttendantService _service;
        public readonly IEmployeeService _employeeService;
        public readonly IShiftListService _shiftListService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly ILogsService _logs;

        public AttendantController(AttendantContext _context, EmployeeContext _employeeContext, ShiftListContext _shiftListContext, IWebHostEnvironment _webhost, ILogsService logs)
        {
            _service = new AttendantService(_context);
            _employeeService = new EmployeeService(_employeeContext);
            _shiftListService = new ShiftListService(_shiftListContext);
            this._webHostEnvironment = _webhost;
            _logs = logs;
        }
        [HttpGet("GetList")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            Task<DataTable> data = Task.Run(() => _service.GetDynamic(accId ?? AccountId, UserId, JsonData));
            return data.Result;
        }
        [HttpPost("Report_Attendant_RawData")]
        public ActionResult<ResultInfo> Report_Attendant_RawData([FromBody] string JsonData, [FromHeader] int? accId)
        {
            return Task.Run(() => AttendantExtends.Report_Attendant_RawData(accId ?? AccountId, UserId, JsonData, _service, _webHostEnvironment, Request.Host, Request.Scheme)).Result;
        }
        [HttpGet("FilterUpdate")]
        public ActionResult<DataTable> FilterUpdate([FromHeader] int shopId, [FromHeader] int employeeId, [FromHeader] int? PhotoDate, [FromHeader] string ShiftCode)
        {
            Task<DataTable> data = Task.Run(() => _service.FilterUpdate(shopId, employeeId, PhotoDate, ShiftCode));
            return data.Result;
        }
        [HttpPost("Update")]
        public async Task<ActionResult<DataTable>> Update([FromForm] IFormCollection ifile, [FromHeader] long? PhotoID, [FromHeader] int PhotoType, [FromHeader] string PhotoTime, [FromHeader] int PhotoDate, [FromHeader] string Photo, [FromHeader] int? shopId, [FromHeader] int? employeeId, [FromHeader] string photoName, [FromHeader] string ShiftCode)
        {
            try
            {
                string subfolder = "/upload/" + PhotoDate.ToString() + "/";
                string fullpath = _webHostEnvironment.WebRootPath + subfolder +  "/";

                fullpath = FileExtends.boKhoangTrang(fullpath, "website", "mobile");

                fullpath = FileExtends.boKhoangTrang(fullpath, "gt-site", "mobile");
                fullpath = FileExtends.boKhoangTrang(fullpath, "alpha-site", "mobile");

                if (!Directory.Exists(fullpath))
                {
                    Directory.CreateDirectory(fullpath);
                }

                string urlImage = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, subfolder + "/");
                if (ifile != null && ifile.Files.Count > 0)
                {
                    string filename = photoName;
                    if (string.IsNullOrEmpty(Convert.ToString(photoName)))
                    {
                        filename = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + employeeId + "_" + shopId + Path.GetExtension(ifile.Files[0].FileName);
                    }

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
                    Photo = urlImage + filename;
                }

                Task<DataTable> data = Task.Run(() => _service.Update(PhotoID, PhotoType, PhotoTime, PhotoDate, Photo, ShiftCode, UserId));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return BadRequest("Update thất bại");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }
        [HttpPost("InsertItem")]
        public async Task<ActionResult<DataTable>> InsertItem([FromForm] IFormCollection ifile, [FromHeader] int employeeId, [FromHeader] int shopId, [FromHeader] int photoDate, [FromHeader] string photoTime, [FromHeader] int photoType, [FromHeader] string photo, [FromHeader] string ShiftCode)
        {
            try
            {
                string subfolder = "/upload/" + photoDate.ToString() + "/";
                string fullpath = _webHostEnvironment.WebRootPath + subfolder + "/";

                fullpath = FileExtends.boKhoangTrang(fullpath, "website", "mobile");

                fullpath = FileExtends.boKhoangTrang(fullpath, "gt-site", "mobile");

                fullpath = FileExtends.boKhoangTrang(fullpath, "alpha-site", "mobile");

                if (!Directory.Exists(fullpath))
                {
                    Directory.CreateDirectory(fullpath);
                }
                string urlImage = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, subfolder +  "/");
                if (ifile != null && ifile.Files.Count > 0)
                {
                    string filename = "";
                    filename = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + employeeId + "_" + shopId + Path.GetExtension(ifile.Files[0].FileName);

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
                    photo = urlImage + filename;
                }
                if (string.IsNullOrEmpty(Convert.ToString(photo)))
                {
                    return BadRequest("Insert thất bại");

                }
                else
                {
                    Task<DataTable> data = Task.Run(() => _service.InsertItem(employeeId, shopId, photoDate, photoTime, photoType, photo, ShiftCode, UserId));
                    if (data.Result.Rows.Count > 0)
                        return data.Result;
                    else
                        return BadRequest("Insert thất bại");
                }

            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Insert")]
        public async Task<ActionResult<DataTable>> Insert([FromForm] IFormCollection ifile, [FromHeader] int employeeId, [FromHeader] int shopId, [FromHeader] string photoTime, [FromHeader] int photoType, [FromHeader] decimal? latitude, [FromHeader] decimal? longitude, [FromHeader] string ShiftCode)
        {
            try
            {
                string photo = "";
                string photoDate = photoTime.Substring(0, 10);
                photoDate = FileExtends.boKhoangTrang(photoDate, "-", "");

                string subfolder = "/upload/" + photoDate.ToString() + "/";
                string fullpath = _webHostEnvironment.WebRootPath + subfolder + "/";

                fullpath = FileExtends.boKhoangTrang(fullpath, "website", "mobile");

                fullpath = FileExtends.boKhoangTrang(fullpath, "gt-site", "mobile");

                fullpath = FileExtends.boKhoangTrang(fullpath, "alpha-site", "mobile");

                if (!Directory.Exists(fullpath))
                {
                    Directory.CreateDirectory(fullpath);
                }
                string urlImage = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, subfolder + "/");
                if (ifile != null && ifile.Files.Count > 0)
                {
                    string filename = "";
                    filename = DateTime.Now.ToString("yyyyMMddHHmmssfff") + "_" + employeeId + "_" + shopId + Path.GetExtension(ifile.Files[0].FileName);

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
                    photo = urlImage + filename;
                }

                Task<DataTable> data = Task.Run(() => _service.Insert(employeeId, shopId, photoTime, photoType, photo, latitude, longitude, ShiftCode, UserId));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return BadRequest("Insert Thất bại");
            }
            catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
       
        [HttpPost("DeleteAll")]
        public ActionResult<AlertModel> DeleteAll([FromHeader] int shopId, [FromHeader] int employeeId, [FromHeader] int photoDate, [FromHeader] string ShiftCode)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.DeleteAll(shopId, employeeId, photoDate, ShiftCode, UserId));
                if (data.Result > 0)
                    return (new AlertModel(1, "Delete thành công", null));
                else
                    return (new AlertModel(-1, "Delete thất bại", null));
            }
            catch (Exception ex)
            {
                return (new AlertModel(-2, ex.Message, ""));
            }
        }
        // DELETE Item
        [HttpPost("DeleteItem")]
        public ActionResult<AlertModel> DeleteItem([FromHeader] long photoId)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.DeleteItem(photoId));
                if (data.Result > 0)
                    return (new AlertModel(1, "Delete thành công", null));
                else
                    return (new AlertModel(-1, "Delete thất bại", null));
            }
            catch (Exception ex)
            {
                return (new AlertModel(-2, ex.Message, ""));
            }
        }
        [HttpGet("GetShift")]
        public ActionResult<DataTable> GetShift ([FromHeader] int EmployeeId, [FromHeader] int ShopId, [FromHeader] string WorkDate, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetShift(accId ?? AccountId, EmployeeId, ShopId, WorkDate));
                if(data.Result.Rows.Count > 0)
                {
                    return data.Result;
                }
                return BadRequest(-1);
            } catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
