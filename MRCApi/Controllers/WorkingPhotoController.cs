using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRCApi.ClientModel;
using MRCApi.Extentions;
using Newtonsoft.Json;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class WorkingPhotoController : SpiralBaseController
    {
        private readonly IWorkingPhotoService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public WorkingPhotoController(WorkingPhotoContext context, IWebHostEnvironment hostingEnvironment)
        {
            _service = new WorkingPhotoService(context);
            this._hostingEnvironment = hostingEnvironment;
        }
        [HttpGet("ByShop")]
        public ActionResult GetPhoto([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            var data = _service.GetPhoto(accId ?? AccountId, JsonData);
            return Ok(data.Result);
        }
        [HttpGet("GetPhotoType")]
        public ActionResult<DataTable> GetPhotoType([FromHeader] int? reportId, [FromHeader] int? accId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetPhotoType(accId ?? AccountId, reportId)); 
                return data.Result;
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        [HttpPost("DeletePhoto")]
        public ActionResult DeletePhoto([FromHeader] int photoId)
        {
            try
            {
                int data = Task.Run(() => _service.DeletePhoto(UserId, photoId)).Result;
                if (data > 0)
                    return Ok(1);
                else
                    return Ok(-1);
            }
            catch (Exception ex)
            {
                return Ok(ex.Message);
            }
        }

        [HttpPost("Save")]
        public async Task<ResultInfo> SavePhoto([FromForm] PhotoSaveModel DataPhoto, [FromHeader] int? accId)
        {
            try
            {
                if (DataPhoto.Ifile != null)
                {
                    var ifile = DataPhoto.Ifile;

                    string folder = _hostingEnvironment.WebRootPath;
                    string subfolder = "/upload/" + DataPhoto.WorkDate.Replace("-", "");
                    string path = folder + subfolder;
                    if (!Directory.Exists(path))
                    {
                        Directory.CreateDirectory(path);
                    }
                    string filename = string.Format("{0}{1}", Guid.NewGuid().ToString(), Path.GetExtension(ifile.FileName));
                    string urlImage = string.Format("{0}/{1}", path, filename);

                    FileInfo fileInfo = new FileInfo(urlImage);
                    if (Directory.Exists(fileInfo.FullName))
                    {
                        Directory.Delete(fileInfo.FullName);
                    }
                    using (FileStream fs = new FileStream(fileInfo.FullName, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                    {
                        await ifile.CopyToAsync(fs);
                        await fs.FlushAsync();
                        await fs.DisposeAsync();
                    }

                    DataPhoto.Photo = string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, filename); ;

                    if (string.IsNullOrEmpty(DataPhoto.Photo))
                    {
                        return new ResultInfo(500, "Thất bại", "");
                    }
                    else
                    {
                        string jsond = JsonConvert.SerializeObject(DataPhoto);
                        int result = Task.Run(() => _service.Save(UserId, jsond, AccountId)).Result;
                        if (result > 0)
                            return new ResultInfo(200, "Thành công", "");
                        else
                            return new ResultInfo(500, "Thất bại", "");
                    }
                }
                else
                    return new ResultInfo(500, "Không có dữ liệu", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }

    }
}
