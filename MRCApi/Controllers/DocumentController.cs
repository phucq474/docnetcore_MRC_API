using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Drawing;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class DocumentController : SpiralBaseController
    {
        public readonly IDocumentService _service;
        private readonly IWebHostEnvironment _hostRoot;
        public DocumentController(DocumentContext _context, IWebHostEnvironment webHost)
        {
            _service = new DocumentService(_context);
            _hostRoot = webHost;
        }
        [HttpGet("list")]
        public ActionResult<List<DocumentModel>> GetList([FromHeader]int FromDate, [FromHeader]int? ToDate, [FromHeader]int? DocumentType)
        {
            var results = Task.Run(() => _service.GetList(AccountId, FromDate, ToDate, DocumentType, UserId)).Result;
            return Ok(results);
        }
        [HttpGet("Detail")]
        public ActionResult<DataTable> Detail([FromHeader] int Id)
        {
            Task<DataTable> data = Task.Run(() => _service.Detail(Id));
            return data.Result;
        }
        
        [HttpGet("remove")]
        public ActionResult RemoveDoc([FromHeader] int docId)
        {
            var results = Task.Run(() => _service.RemoveDoc(AccountId, docId)).Result;
            return Ok(results);
        }

        [HttpPost("upload")]
        public async Task<IActionResult> UploadFile([FromForm]IFormCollection files, [FromHeader] int? isConvert, [FromHeader]string StringData)
        {
            if (files != null && files.Files.Count > 0)
            {
                var data = System.Convert.FromBase64String(StringData);
                string strJson = "[" + System.Text.Encoding.UTF8.GetString(data) + "]";
                int Index = 0;
                List<ImageInfo> lstURL = new List<ImageInfo>();
                string fullpath = _hostRoot.WebRootPath + "\\upload\\document\\" + AccountId + "\\";

                fullpath = FileExtends.boKhoangTrang(fullpath, "website", "mobile");

                fullpath = FileExtends.boKhoangTrang(fullpath, "gt-site", "mobile");

                if (!Directory.Exists(fullpath))
                    Directory.CreateDirectory(fullpath);

                foreach (IFormFile uFile in files.Files)
                {
                    string FileName = null;
                    FileName = FileExtends.boDau(uFile.FileName);
                    FileName = FileExtends.boKhoangTrang(FileName).ToLower();

                    FileInfo fileInfo = new FileInfo(fullpath + FileName);
                    if (Directory.Exists(fileInfo.FullName))
                        Directory.Delete(fileInfo.FullName);
                    using (FileStream fs = new FileStream(fileInfo.FullName, FileMode.OpenOrCreate, FileAccess.ReadWrite))
                    {
                        await uFile.CopyToAsync(fs);
                        await fs.FlushAsync();
                        await fs.DisposeAsync();
                    }
                    
                    lstURL.Add(new ImageInfo("\\upload\\document\\" + AccountId + "\\" + FileName, FileExtends.boKhoangTrang(FileName, System.IO.Path.GetExtension(uFile.FileName), "").ToLower(), System.IO.Path.GetExtension(uFile.FileName).ToLower(), Index));
                    Index++;
                }
                //savedata
                string jsonPath = JsonConvert.SerializeObject(lstURL);
                await _service.CreateDoc(AccountId, strJson, jsonPath, ".json", UserId);
                return Ok("Success " + files.Files.Count);
            }
            else
            {
                return Ok("Chưa gửi file được, bạn vui lòng kiểm tra lại");
            }
        }

        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] int Id, [FromHeader] string listIndex)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Delete(Id, listIndex));
                if(data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(1, "Xóa thành công", "");
                }
                return new ResultInfo(0, "Xóa thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
    }
}