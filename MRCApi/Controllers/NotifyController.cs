using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using MRCApi.ClientModel;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class NotifyController : SpiralBaseController
    {
        public readonly IMessengerService _service;
        public readonly IEmployeeService _serviceEmployee;
        private readonly IWebHostEnvironment _hostingRoot;
        private readonly FirebaseService _firebaseService;
        public NotifyController(MessengerContext _context, EmployeeContext employeeContext, IWebHostEnvironment hostingEnvironment)
        {
            this._hostingRoot = hostingEnvironment;
            _service = new MessengerService(_context);
            _serviceEmployee = new EmployeeService(employeeContext);

            string serviceAccountFilePath = "wwwroot/path/to/marico-mt-a612d-firebase-adminsdk-riljr-84c94aeea8.json";
            _firebaseService = new FirebaseService(serviceAccountFilePath);

        }
        [HttpPost("list")]
        public ActionResult GetList([FromBody] NotifySearch Params)
        {
            var data = _service.GetList(AccountId, Params.Month, Params.Year, Params.Status, Params.notifyType, Params.employeeId, UserId, Params.Position, Params.notifyTitle);
            return Ok(data.Result);
        }
        [HttpGet("notifygroup")]
        public ActionResult GetNotifyGroup()
        {
            var data = _service.GetNotifyGroup(AccountId, UserId);
            return Ok(data.Result);
        }
        [HttpGet("notifyTitle")]
        public ActionResult GetNotifyTitle()
        {
            var data = _service.GetNotifyTitle(AccountId, UserId);
            return Ok(data.Result);
        }
        [HttpGet("remove")]
        public ActionResult RemoveNotify([FromHeader] string IdList)
        {
            var data = _service.RemoveNotify(AccountId, IdList, UserId);
            return Ok(data.Result);
        }

        [HttpPost("sendall")]
        public ActionResult SendAllNotify([FromBody] NotifySearch Params)
        {
            try
            {
                string accessToken = Task.Run(()=> _firebaseService.GetAccessTokenAsync()).Result ;

                List<MessengerModel> data = new List<MessengerModel>();
                if (!string.IsNullOrEmpty(Params.SelectedNotify) && !string.IsNullOrWhiteSpace(Params.SelectedNotify))
                {
                    data = JsonConvert.DeserializeObject<List<MessengerModel>>(Params.SelectedNotify);
                }
                else data = _service.GetList(AccountId, Params.Month, Params.Year, Params.Status, Params.notifyType, Params.employeeId, UserId, Params.Position, Params.notifyTitle).Result;
                string idList = "";
                if (data != null && data.Count > 0)
                {
                    foreach (MessengerModel send in data)
                    {
                        if (send.Token != null)
                        {
                            var x = Task.Run(() => NotificationsManager.SendMessage(AccountId, accessToken, send.Token, send.Title, send.Body,null, null, null, send.HyperLinks, send.ImageUrl,null,null));
                            x.Wait(100);
                            if (x.Result.ToString().Equals("OK"))
                            {
                                idList += send.Id + ";";
                            }
                        }
                    }

                    if (idList.Length > 1)
                    {
                        var updateSended = Task.Run(() => _service.UpdateNotify(AccountId, idList, UserId)).Result;
                        return Ok("Đã gửi " + data.Count);
                    }
                    else
                    {
                        return Ok("Chưa gửi được thông báo nào");
                    }

                }
                else
                {
                    return Ok("Không có dữ liệu phù hợp để gửi");
                }
            }
            catch(Exception ex)
            {
                return Ok(ex.Message);
            }
        }
        [HttpPost("import")]
        public async Task<IActionResult> Import([FromForm] IFormCollection ifiles, [FromHeader] int Year, [FromHeader] int Month)
        {
            string sWebRootFolder = _hostingRoot.WebRootPath;
            if (ifiles != null && ifiles.Files.Count > 0)
            {
                var file = ifiles.Files[0];
                using (var memoryStream = new MemoryStream())
                {
                    await file.CopyToAsync(memoryStream);
                    var fileBytes = memoryStream.ToArray();
                    memoryStream.Write(fileBytes, 0, fileBytes.Length);
                    ExcelPackage.LicenseContext = LicenseContext.Commercial;
                    ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                    using (ExcelPackage package = new ExcelPackage(memoryStream))
                    {
                        if (package != null && package.Workbook.Worksheets.Count > 0)
                        {
                            try
                            {
                                DataTable dtImport = ImportNotify.tableNotify("Import");
                                ExcelWorksheet sheet = package.Workbook.Worksheets["data"];
                                if (sheet == null)
                                    sheet = package.Workbook.Worksheets[1];
                                var employees = await _serviceEmployee.GetByAccount(AccountId, UserId, null, null);
                                string alert = ImportNotify.ReadNotify(ref dtImport, employees, sheet, "Notify");
                                if (alert.Length > 1)
                                {
                                    return Ok(new ResultInfo(1, alert, null));
                                }
                                else if (dtImport.Rows.Count > 0)
                                {
                                    var value = Task.Run(() => _service.ImportNotify(AccountId, Month, Year, UserId, dtImport)).Result;
                                    if (value > 0)
                                        return Ok(new ResultInfo(1, "Insert data success " + value + " rows", null));
                                    else
                                        return Ok(new ResultInfo(1, "Error Insert Data", null));
                                }
                                else
                                {
                                    return Ok(new ResultInfo(1, "Data is empty", null));
                                }
                            }
                            catch (Exception ex)
                            {
                                return Ok(new ResultInfo(1, "Exception " + ex, null));
                            }
                        }
                        else
                        {
                            return Ok(new ResultInfo(1, "Worksheet not exist ", null));
                        }
                    }
                }
            }
            else
            {
                return Ok(new ResultInfo(1, "File not found", null));
            }
        }
        [HttpPost("sendbycontent")]
        public async Task<ActionResult> SendByContent([FromBody] NotifyRequestInfo data)
        {
            DataTable dtSave = ImportNotify.tableNotify("Import");
            string[] emps = data.employees.Split(',');
            foreach (var item in emps)
            {
                DataRow dataRow = dtSave.NewRow();
                dataRow["Title"] = data.title;
                dataRow["Body"] = data.content;
                dataRow["HyperLinks"] = data.hyperlinks;
                dataRow["UserId"] = Convert.ToInt32(item);
                dataRow["TypeReport"] = data.sendType;
                dataRow["ImageUrl"] = data.imageurl;
                dtSave.Rows.Add(dataRow);
            }
            var value = await Task.Run(() => _service.ImportNotify(AccountId, DateTime.Now.Month, DateTime.Now.Year, UserId, dtSave));
            return Ok("Create notify success " + value);
        }
        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] NotifySearch Params)
        {
            string folder = _hostingRoot.WebRootPath;
            string subfolder = "export\\" + AccountId.ToString();

            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Export_Notify_{AccountId.ToString()}_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);

            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_Notify_Export.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (var package = new ExcelPackage(file))
                {
                    var sheet = package.Workbook.Worksheets["Notify"];
                    if (sheet != null)
                    {
                        await Task.Yield();
                        Task<DataTable> data = Task.Run(() => _service.Export(AccountId, Params.Month, Params.Year, Params.Status, Params.notifyType, Params.employeeId, UserId, Params.Position, Params.notifyTitle));
                        if (data.Result.Rows.Count > 0)
                        {
                            sheet.View.ShowGridLines = false;
                            ExcelFormatTimeShift.BorderCell(sheet.Cells[2, 1, data.Result.Rows.Count + 2, data.Result.Columns.Count]);
                            //load data
                            sheet.Cells[2, 1].LoadFromDataTable(data.Result, true);
                        }
                        else
                        {
                            return (new ResultInfo(-1, "No data", null));
                        }
                    }
                    package.Save();
                    return (new ResultInfo(1, "Successfully Exported", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
                }

            }
            catch (Exception ex)
            {
                return (new ResultInfo(-2, ex.Message, null));
            }
        }
    }
}