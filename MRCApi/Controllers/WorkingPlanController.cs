using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;
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
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.ClientModel;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class WorkingPlanController : SpiralBaseController
    {
        public readonly IWorkingPlanService _service;
        public readonly ITaskListService _taskListService;
        public readonly IShiftListService _shiftListService;
        public readonly IEmployeeService _employeeService;
        public readonly IMessengerService _messengerService;
        public readonly IMobileService _mobileService;
        public readonly IEmployeeTypesService _employeeTypesService;
        public readonly IShopService _shopService;
        public readonly IWebHostEnvironment _hostingEnvironment;
        public readonly IEmployeeStoreService _employeeStoreService;

        public WorkingPlanController(WorkingPlanContext _context, MobileContext _mobileContext, EmployeeContext _employeeContext, MessengerContext _messengerContext, ShiftListContext _shiftListContext, TaskListContext _taskListContext, IWebHostEnvironment _hosting, EmployeeTypeContext employeeType, ShopContext shopContext, EmployeeStoreContext employeeStore)
        {
            _service = new WorkingPlanService(_context);
            _taskListService = new TaskListService(_taskListContext);
            _shiftListService = new ShiftListService(_shiftListContext);
            _employeeService = new EmployeeService(_employeeContext);
            _messengerService = new MessengerService(_messengerContext);
            _mobileService = new MobileService(_mobileContext);
            _employeeTypesService = new EmployeeTypesService(employeeType);
            _shopService = new ShopService(shopContext);
            _employeeStoreService = new EmployeeStoreService(employeeStore);
            this._hostingEnvironment = _hosting;
        }
        [HttpGet("GetList")]
        public ActionResult<DataTable> GetList([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            Task<DataTable> data = Task.Run(() => _service.GetList(UserId, JsonData, accId ?? AccountId));
            return data.Result;
        }
        [HttpGet("GetDetail")]
        public ActionResult<DataTable> GetDetail([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            Task<DataTable> data = Task.Run(() => _service.GetDetail(UserId, JsonData, accId ?? AccountId));
            return data.Result;
        }
        [HttpGet("GetShiftList")]
        public ActionResult<List<ShiftListEntity>> GetShiftList([FromHeader] int? accId)
        {
            List<ShiftListEntity> data = _shiftListService.GetList(accId ?? AccountId);
            return data;
        }
        [HttpPost("Confirm")]
        public ActionResult<AlertModel> Confirm([FromBody] string JsonData, [FromHeader] int? accId)
        {
            int result = 0;
            try
            {
                Task<int> data = Task.Run(() => _service.Confirm(UserId, JsonData, accId ?? AccountId));
                result = data.Result;
                if (result > 0)
                    return new AlertModel(1, "Successful", null);
                else
                    return new AlertModel(-1, "Fail", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(-1, "Error: " + ex.Message, null);
            }
        }
        [HttpPost("ChangeShift")]
        public ActionResult<AlertModel> ChangeShift([FromBody] string JsonData, [FromHeader] int? accId)
        {
            int result = 0;
            try
            {
                Task<int> data = Task.Run(() => _service.ChangeShift(UserId, JsonData, accId ?? AccountId));
                result = data.Result;
                if (result > 0)
                    return new AlertModel(1, "Successful", null);
                else
                    return new AlertModel(-1, "Fail", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(-1, "Error: " + ex.Message, null);
            }
        }
        [HttpPost("Filter")]
        public ActionResult<DataSet> Filter([FromBody] WorkingPlanSearch Params, [FromHeader] int? accId)
        {
            Task<DataSet> data = Task.Run(() => _service.WorkingPlan_Filter(accId ?? AccountId, Params.EmployeeId, Params.PlanDate, Params.CustomerId, Params.Area, Params.ProvinceId, Params.ShopCode));
            return data.Result;
        }
        [HttpPost("SaveWorkingPlanDaily")]
        public async Task<ResultInfo> WorkingPlanDaily_Save([FromBody] WorkingPlanSearch Params, [FromHeader] int? accId)
        {
            try
            {
                var result = await Task.Run(() => _service.WorkingPlan_Save(UserId, accId ?? AccountId, Params.EmployeeId, Params.PlanDate, Params.CustomerId, Params.Area, Params.ProvinceId, Params.ShopCode, Params.ShopSave));
                if (result.Count > 0)
                {
                    return new ResultInfo(result[0].Status, result[0].Message, "");
                }
                else
                    return new ResultInfo(500, "Không thành công", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpPost("Export_LichLamViec")]
        public async Task<ResultInfo> Export_LichLamViec([FromBody] string jsonData, [FromHeader] int? accId)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);

            string folder = _hostingEnvironment.WebRootPath;
            string subfolder = "export/WorkingPlan";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Lich Lam Viec_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/templateExcel/tmp_WorkingPlan.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.Export_LichLamViec(UserId, jsonData, accId ?? AccountId)))
                {
                    if (data.Tables[0].Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            if (data.Tables[0].Rows.Count > 0)
                            {
                                var sheet = pk.Workbook.Worksheets["LLV"];
                                sheet.Cells[2, 5].Value = string.Format("Từ ngày: {0} - Đến ngày: {1}", dataJson.fromdate, dataJson.todate);
                                sheet.Cells[1, 4].Value = "LỊCH LÀM VIỆC";
                                sheet.Cells[6, 1].LoadFromDataTable(data.Tables[0], true);

                                // Format DayName
                                string header = string.Empty;
                                int startColumn = 15;
                                //if (dataJson.Position == 2) startColumn = startColumn + 2;
                                for (int c = startColumn; c <= sheet.Dimension.End.Column; c++)
                                {
                                    header = Convert.ToString(sheet.Cells[6, c].Value);
                                    string[] key = header.Split('_');
                                    if (key.Count() == 2)
                                    {
                                        sheet.Column(c).Width = 11.73;
                                        sheet.Cells[5, c].Value = key[0];
                                        sheet.Cells[6, c].Value = key[1];
                                        sheet.Cells[5, c].Style.Font.Color.SetColor(ColorTranslator.FromHtml("#FFFFFF"));
                                        ExcelFormats.FormatCell(sheet.Cells[5, c], "#305496", true, ExcelHorizontalAlignment.Center);
                                        ExcelFormats.FormatCell(sheet.Cells[6, c], "#FFE699", true, ExcelHorizontalAlignment.Center);

                                        if (sheet.Cells[5, c].Value.ToString() == "CN")
                                        {
                                            ExcelFormats.FormatCell(sheet.Cells[5, c], "#C65911", true, ExcelHorizontalAlignment.Center);
                                        }

                                    }

                                }

                                // Merge Header
                                sheet.Cells[4, startColumn, 4, sheet.Dimension.End.Column].Merge = true;
                                sheet.Cells[4, startColumn, sheet.Dimension.End.Row, sheet.Dimension.End.Column].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;

                                // Format Cell all
                                ExcelFormats.Border(sheet, 4, 1, sheet.Dimension.End.Row, sheet.Dimension.End.Column);
                                sheet.Cells[4, startColumn, sheet.Dimension.End.Row, sheet.Dimension.End.Column].AutoFitColumns();

                            }
                            else
                            {
                                return new ResultInfo(0, "Không có dữ liệu", "");
                            }

                            // Sheet 2
                            if (data.Tables[1].Rows.Count > 0)
                            {
                                var sheet = pk.Workbook.Worksheets["DS ca làm việc"];
                                sheet.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                                sheet.Cells[3, sheet.Dimension.Columns].Style.Font.Bold = true;
                                ExcelFormats.FormatCell(sheet.Cells[3, 1, 3, sheet.Dimension.Columns], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                                // Format Cell all
                                ExcelFormats.Border(sheet, 3, 1, sheet.Dimension.Rows + 2, sheet.Dimension.Columns);

                            }
                            if (data.Tables.Count > 2)
                            {
                                if (data.Tables[2].Rows.Count > 0)
                                {
                                    var sheet = pk.Workbook.Worksheets["LLV up by Admin"];
                                    sheet.Cells[1, 1].LoadFromDataTable(data.Tables[2], true);

                                   // sheet.Cells[1, sheet.Dimension.Columns].Style.Font.Bold = true;
                                    ExcelFormats.FormatCell(sheet.Cells[1, 1,1, sheet.Dimension.Columns], "#A9D08E", true, ExcelHorizontalAlignment.Center);

                                    // Format Cell all
                                    ExcelFormats.Border(sheet, 1, 1, sheet.Dimension.Rows , sheet.Dimension.Columns);
                                }
                            }

                            // ChangePlan
                            using (DataTable dt = await Task.Run(() => _service.Export_ChangeWP_RawData(UserId, jsonData, accId ?? AccountId)))
                            {
                                if (dt.Rows.Count > 0)
                                {
                                    var wsChangePlan = pk.Workbook.Worksheets["ChangePlan"];
                                    if (wsChangePlan != null)
                                    {
                                        wsChangePlan.Cells[4, 1].LoadFromDataTable(dt, false);
                                        ExcelFormats.Border(wsChangePlan, 3, 1, wsChangePlan.Dimension.Rows, wsChangePlan.Dimension.Columns);
                                    }
                                }
                            }

                            pk.Save();
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
                return new ResultInfo(500, ex.Message, "");
            }
        }

        [HttpPost("Template_LLV_PGM")]
        public async Task<ActionResult<ResultInfo>> Template_LLV_PGM([FromBody] string JsonData, [FromHeader] int? accId)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
            var dataType = _employeeTypesService.GetById(Convert.ToInt32(dataJson.Position));
            return await Task.Run(() => WorkingPlanExtends.Template_LLV_PGM(accId ?? AccountId, UserId, JsonData, _service, null, _hostingEnvironment, Request.Host, Request.Scheme));

        }
        public class LLV_PGMModel
        {
            public string EmployeeCode { get; set; }
            public string ShopCode { get; set; }
            public string WorkingDate { get; set; }
            public string ShiftType { get; set; }
            public int? EmployeeId { get; set; }
            public int? ShopId { get; set; }
            public int? Row { get; set; }
            public int? TaskId { get; set; }
            public string RefCode { get; set; }
            public string From { get; set; }
            public string To { get; set; }

        }
        [HttpPost("Import_LLV_PGM")]
        public async Task<ResultInfo> Import_LLV_PGM([FromForm] IFormCollection ifile, [FromHeader] int? accId)
        {
            string folder = _hostingEnvironment.WebRootPath;
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
                        if (package != null && package.Workbook.Worksheets["LLV"] != null)
                        {
                            try
                            {
                                List<LLV_PGMModel> dataImport = new List<LLV_PGMModel>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["LLV"];
                                List<ShiftListEntity> listShift = _shiftListService.GetList(accId ?? AccountId);
                                List<TaskListEntity> lstTask = _taskListService.GetList();
                                List<EmployeeShopModel> listES = _employeeService.EmployeeShopPermission(accId ?? AccountId, UserId).Result;

                                if (sheet != null)
                                {
                                    // Check data input
                                    #region Check data input
                                    int startColumn = 15;
                                    if (Convert.ToString(sheet.Cells[4, startColumn].Value).Replace(" ", "").Replace("*", "").ToUpper() == "TASKID") startColumn = startColumn + 2;
                                    for (int row = 7; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        int dem = 0;
                                        for (int col = startColumn; col <= sheet.Dimension.End.Column; col++)
                                        {
                                            if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, col].Value)))
                                            {
                                                LLV_PGMModel item = new LLV_PGMModel();
                                                int employeeId = 0;
                                                int? TypeId = 0;
                                                int shopId = 0;
                                                int taskId = 0;
                                                DateTime CheckDate;
                                                string ShiftCode = string.Empty;
                                                string RefCode = string.Empty;
                                                string time_from = string.Empty;
                                                string time_to = string.Empty;

                                                if (startColumn > 15)
                                                {
                                                    if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 15].Value)))
                                                    {
                                                        return new ResultInfo(0, "TaskId: không được để trống - Cell[" + row + ",15]", "");
                                                    }
                                                    taskId = Convert.ToInt32(sheet.Cells[row, 15].Value);
                                                    var itemTask = lstTask.Where(t => t.SubGroupId == taskId).FirstOrDefault();
                                                    if (itemTask != null) item.TaskId = taskId;
                                                    else
                                                    {
                                                        return new ResultInfo(0, "TaskId: không tồn tại - Cell[" + row + ",15]", "");
                                                    }
                                                }

                                                // Employee
                                                if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 6].Value)))
                                                {
                                                    return new ResultInfo(0, "Mã nhân viên: không được để trống - Cell[" + row + ",6]", "");
                                                }
                                                else
                                                {
                                                    var employees = listES.Where(p => p.EmployeeCode == Convert.ToString(sheet.Cells[row, 6].Value).Trim()).FirstOrDefault();
                                                    if (employees != null)
                                                    {
                                                        employeeId = employees.EmployeeId;
                                                        TypeId = employees.TypeId;
                                                        item.EmployeeId = employeeId;
                                                    }
                                                    else
                                                    {
                                                        return new ResultInfo(0, "Mã nhân viên: không tồn tại - Cell[" + row + ",6]", "");
                                                    }
                                                }

                                                // Shop
                                                if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 11].Value)))
                                                {
                                                    return new ResultInfo(0, "Mã cửa hàng (ShopCode): không được để trống - Cell[" + row + ",11]", "");
                                                }
                                                else
                                                {
                                                    var shopsEntity = listES.Where(p => p.EmployeeId == employeeId && p.ShopCode == Convert.ToString(sheet.Cells[row, 11].Value).Trim()).FirstOrDefault();
                                                    if (shopsEntity != null)
                                                    {
                                                        shopId = shopsEntity.ShopId;
                                                        item.ShopId = shopId;
                                                    }
                                                    else
                                                    {
                                                        return new ResultInfo(0, "Mã cửa hàng (ShopCode): không tồn tại hoặc không được phân quyền - Cell[" + row + ",11]", "");
                                                    }

                                                }

                                                // Add Item
                                                if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, col].Value)))
                                                {
                                                    if (string.IsNullOrEmpty(Convert.ToString(sheet.Cells[6, col].Value)))
                                                    {
                                                        return new ResultInfo(0, "Ngày làm việc: không được để trống - Cell[6, " + col + "]", "");
                                                    }
                                                    else
                                                    {
                                                        string datenow = DateTime.Now.ToString("yyyy-MM-dd");
                                                        if (!DateTime.TryParseExact(Convert.ToString(Convert.ToString(sheet.Cells[6, col].Value)).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out CheckDate))
                                                        {
                                                            return new ResultInfo(0, "Ngày làm việc: không đúng định dạng - Cell[6, " + col + "]", "");
                                                        }

                                                        if (Convert.ToDateTime(Convert.ToString(sheet.Cells[6, col].Value)) < Convert.ToDateTime(datenow) && UserId != 408665)
                                                        {
                                                            return new ResultInfo(0, "Ngày làm việc: không được thuộc quá khứ - Cell[6, " + col + "]", "");
                                                        }
                                                        else
                                                        {
                                                            item.WorkingDate = Convert.ToString(sheet.Cells[6, col].Value).Trim();
                                                        }


                                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, col].Value)))
                                                        {
                                                            if (Convert.ToString(sheet.Cells[row, col].Value) == "-1")
                                                            {
                                                                item.ShiftType = Convert.ToString(sheet.Cells[row, col].Value);
                                                                ShiftCode = item.ShiftType;
                                                            }
                                                            else
                                                            {
                                                                var tmp = listShift.Where(s => s.ShiftCode == Convert.ToString(sheet.Cells[row, col].Value).Trim()).FirstOrDefault();
                                                                if (tmp == null)
                                                                {
                                                                    return new ResultInfo(0, "Mã ca làm việc: không tồn tại - Cell[" + row + ", " + col + "]", "");
                                                                }
                                                                else
                                                                {
                                                                    item.ShiftType = tmp.ShiftCode;
                                                                    ShiftCode = tmp.ShiftCode;
                                                                    RefCode = tmp.RefCode;
                                                                    item.RefCode = tmp.RefCode;
                                                                    if (RefCode == "ON" && !ShiftCode.Contains("/2"))
                                                                    {
                                                                        time_from = !string.IsNullOrEmpty(tmp.From) ? Convert.ToString(tmp.From).ToString().Trim() : null;
                                                                        time_to = !string.IsNullOrEmpty(tmp.To) ? Convert.ToString(tmp.To).ToString().Trim() : null;
                                                                    }

                                                                }
                                                            }

                                                        }

                                                        // Check trung
                                                        if (startColumn == 15)
                                                        {
                                                            var checkData = dataImport.Where(p => p.EmployeeId == employeeId && p.ShopId == shopId && p.ShiftType == ShiftCode && p.Row != row).FirstOrDefault();
                                                            if (checkData != null)
                                                            {
                                                                return new ResultInfo(0, string.Format("Dữ liệu bị trùng: Dòng {0} - {1}", checkData.Row, row), "");
                                                            }
                                                            else
                                                            {
                                                                if (ShiftCode != "-1")
                                                                {
                                                                    // Check NK
                                                                    var checkNK = dataImport.Where(p => p.EmployeeId == employeeId && p.WorkingDate == Convert.ToString(sheet.Cells[6, col].Value).Trim()
                                                                                                        && p.RefCode != RefCode && p.ShopId == shopId
                                                                                                     ).FirstOrDefault();
                                                                    if (checkNK != null)
                                                                    {
                                                                        return new ResultInfo(0, string.Format("Ngày ON và OFF trùng nhau: Dòng {0} - {1}", checkNK.Row, row), "");
                                                                    }

                                                                    //if (RefCode == "ON" && !ShiftCode.Contains("/2") && (accId != 1 && AccountId != 1))
                                                                    //{
                                                                    //    DateTime? from1 = Convert.ToDateTime(Convert.ToString(time_from));
                                                                    //    DateTime? to1 = Convert.ToDateTime(Convert.ToString(time_to));

                                                                    //    var checkTime = dataImport.Where(p => p.EmployeeId == employeeId
                                                                    //                                   && p.ShiftType != ShiftCode
                                                                    //                                   && p.RefCode == "ON"
                                                                    //                                   && !p.ShiftType.Contains("/2")
                                                                    //                                   && p.WorkingDate == Convert.ToString(sheet.Cells[6, col].Value).Trim()
                                                                    //                                   && (Convert.ToDateTime(Convert.ToString(p.To)) >= from1 && Convert.ToDateTime(Convert.ToString(p.From)) <= to1)
                                                                    //                                ).FirstOrDefault();
                                                                    //    if (checkTime != null)
                                                                    //    {
                                                                    //        return new ResultInfo(0, string.Format("Ca làm việc bị chồng lên nhau: Dòng {0} - {1} , Cột {2}", checkTime.Row, row, col), "");
                                                                    //    }
                                                                    //}


                                                                }

                                                            }
                                                        }

                                                        item.ShiftType = ShiftCode;
                                                        item.RefCode = RefCode;

                                                        item.From = time_from;
                                                        item.To = time_to;

                                                        item.Row = row;
                                                        dataImport.Add(item);
                                                        dem++;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    #endregion Check data input

                                    // Send data import
                                    if (dataImport.Count > 0)
                                    {
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import_LLV_PGM(UserId, json, accId ?? AccountId));
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} item", dataImport.Count), "");
                                        }
                                    }

                                }
                                return new ResultInfo(0, "Dữ liệu rỗng", "");
                            }
                            catch (Exception ex)
                            {
                                return new ResultInfo(500, ex.Message.ToString(), ex.StackTrace);
                            }
                        }
                    }
                }
            }
            return new ResultInfo(0, "Dữ liệu rỗng", "");
        }
        [HttpGet("RemoveChangeShift")]
        public ActionResult<AlertModel> RemoveChangeShift([FromHeader] string JsonData, [FromHeader] int? accId)
        {
            int result = 0;
            try
            {
                Task<int> data = Task.Run(() => _service.RemoveChangeShift(accId ?? AccountId, UserId, JsonData));
                result = data.Result;
                if (result > 0)
                    return new AlertModel(1, "Successful", null);
                else
                    return new AlertModel(-1, "Fail", null);
            }
            catch (Exception ex)
            {
                return new AlertModel(-1, "Error: " + ex.Message, null);
            }
        }
    }
}
