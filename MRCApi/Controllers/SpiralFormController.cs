using Azure.Core;
using DocumentFormat.OpenXml.Spreadsheet;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MRCApi;
using MRCApi.ClientModel;
using MRCApi.Controllers;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class SpiralFormController : SpiralBaseController
    {
        private readonly ISpiralFormService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly ISpiralFormResultService _spiralFormResultService;
        private readonly IEmployeeService _employeeService;
        private readonly IShopService _shopService;
        private readonly IMessengerService _messengerService;
        private ILogsService _logsService;
        private readonly FirebaseService _firebaseService;

        public SpiralFormController(SpiralFormContext formContext, MessengerContext messengerContext, SpiralFormResultContext spiralFormResultContext, EmployeeContext employeeContext, ShopContext shopContext, IWebHostEnvironment hostingEnvironment, ILogsService logsService)
        {
            _service = new SpiralFormService(formContext);
            _spiralFormResultService = new SpiralFormResultService(spiralFormResultContext);
            _employeeService = new EmployeeService(employeeContext);
            _shopService = new ShopService(shopContext);
            _messengerService = new MessengerService(messengerContext);
            this._hostingEnvironment = hostingEnvironment;
            this._logsService = logsService;

            string serviceAccountFilePath = "path/to/your-service-account-file.json";
            _firebaseService = new FirebaseService(serviceAccountFilePath);

        }

        [HttpPost("create")]
        public async Task<ActionResult<SpiralFormEntity>> Createform([FromBody] SpiralFormEntity form)
        {
            try
            {
                form.AccountId = AccountId;
                form.AccessKey = form.AccessKey ?? Guid.NewGuid().ToString();
                form.CreateBy = EmployeeId;
                form.CreateDate = DateTime.Now;
                form.Status = 1;
                //Save File banner
                if (!string.IsNullOrEmpty(form.Banner))
                {
                    Banner banner = JsonConvert.DeserializeObject<Banner>(form.Banner);
                    if (!string.IsNullOrEmpty(banner.imageData))
                    {
                        banner.imageURL = SaveImage(banner.imageData, form.AccessKey);
                        banner.imageData = null;
                        form.Banner = JsonConvert.SerializeObject(banner);
                    }
                }
                // images
                List<QuestionModel> lstQuestion = JsonConvert.DeserializeObject<List<QuestionModel>>(form.FormData);
                for (int q = 0; q < lstQuestion.Count; q++)
                {
                    var question = lstQuestion[q];
                    if (question.images != null)
                        if (question.images.Count() > 0)
                        {
                            List<ImageModel> lst = new List<ImageModel>();
                            for (int i = 0; i < question.images.Count(); i++)
                            {
                                var image = question.images[i];
                                if (!string.IsNullOrEmpty(image.imageData))
                                {
                                    lst.Add(new ImageModel { imageId = i + 1, imageData = null, imageURL = SaveImage(image.imageData, Guid.NewGuid().ToString()), imageHeight = 125 });
                                }
                                else
                                {
                                    lst.Add(image);
                                }
                            }
                            lstQuestion[q].images = lst;
                        }

                    for (int a = 0; a < question.anwserItem.Count; a++)
                    {
                        var answer = question.anwserItem[a];
                        if (answer.id < 100 && answer.images != null)
                        {
                            List<ImageModel> lstItem = new List<ImageModel>();
                            for (int i = 0; i < answer.images.Count(); i++)
                            {
                                var image = answer.images[i];
                                if (!string.IsNullOrEmpty(image.imageData))
                                {
                                    lstItem.Add(new ImageModel { imageId = i + 1, imageData = null, imageURL = SaveImage(image.imageData, Guid.NewGuid().ToString()), imageHeight = 125 });
                                }
                                else
                                {
                                    lstItem.Add(image);
                                }
                            }
                            lstQuestion[q].anwserItem[a].images = lstItem;
                        }
                    }
                }
                form.FormData = JsonConvert.SerializeObject(lstQuestion);

                var results = await _service.CreateForm(form, UserId, AccountId);
                return results;
            }
            catch (Exception ex)
            {
                return BadRequest("Lỗi chưa lưu được " + ex.Message);
            }
        }
        public class Banner
        {
            public int? imageId { get; set; }
            public string imageURL { get; set; }
            public string imageData { get; set; }
            public int? imageHeight { get; set; }
        }
        public string SaveImage(string imageData, string GUIID)
        {
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "upload/form/" + AccountId.ToString() + "/" + DateTime.Now.ToString("yyyyMMdd");
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
            }
            string fileName = GUIID + ".jpeg";
            string ImagePath = Path.Combine(folder, subfoler, fileName);
            using (FileStream fs = new FileStream(ImagePath, FileMode.Create, FileAccess.ReadWrite))
            {
                byte[] data = FileExtends.Base64ToByte(imageData.Split(',')[1]);
                fs.Write(data, 0, data.Length);
            }
            return subfoler + "/" + fileName;
        }
        [HttpGet("accesskey")]
        public async Task<ActionResult<SpiralFormEntity>> accesskey([FromHeader] string accessKey)
        {
            try
            {
                HostString Host = Request.Host;
                var result = await _service.GetByKey(accessKey, Convert.ToString(Host));
                return result;
            }
            catch (Exception ex)
            {
                return Ok(new SpiralFormEntity { Id = 0, Title = "Lỗi  " + ex.Message });
            }
        }
        [AllowAnonymous]
        [HttpGet("GetById")]
        public async Task<ActionResult> GetById([FromQuery] string publicKey, string appShare)
        {
            try
            {
                int UserId = 0;

                HostString Host = Request.Host;
                if (!string.IsNullOrEmpty(appShare))
                {
                    string json = Helpers.DecodeBase64(appShare.Replace(" ", "+"));
                    BodyModel dt = JsonConvert.DeserializeObject<BodyModel>(json);
                    UserId = Convert.ToInt32(dt.EmployeeId);
                }
                var hp = Request.Scheme + "://" + Request.Host + Request.Path + Request.QueryString;
                Task<int> logs = Task.Run(() => _logsService.Write(new LogsEntity("SpiralForm", hp, DateTime.Now, UserId, 0)));

                var data = _service.GetByKey(publicKey, Convert.ToString(Host));
                var result = data.Result;
                if (result != null)
                {
                    SpiralFormModel form = new SpiralFormModel();
                    form.Id = result.Id;
                    form.Slogan = result.Slogan;
                    form.SubTitle = result.SubTitle;
                    form.Title = result.Title;
                    form.ToDate = result.ToDate;
                    form.Position = result.Position;
                    form.UsedEmployees = result.UsedEmployees;
                    form.UsedStores = result.UsedStores;
                    form.AccessKey = result.AccessKey;
                    form.AccountId = result.AccountId;
                    form.Banner = result.Banner;
                    form.CreateBy = UserId;
                    form.CreateDate = result.CreateDate;
                    form.FormData = result.FormData;
                    form.FromDate = result.FromDate;
                    form.ToDate = result.ToDate;
                    form.PositionList = result.PositionList;
                    form.MMobile = result.MMobile;
                    if (result.UsedEmployees == true)
                    {
                        var lstEmployee = await _employeeService.GetEmployeeDDL(result.AccountId, UserId, result.Position, null, result.PositionList, Convert.ToInt32(form.Id));
                        form.Employees = JsonConvert.SerializeObject(lstEmployee);
                    }
                    return Ok(form);
                }
                else
                    return Ok(new SpiralFormModel { Id = 0, Title = "Nodata" });
            }
            catch (Exception ex)
            {
                return Ok(new SpiralFormModel { Id = 0, Title = "Lỗi  " + ex.Message });
            }
        }
        [AllowAnonymous]
        [HttpGet("GetShops")]
        public async Task<List<ShopDDLModel>> GetShops([FromHeader] int AccountId, [FromHeader] int EmployeeId)
        {
            var result = new List<ShopDDLModel>();
            try
            {
                var lst = await _service.GetStore(AccountId, EmployeeId);
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
        [AllowAnonymous]
        [HttpPost("InsertResult")]
        public async Task<AlertModel> InsertResult([FromQuery] string publicKey, string appShare, [FromBody] SpiralFormModel jsonData)
        {
            try
            {
                int? AccountId = 0, UserId = 0, ShopId = 0;
                var hp = Request.Scheme + "://" + Request.Host + Request.Path + Request.QueryString;
                if (!string.IsNullOrEmpty(appShare))
                {
                    string json = Helpers.DecodeBase64(appShare.Replace(" ", "+"));
                    // string json = Helpers.DecodeBase64(appShare);
                    BodyModel dt = JsonConvert.DeserializeObject<BodyModel>(json);
                    AccountId = dt.AccountId;
                    UserId = dt.EmployeeId;
                    if (dt.ShopId > 0) ShopId = (int?)dt.ShopId;
                }
                SpiralFormResultEntity s = new SpiralFormResultEntity();
                s.AccountId = jsonData.AccountId;
                s.WorkDate = Convert.ToInt32(DateTime.Now.ToString("yyyyMMdd"));
                s.EmployeeId = jsonData.EmployeeId;
                if (ShopId > 0)
                    s.ShopId = ShopId;
                else
                    s.ShopId = jsonData.ShopId;
                s.FormId = jsonData.Id;
                s.HyperLink = hp;
                var lstQuestionData = JsonConvert.DeserializeObject<List<QuestionModel>>(jsonData.FormData);

                foreach (QuestionModel ques in lstQuestionData)
                {
                    foreach (AnswerModel item in ques.anwserItem)
                    {
                        if (item.anwserType == 8)
                        {
                            if (!string.IsNullOrEmpty(item.anwserValue))
                            {
                                List<string> lstAnswer = new List<string>();
                                var images = JsonConvert.DeserializeObject<List<ImageDataModel>>(item.anwserValue);
                                string folder = _hostingEnvironment.WebRootPath;
                                string subfoler = "upload/form/" + AccountId.ToString();
                                if (!System.IO.Directory.Exists(Path.Combine(folder, subfoler)))
                                {
                                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfoler));
                                }
                                foreach (ImageDataModel img in images)
                                {
                                    string fileName = jsonData.Id.ToString() + "_" + DateTime.Now.ToString("yyyyMMdd_HHmmss_fff") + ".jpeg";
                                    string ImagePath = Path.Combine(folder, subfoler, fileName);
                                    using (FileStream fs = new FileStream(ImagePath, FileMode.Create, FileAccess.ReadWrite))
                                    {
                                        byte[] dataImage = FileExtends.Base64ToByte(img.imageData);
                                        fs.Write(dataImage, 0, dataImage.Length);
                                    }
                                    lstAnswer.Add(subfoler + "/" + fileName);
                                }
                                item.anwserValue = JsonConvert.SerializeObject(lstAnswer);
                            }
                        }
                    }
                }
                s.FormData = JsonConvert.SerializeObject(lstQuestionData);
                s.CreatedBy = UserId;
                s.CreatedDate = DateTime.Now;

                var result = await _spiralFormResultService.InsertResult(s);


                return result > 0 ? new AlertModel(1, "Gửi thành công", result.ToString()) : new AlertModel(0, "Gửi thất bại", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(0, "Gửi lỗi: " + ex.Message, null);
            }
        }

        [HttpGet("list")]
        public async Task<ActionResult> GetList([FromHeader] int? fromDate, [FromHeader] string Title)
        {
            var results = await _service.GetList(AccountId, fromDate, Title, UserId);
            return Ok(results);
        }
        [HttpGet("GetResultTotal")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData)
        {
            Task<DataTable> data = Task.Run(() => _service.GetResultTotal(AccountId, UserId, JsonData));
            return data.Result;
        }
        [HttpGet("GetResultById")]
        public ActionResult<SpiralFormModel> GetList([FromHeader] long Id)
        {
            Task<SpiralFormModel> data = Task.Run(() => _service.GetResultById(AccountId, UserId, Id));
            return data.Result;
        }
        [HttpPost("UpdateResult")]
        public ActionResult<AlertModel> UpdateResult([FromBody] SpiralFormModel form)
        {
            try
            {
                Task<int> data = Task.Run(() => _service.UpdateResult(AccountId, UserId, form.Id, form.FormData));

                return data.Result > 0 ? new AlertModel(1, "Update successful", null) : new AlertModel(0, "Update fail", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(0, "Update fail", ex.Message);
                throw;
            }

        }
        [AllowAnonymous]
        [HttpPost("uploadImages")]
        public async Task<ActionResult<List<ResultInfo>>> uploadImages([FromForm] IFormCollection files)
        {
            var lst = new List<ResultInfo>();
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "upload/images/";
            string newPath = Path.Combine(subfoler, DateTime.Now.ToString("yyyyMMdd"));
            newPath = Path.Combine(folder, newPath);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (files.Files.Count > 0)
            {
                for (int i = 0; i < files.Files.Count; i++)
                {
                    var file = files.Files[i];
                    byte[] fileBytes;
                    var filename = DateTime.Now.ToString("yyyyMMdd_HHmmss_fff") + ".jpeg";
                    string downloadUrl = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, subfoler + DateTime.Now.ToString("yyyyMMdd") + "/" + filename);
                    try
                    {
                        using (var memoryStream = new MemoryStream())
                        {
                            await file.CopyToAsync(memoryStream);
                            fileBytes = memoryStream.ToArray();
                            memoryStream.Write(fileBytes, 0, fileBytes.Length);
                            Image img = System.Drawing.Image.FromStream(memoryStream, true);
                            img.Save(Path.Combine(newPath, filename), ImageFormat.Jpeg);
                            lst.Add(new ResultInfo(i, "Successful", downloadUrl));
                        }
                    }
                    catch (Exception ex)
                    {
                        lst.Add(new ResultInfo(i, "Fail: " + ex.Message, null));
                    }
                }
            }
            return lst;
        }
        [AllowAnonymous]
        [HttpPost("uploadAudio")]
        public async Task<ActionResult<List<ResultInfo>>> uploadAudio([FromForm] IFormCollection files)
        {
            var lst = new List<ResultInfo>();
            string folder = _hostingEnvironment.WebRootPath;
            string subfoler = "upload/audio/";
            string newPath = Path.Combine(subfoler, DateTime.Now.ToString("yyyyMMdd"));
            newPath = Path.Combine(folder, newPath);
            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (files.Files.Count > 0)
            {
                for (int i = 0; i < files.Files.Count; i++)
                {
                    var file = files.Files[i];
                    string fileExtension = FileExtends.boDau(file.FileName.Replace(" ", ""));

                    var filename = DateTime.Now.ToString("HHmmss_fff_") + fileExtension;
                    string downloadUrl = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, subfoler + DateTime.Now.ToString("yyyyMMdd") + "/" + filename);
                    try
                    {
                        using (FileStream fs = System.IO.File.Create(Path.Combine(newPath, filename)))
                        {
                            file.CopyTo(fs);
                            fs.Flush();
                            fs.Close();
                            lst.Add(new ResultInfo(i, "Successful", downloadUrl));
                        }
                        //using (var memoryStream = new MemoryStream())
                        //{
                        //    await file.CopyToAsync(memoryStream);
                        //    fileBytes = memoryStream.ToArray();
                        //    memoryStream.Write(fileBytes, 0, fileBytes.Length);
                        //    Image img = System.Drawing.Image.FromStream(memoryStream, true);
                        //    img.Save(Path.Combine(newPath, filename), ImageFormat.Jpeg);
                        //    lst.Add(new ResultInfo(i, "Successful", downloadUrl));
                        //}
                    }
                    catch (Exception ex)
                    {
                        lst.Add(new ResultInfo(i, "Fail: " + ex.Message, null));
                    }
                }
            }
            return lst;
        }
        [HttpGet("TabDetail")]
        public ActionResult<DataTable> TabDetail([FromHeader] int WorkDate, [FromHeader] int FormId, [FromHeader] int? SupervisorId, [FromHeader] string listEm)
        {
            Task<DataTable> data = Task.Run(() => _service.TabDeTail(AccountId, WorkDate, FormId, SupervisorId, listEm));
            return data.Result;
        }
        [HttpGet("ExportRawData")]
        public async Task<ResultInfo> ExportRawData([FromHeader] string JsonData)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchSpiralFormModel>(JsonData);
                string folder = _hostingEnvironment.WebRootPath;
                string subfolder = "export/" + AccountId.ToString();

                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                string fileName = null;
                string fileExport = null;
                FileInfo fileInfo = null;
                FileInfo file = null;

                if(dataJson.formId==42)
                {
                    fileName = $"MRC_Khảo sát NV sau 15 ngày onboard_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                    fileInfo = new FileInfo(Path.Combine(folder, "export/Template_MRC/tmp_survey_new_employee.xlsx"));
                    fileExport = Path.Combine(folder, subfolder, fileName);
                    file = fileInfo.CopyTo(fileExport);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (DataSet ds = await Task.Run(() => _service.ExportForm42(AccountId, UserId, JsonData)))
                    {
                        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            using (var package = new ExcelPackage(file))
                            {
                                var wsRaw = package.Workbook.Worksheets["Form khảo sát"];
                                if (wsRaw != null)
                                {
                                    wsRaw.Cells[5, 1].LoadFromDataTable(ds.Tables[0], false);

                                    ExcelFormats.Border(wsRaw, 5, 1, wsRaw.Dimension.Rows, wsRaw.Dimension.Columns);
                                }
                                package.Save();
                            }
                        }
                        else
                        {
                            return new ResultInfo(-1, "No Data", null);

                        }

                    }

                    return new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName));
                }
                else
                {
                    fileName = $"Form_RawData_{AccountId.ToString()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                    fileInfo = new FileInfo(Path.Combine(folder, "export/TemplateExcel/tmp_ExportSpiralForm_RowData.xlsx"));
                    fileExport = Path.Combine(folder, subfolder, fileName);
                    file = fileInfo.CopyTo(fileExport);

                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

                    using (DataSet ds = await Task.Run(() => _service.ExportRawData(AccountId, UserId, JsonData)))
                    {
                        if (ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                        {
                            using (var package = new ExcelPackage(file))
                            {
                                var wsRaw = package.Workbook.Worksheets["RawData"];
                                if (wsRaw != null)
                                {
                                    wsRaw.Cells[1, 1].Value = "RAWDATA - " + Convert.ToString(ds.Tables[0].Rows[0]["Title"]);
                                    wsRaw.Cells[3, 1].LoadFromDataTable(ds.Tables[0], true);

                                    ExcelFormats.FormatCell(wsRaw.Cells[3, 1, 3, wsRaw.Dimension.Columns], "lightblue", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                    ExcelFormats.Border(wsRaw, 3, 1, wsRaw.Dimension.Rows, wsRaw.Dimension.Columns);
                                }

                                var wsPivot = package.Workbook.Worksheets["Pivot"];
                                if (wsPivot != null)
                                {
                                    wsPivot.Cells[1, 1].Value = "PIVOT - " + Convert.ToString(ds.Tables[0].Rows[0]["Title"]);
                                    wsPivot.Cells[3, 1].LoadFromDataTable(ds.Tables[1], true);
                                    for (int col = 12; col < wsPivot.Dimension.Columns + 1; col++)
                                    {
                                        var colName = Convert.ToString(wsPivot.Cells[3, col].Value);
                                        DataRow[] rows = ds.Tables[2].Select("QuestionId= '" + colName + "'");
                                        if (rows.Count() > 0)
                                        {
                                            wsPivot.Cells[3, col].Value = rows[0]["Question"];
                                        }
                                    }
                                    ExcelFormats.FormatCell(wsPivot.Cells[3, 1, 3, ds.Tables[1].Columns.Count], "lightblue", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                    ExcelFormats.Border(wsPivot, 3, 1, wsPivot.Dimension.Rows, ds.Tables[1].Columns.Count);
                                }
                                package.Save();
                            }
                        }
                        else
                        {
                            return new ResultInfo(-1, "No Data", null);

                        }

                    }

                    return new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName));
                }


            }
            catch (Exception ex)
            {
                return (new ResultInfo(-2, ex.Message, null));
            }
        }
        [HttpGet("ExportImages")]
        public ActionResult<ResultInfo> ExportImage([FromHeader] string JsonData)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchSpiralFormModel>(JsonData);
                string folder = _hostingEnvironment.WebRootPath;
                string subfolder = "export/form/zip";

                string zipPath = Path.Combine(folder, subfolder);
                if (System.IO.Directory.Exists(zipPath))
                {
                    System.IO.Directory.Delete(zipPath, true);
                }

                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }

                //string pathXiaomi = ("D:/zHost/xami.spiral.com.vn/Mobile/Uploaded/Images/" + DateTime.Now.ToString("yyyyMMdd") + "/");
                //string startPath = "D:/zHost/xami.spiral.com.vn/Mobile/Uploaded/Shops/ImagesCopy/";
                string startPath = Path.Combine(folder, subfolder, "ImagesCopy");


                string zipName = "FormImages_" + DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".zip";

                //string pa = "D:/export";
                //string startS = "D:/Desktop/shop111/b11244cf3652d40c8d43.jpg";

                //string fileNameFF = System.IO.Path.GetFileName(startS);

                //string destFileFF = System.IO.Path.Combine(pa, fileNameFF);

                //if (System.IO.File.Exists(startS))
                //{
                //    System.IO.File.Copy(startS, destFileFF, true);
                //}
                //return;

                //var dir = new DirectoryInfo(startPath);


                //if (!System.IO.Directory.Exists(startPath))
                //{
                //    System.IO.Directory.CreateDirectory(startPath);
                //}

                //return;
                List<SpiralFormModel> lst = Task.Run(() => _service.ExportImage(AccountId, UserId, JsonData)).Result;
                if (lst.Count() > 0)
                {
                    foreach (SpiralFormModel item in lst)
                    {
                        string id = Convert.ToString(item.Id);
                        string workDate = Convert.ToString(item.WorkDate);
                        string employeeCode = ExcelExtends.RemoveSpecialCharacters(ExcelExtends.bodau(Convert.ToString(item.EmployeeCode).Replace(" ", "")));
                        string shopCode = Convert.ToString(item.ShopCode);
                        string questionId = Convert.ToString(item.QuestionId);
                        string rowNum = Convert.ToString(item.RowNum);
                        string[] answers = Convert.ToString(item.Answer).Split(',');
                        string destFile = Path.Combine(startPath, employeeCode);
                        if (!string.IsNullOrEmpty(shopCode)) destFile = Path.Combine(startPath, employeeCode, shopCode);
                        string fileName = string.Empty;
                        string sourceFile = string.Empty;
                        string destFileFF = string.Empty;

                        if (!System.IO.File.Exists(destFile))
                        {
                            System.IO.Directory.CreateDirectory(destFile);
                        }

                        if (answers.Count() > 0)
                        {
                            int count = 0;
                            foreach (var answer in answers)
                            {
                                fileName = Path.GetFileName(answer);
                                string fileExtention = Path.GetExtension(answer);
                                sourceFile = Path.Combine(folder, "upload/images", workDate, fileName);
                                destFileFF = Path.Combine(destFile, string.Format("{0}_{1}_{2}_{3}_{4}-{5}{6}", id, workDate, employeeCode, shopCode, questionId, Convert.ToString(count), fileExtention));
                                count++;
                                if (System.IO.File.Exists(sourceFile))
                                {
                                    System.IO.File.Copy(sourceFile, destFileFF, true);
                                }
                            }
                        }

                    }
                    if (!System.IO.Directory.Exists(zipPath))
                    {
                        System.IO.Directory.CreateDirectory(zipPath);
                    }
                    ZipFile.CreateFromDirectory(startPath, zipPath + "/" + zipName);

                    return new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, zipName));
                }
                else
                {
                    return (new ResultInfo(-2, "No data", null));
                }
            }
            catch (Exception ex)
            {
                return (new ResultInfo(-2, ex.Message, null));
            }
        }

        [HttpPost("InactiveSpiralForm")]
        public ActionResult<DataTable> InactiveSpiralForm([FromHeader] int FormId)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.InactiveSpiralForm(AccountId, FormId));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return Ok(-1);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("Delete_SpiralFormResult")]
        public ActionResult<DataTable> Delete_SpiralFormResult([FromHeader] int Id)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Delete_SpiralFormResult(AccountId, Id, UserId));
                if (data.Result.Rows.Count > 0)
                    return data.Result;
                else
                    return Ok(-1);

            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPost("SendEmail")]
        public ActionResult<ResultInfo> SendEmail([FromBody] EmailModel JsonData)
        {
            try
            {

                var result = EmailExtends.SendEmail_SpiralForm(AccountId, JsonData);
                return new ResultInfo(result, null, null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(-2, ex.Message, null);
            }
        }
        [HttpGet("Notify/GetEmployees")]
        public ActionResult<DataTable> Notify_GetEmployees([FromHeader] string JsonData)
        {
            Task<DataTable> data = Task.Run(() => _service.Notify_GetEmployees(AccountId, UserId, JsonData));
            return data.Result;
        }
        [HttpPost("SendNotification")]
        public async Task<ResultInfo> SendNotification([FromBody] List<MessengerModel> JsonData)
        {
            try
            {
                string accessToken = Task.Run(() => _firebaseService.GetAccessTokenAsync()).Result;

                DataTable dtSave = ImportNotify.tableNotify("Import");
                List<MessengerModel> lst = new List<MessengerModel>();
                foreach (MessengerModel send in JsonData)
                {
                    if (send.Token != null)
                    {

                        DataRow dataRow = dtSave.NewRow();
                        dataRow["Title"] = send.Title;
                        dataRow["Body"] = send.Body;
                        dataRow["HyperLinks"] = send.HyperLinks;
                        dataRow["UserId"] = Convert.ToInt32(send.UserId);
                        dataRow["TypeReport"] = send.TypeReport;
                        dtSave.Rows.Add(dataRow);

                        var x = await Task.Run(() => NotificationsManager.SendMessage(AccountId, accessToken, send.Token, send.Title, send.Body, null, null, null, send.HyperLinks, null, null, null));
                        if (x.ToString().Equals("OK"))
                        {
                            lst.Add(send);
                        }
                    }
                }
                var result = await Task.Run(() => _messengerService.ImportNotify(AccountId, DateTime.Now.Month, DateTime.Now.Year, UserId, dtSave));

                if (lst.Count() > 0)
                {
                    var value = await Task.Run(() => _service.Notify_UpdateMessenger(AccountId, UserId, JsonConvert.SerializeObject(lst)));
                    return new ResultInfo(1, "Đã gửi " + lst.Count().ToString(), null);
                }
                else
                {
                    return new ResultInfo(-2, "Chưa gửi được thông báo nào", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(-2, ex.Message, null);
            }
        }
        [AllowAnonymous]
        [HttpPost("AddressSurveyInsert")]
        public async Task<AlertModel> AddressSurveyInsert([FromQuery] string publicKey, string appShare, [FromBody] AddressSurveyModel jsonData)
        {
            try
            {
                int? AccountId = 0, UserId = 0;
                if (!string.IsNullOrEmpty(appShare))
                {
                    string json = Helpers.DecodeBase64(appShare);
                    BodyModel dt = JsonConvert.DeserializeObject<BodyModel>(json);
                    AccountId = dt.AccountId;
                    UserId = dt.EmployeeId;
                }

                var result = await _spiralFormResultService.AddressSurvey_Insert(AccountId, UserId, jsonData.FormData);

                return result > 0 ? new AlertModel(1, "Gửi thành công", result.ToString()) : new AlertModel(0, "Gửi thất bại", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(0, "Gửi lỗi: " + ex.Message, null);
            }
        }
    }
}