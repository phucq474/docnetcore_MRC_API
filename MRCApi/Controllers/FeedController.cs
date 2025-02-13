using System;
using System.Data;
using System.Drawing;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralService;
using MRCApi.ClientModel;

namespace MRCApi.Controllers
{
    public class FeedController : SpiralBaseController
    {
        private readonly IEmployeeService _employee;
        public readonly IWebHostEnvironment _webroot;
        public FeedController(EmployeeContext context, IWebHostEnvironment webHost)
        {
            _employee = new EmployeeService(context);
            _webroot = webHost;
        }
        [HttpPost("newfeed")]
        public ActionResult<DataTable> newfeed([FromHeader] int indexFrom, [FromHeader] int indexTo,[FromBody] FeedSearchModel searchModal)
        {
            try
            {
                var data = Task.Run(() => _employee.newfeed(EmployeeId, indexFrom, indexTo, searchModal.searchFeed));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("feeddetail")]
        public ActionResult<DataTable> feeddetail([FromHeader] string feedKey)
        {
            try
            {
                var data = Task.Run(() => _employee.feeddetail(EmployeeId, feedKey));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("usershare")]
        public ActionResult<DataTable> usershare()
        {
            try
            {
                var data = Task.Run(() => _employee.usershare(AccountId, EmployeeId));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("feedcomment")]
        public ActionResult<DataTable> feedcomment([FromBody] FeedCommentInfo info)
        {
            try
            {
                var data = Task.Run(() => _employee.FeedComment(EmployeeId, info.FeedKey, info.FeedLike, info.LikeList, info.FeedComment, info.FeedMore));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("createfeed")]
        public ActionResult<DataTable> createfeed([FromBody] FeedDataInfo info)
        {
            try
            {
                var data = Task.Run(() => _employee.createfeed(AccountId,EmployeeId,info.FeedData,info.HasTag,info.FollowList,info.ViewList,info.FeedType));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("feedupdate")]
        public ActionResult<DataTable> feedupdate([FromHeader] int feedId,[FromBody] FeedDataInfo info)
        {
            try
            {
                var data = Task.Run(() => _employee.feedupdate(AccountId, EmployeeId,feedId, info.FeedData, info.HasTag, info.FollowList, info.ViewList, info.FeedType));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("feedPhoto")]
        public ActionResult<DataTable> FeedPhoto([FromBody] PhotoFileInfo photoFile)
        {
            try
            {
                if (photoFile.fileBase64 == null)
                    return BadRequest("File Not Found");
                string url = "/upload/" + photoFile.photoDate + "/";
                string root = _webroot.WebRootPath + Path.Combine(url);
                root = root.Replace("website", "mobile").Replace("gt-site","mobile");
                if (!Directory.Exists(root))
                    Directory.CreateDirectory(root);
                Byte[] bytes = Convert.FromBase64String(photoFile.fileBase64);
                using (var ms = new MemoryStream(bytes))
                {
                    Bitmap bmap = new Bitmap(ms);
                    bmap.Save(root + "/" + photoFile.fileName, System.Drawing.Imaging.ImageFormat.Jpeg);
                    bmap.Dispose();
                }
                return BadRequest("Success");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        public class FeedSearchModel
        {
            public string? searchFeed { set; get; }
        }
    }
}
