using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class WorkingPlanDefaultController : SpiralBaseController
    {
        private readonly IWorkingPlanDefaultService _service;
        private readonly IWebHostEnvironment _webHostEnvironment;
        private readonly IEmployeeService _employeeService;
        private readonly IShopService _shopService;
        private readonly IShiftListService _shiftListService;
        private readonly IEmployeeStoreService _employeeStoreService;
        public WorkingPlanDefaultController(WorkingPlanDefaultContext context, IWebHostEnvironment webHost, EmployeeContext employeeContext, ShopContext shopContext, ShiftListContext shiftListContext, EmployeeStoreContext employeeStoreContext)
        {
            _service = new WorkingPlanDefaultService(context);
            _employeeService = new EmployeeService(employeeContext);
            _shopService = new ShopService(shopContext);
            _shiftListService = new ShiftListService(shiftListContext);
            _employeeStoreService = new EmployeeStoreService(employeeStoreContext);
            this._webHostEnvironment = webHost;
        }
        [HttpPost("Filter")]
        public ActionResult<DataTable> Filter([FromBody] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.Filter(UserId, JsonData));
                return data.Result;
            }catch(Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("GetShop")]
        public ActionResult<DataTable> GetShop([FromHeader] int EmployeeId, [FromHeader] int FromDate)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetShop(EmployeeId, FromDate));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        public string CreatePlan(int? monday, int? tuesday, int? wednesday, int? thursday, int? friday, int? saturday, int? sunday)
        {
            List<PlanModel> planList = new List<PlanModel>();
            PlanModel t2 = new PlanModel();
            PlanModel t3 = new PlanModel();
            PlanModel t4 = new PlanModel();
            PlanModel t5 = new PlanModel();
            PlanModel t6 = new PlanModel();
            PlanModel t7 = new PlanModel();
            PlanModel cn = new PlanModel();

            t2.Index = 0;
            t2.Day = 1;
            t2.DayName = "Monday";
            t2.Value = monday;

            t3.Index = 1;
            t3.Day = 2;
            t3.DayName = "Tuesday";
            t3.Value = tuesday;

            t4.Index = 2;
            t4.Day = 3;
            t4.DayName = "Wednesday";
            t4.Value = wednesday;

            t5.Index = 3;
            t5.Day = 4;
            t5.DayName = "Thursday";
            t5.Value = thursday;

            t6.Index = 4;
            t6.Day = 5;
            t6.DayName = "Friday";
            t6.Value = friday;

            t7.Index = 5;
            t7.Day = 6;
            t7.DayName = "Saturday";
            t7.Value = saturday;

            cn.Index = 6;
            cn.Day = 0;
            cn.DayName = "Sunday";
            cn.Value = sunday;

            planList.Add(t2);
            planList.Add(t3);
            planList.Add(t4);
            planList.Add(t5);
            planList.Add(t6);
            planList.Add(t7);
            planList.Add(cn);

            string plan = JsonConvert.SerializeObject(planList);
            return plan;
        }
        [HttpPost("Insert")]
        public ActionResult<ResultInfo> Insert([FromBody] string JsonData)
        {
            try
            {
                List<WorkingPlanDefaultModel> dataInput = new List<WorkingPlanDefaultModel>();
                dataInput = JsonConvert.DeserializeObject<List<WorkingPlanDefaultModel>>(JsonData);
                
                List<WorkingPlanDefaultModel> dataInsert = new List<WorkingPlanDefaultModel>();
                for (int i = 0; i < dataInput.Count; i++)
                {
                    if(dataInput[i].isInsert == 1)
                    {
                        dataInsert.Add(dataInput[i]);
                    }                  
                }

                #region Check day off
                int?[,] Array = new int?[200, 7];
                int len = dataInsert.Count;
                // add 
                for(int i = 0; i < len; i++)
                {
                    DateTime dt = DateTime.Now;
                    dt = DateTime.ParseExact(dataInsert[i].fromDate.ToString(), "yyyyMMdd", CultureInfo.InvariantCulture);
                    if (dt.DayOfWeek.ToString() != "Monday")
                    {
                        return new ResultInfo(0, "Ngày bắt đầu phải vào thứ 2", "");
                    }

                    if (dataInsert[i].monday != 1)
                    {
                        dataInsert[i].monday = 0;
                    }
                    Array[i, 0] = dataInsert[i].monday;

                    if (dataInsert[i].tuesday != 1)
                    {
                        dataInsert[i].tuesday = 0;
                    }
                    Array[i, 1] = dataInsert[i].tuesday;

                    if (dataInsert[i].wednesday != 1)
                    {
                        dataInsert[i].wednesday = 0;
                    }
                    Array[i, 2] = dataInsert[i].wednesday;

                    if (dataInsert[i].thursday != 1)
                    {
                        dataInsert[i].thursday = 0;
                    }
                    Array[i, 3] = dataInsert[i].thursday;

                    if (dataInsert[i].friday != 1)
                    {
                        dataInsert[i].friday = 0;
                    }
                    Array[i, 4] = dataInsert[i].friday;

                    if (dataInsert[i].saturday != 1)
                    {
                        dataInsert[i].saturday = 0;
                    }
                    Array[i, 5] = dataInsert[i].saturday;

                    if (dataInsert[i].sunday != 1)
                    {
                        dataInsert[i].sunday = 0;
                    }
                    Array[i, 6] = dataInsert[i].sunday;
                }
                // Check
                int? max2 = 0, max3 = 0, max4 = 0, max5 = 0, max6 = 0, max7 = 0, maxcn = 0;
                for (int i = 0; i < len; i++)
                {
                    max2 = (max2 < Array[i, 0]) ? Array[i, 0] : max2;
                    max3 = (max3 < Array[i, 1]) ? Array[i, 1] : max3;
                    max4 = (max4 < Array[i, 2]) ? Array[i, 2] : max4;
                    max5 = (max5 < Array[i, 3]) ? Array[i, 3] : max5;
                    max6 = (max6 < Array[i, 4]) ? Array[i, 4] : max6;
                    max7 = (max7 < Array[i, 5]) ? Array[i, 5] : max7;
                    maxcn = (maxcn < Array[i, 6]) ? Array[i, 6] : maxcn;
                }

                List<int?> tmp = new List<int?>();
                tmp.Add(max2); tmp.Add(max3); tmp.Add(max4); tmp.Add(max5); tmp.Add(max6); tmp.Add(max7); tmp.Add(maxcn);
                var check1 = tmp.Where(t => t.Value == 1).ToList();
                if(check1.Count < 1)
                {
                    return new ResultInfo(0, "Mỗi tuần có ít nhất 1 ngày đi làm", "");
                }

                #endregion Check day off

                for (int i = 0; i < dataInsert.Count; i++)
                {
                    dataInsert[i].monday = (max2 == 0) ? -1 : dataInsert[i].monday;
                    dataInsert[i].tuesday = (max3 == 0) ? -1 : dataInsert[i].tuesday;
                    dataInsert[i].wednesday = (max4 == 0) ? -1 : dataInsert[i].wednesday;
                    dataInsert[i].thursday = (max5 == 0) ? -1 : dataInsert[i].thursday;
                    dataInsert[i].friday = (max6 == 0) ? -1 : dataInsert[i].friday;
                    dataInsert[i].saturday = (max7 == 0) ? -1 : dataInsert[i].saturday;
                    dataInsert[i].sunday = (maxcn == 0) ? -1 : dataInsert[i].sunday;

                    string plan = CreatePlan(dataInsert[i].monday, dataInsert[i].tuesday, dataInsert[i].wednesday, dataInsert[i].thursday, dataInsert[i].friday, dataInsert[i].saturday, dataInsert[i].sunday);
                    dataInsert[i].plan = JsonConvert.SerializeObject(plan);
                }

                JsonData = JsonConvert.SerializeObject(dataInsert);

                Task<DataTable> data = Task.Run(() => _service.Insert(UserId, JsonData));
                if(data.Result.Rows.Count > 0)
                {
                    return new ResultInfo(1, "Insert Thành công", "");
                }
                return Ok(-1);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        [HttpPost("Update")]
        public ActionResult<ResultInfo> Update([FromBody] string JsonData)
        {
            try
            {
                WorkingPlanDefaultModel dataUpdate = new WorkingPlanDefaultModel();
                dataUpdate = JsonConvert.DeserializeObject<WorkingPlanDefaultModel>(JsonData);
                WorkingPlanDefaultModel dataSource = JsonConvert.DeserializeObject<WorkingPlanDefaultModel>(JsonData);
                List<WorkingPlanDefaultModel> data = _service.WorkingPlanDefault_GetByEmployeeFromDate(dataUpdate.employeeId, dataUpdate.fromDate).Result;
                foreach (var item in data)
                {
                    if (!string.IsNullOrEmpty(Convert.ToString(item.id))){
                        if (item.id == dataUpdate.id)
                        {
                            // get source
                            dataSource.shiftCode = item.shiftCode;
                            dataSource.monday = item.monday;
                            dataSource.tuesday = item.tuesday;
                            dataSource.wednesday = item.wednesday;
                            dataSource.thursday = item.thursday;
                            dataSource.friday = item.friday;
                            dataSource.saturday = item.saturday;
                            dataSource.sunday = item.sunday;

                            // update
                            item.shiftCode = dataUpdate.shiftCode;
                            item.monday = dataUpdate.monday;
                            item.tuesday = dataUpdate.tuesday;
                            item.wednesday = dataUpdate.wednesday;
                            item.thursday = dataUpdate.thursday;
                            item.friday = dataUpdate.friday;
                            item.saturday = dataUpdate.saturday;
                            item.sunday = dataUpdate.sunday;
                            break;
                        }
                    }
                }
                string JsonSource = JsonConvert.SerializeObject(dataSource);
                #region Check day off
                int?[,] Array = new int?[200, 7];
                int len = data.Count;
                // add 
                for (int i = 0; i < len; i++)
                {
                    if (data[i].monday != 1)
                    {
                        data[i].monday = 0;
                    }
                    Array[i, 0] = data[i].monday;

                    if (data[i].tuesday != 1)
                    {
                        data[i].tuesday = 0;
                    }
                    Array[i, 1] = data[i].tuesday;

                    if (data[i].wednesday != 1)
                    {
                        data[i].wednesday = 0;
                    }
                    Array[i, 2] = data[i].wednesday;

                    if (data[i].thursday != 1)
                    {
                        data[i].thursday = 0;
                    }
                    Array[i, 3] = data[i].thursday;

                    if (data[i].friday != 1)
                    {
                        data[i].friday = 0;
                    }
                    Array[i, 4] = data[i].friday;

                    if (data[i].saturday != 1)
                    {
                        data[i].saturday = 0;
                    }
                    Array[i, 5] = data[i].saturday;

                    if (data[i].sunday != 1)
                    {
                        data[i].sunday = 0;
                    }
                    Array[i, 6] = data[i].sunday;
                }
                // Check
                int? max2 = 0, max3 = 0, max4 = 0, max5 = 0, max6 = 0, max7 = 0, maxcn = 0;
                for (int i = 0; i < len; i++)
                {
                    max2 = (max2 < Array[i, 0]) ? Array[i, 0] : max2;
                    max3 = (max3 < Array[i, 1]) ? Array[i, 1] : max3;
                    max4 = (max4 < Array[i, 2]) ? Array[i, 2] : max4;
                    max5 = (max5 < Array[i, 3]) ? Array[i, 3] : max5;
                    max6 = (max6 < Array[i, 4]) ? Array[i, 4] : max6;
                    max7 = (max7 < Array[i, 5]) ? Array[i, 5] : max7;
                    maxcn = (maxcn < Array[i, 6]) ? Array[i, 6] : maxcn;
                }

                List<int?> tmp = new List<int?>();
                tmp.Add(max2); tmp.Add(max3); tmp.Add(max4); tmp.Add(max5); tmp.Add(max6); tmp.Add(max7); tmp.Add(maxcn);
                var check1 = tmp.Where(t => t.Value == 1).ToList();
                if (check1.Count != 6)
                {
                    return new ResultInfo (0, "Mỗi tuần có 1 ngày nghỉ", JsonSource);
                }

                #endregion Check day off
                // update -1
                for (int i = 0; i < data.Count; i++)
                {
                    data[i].monday = (max2 == 0) ? -1 : data[i].monday;
                    data[i].tuesday = (max3 == 0) ? -1 : data[i].tuesday;
                    data[i].wednesday = (max4 == 0) ? -1 : data[i].wednesday;
                    data[i].thursday = (max5 == 0) ? -1 : data[i].thursday;
                    data[i].friday = (max6 == 0) ? -1 : data[i].friday;
                    data[i].saturday = (max7 == 0) ? -1 : data[i].saturday;
                    data[i].sunday = (maxcn == 0) ? -1 : data[i].sunday;

                    string plan = CreatePlan(data[i].monday, data[i].tuesday, data[i].wednesday, data[i].thursday, data[i].friday, data[i].saturday, data[i].sunday);
                    data[i].plan = JsonConvert.SerializeObject(plan);
                }

                string JsonUpdate = JsonConvert.SerializeObject(data);
               
                DataTable dataResult = Task.Run(() => _service.Update(JsonData, JsonUpdate)).Result;
                if (dataResult.Rows.Count > 0)
                {
                    return new ResultInfo(1, "Update thành công", dataResult.Rows[0]["Result"].ToString());
                }
                return new ResultInfo(0, "Update Không thành công", JsonSource);
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message.ToString(), "");
            }
        }
        [HttpPost("Delete")]
        public ActionResult<ResultInfo> Delete([FromHeader] string listId)
        {
            try
            {
                Task<int> Result = Task.Run(() => _service.Delete(listId));
                if (Result.Result > 0)
                {
                    return new ResultInfo(1, "Xóa thành công", "");
                }
                return new ResultInfo(-1, "Xóa thất bại", "");
            }
            catch (Exception ex)
            {
                return new ResultInfo(-2, ex.Message, "");
            }
        }
        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string jsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);
           
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/WorkingPlanDefault";
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Lich lam viec mac dinh _{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_WorkingPlan_Default.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataTable data = await Task.Run(() => _service.Export(UserId, jsonData)))
                {
                    if (data.Rows.Count > 0)
                    {
                        using (var pk = new ExcelPackage(file))
                        {
                            var sheet = pk.Workbook.Worksheets["Dữ liệu"];
                            ExcelFormatTimeShift.BorderCell(sheet.Cells[6, 1, data.Rows.Count + 5, data.Columns.Count]);

                            sheet.Cells[2, 5].Value = string.Format("Từ ngày: {0} - Đến ngày: {1}", dataJson.fromdate, dataJson.todate);

                            sheet.Cells[6, 1].LoadFromDataTable(data, false);
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
        [HttpPost("Template")]
        public async Task<ResultInfo> GetTemplate([FromBody] string jsonData)
        {
            var dataJson = JsonConvert.DeserializeObject<SearchModel>(jsonData);

            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string fileName = $"Dang ky Lich Lam Viec Mac Dinh_{DateTime.Now.ToString("yyyyMMdd_HHmmss")}.xlsx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            FileInfo fileInfo = new FileInfo(Path.Combine(folder, "export/template_VNM/tmp_WorkingPlan_Default.xlsx"));
            FileInfo file = fileInfo.CopyTo(fileExport);
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            try
            {
                using (DataSet data = await Task.Run(() => _service.GetTemplate(UserId, jsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        // sheet 1
                        if (data.Tables[0].Rows.Count > 0)
                        {
                            var sheet = package.Workbook.Worksheets["Dữ liệu"];

                            sheet.Cells[1, 3].Value = "ĐĂNG KÝ LỊCH LÀM VIỆC MẶC ĐỊNH";

                            sheet.Cells[6, 1].LoadFromDataTable(data.Tables[0], false);

                            ExcelFormatTimeShift.BorderCell(sheet.Cells[6, 1, data.Tables[0].Rows.Count + 5, data.Tables[0].Columns.Count]);
                        }
                        else
                        {
                            return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        // sheet 2
                        if (data.Tables[1].Rows.Count > 0)
                        {
                            var sheet1 = package.Workbook.Worksheets.Add("Danh sách Nhân viên + Cửa Hàng");

                            sheet1.Cells[3, 1].LoadFromDataTable(data.Tables[1], true);

                            ExcelFormats.FormatCell(sheet1.Cells[3, 1, 3, data.Tables[1].Columns.Count], "#BDD7EE", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            sheet1.Column(2).Width = 16;
                            sheet1.Column(3).Width = 30;
                            sheet1.Column(4).Width = 16;
                            sheet1.Column(5).Width = 30;
                            sheet1.Column(7).Width = 16;
                            sheet1.Column(8).Width = 16;
                            sheet1.Column(9).Width = 50;
                            sheet1.Column(10).Width = 80;

                            ExcelFormatTimeShift.BorderCell(sheet1.Cells[3, 1, data.Tables[1].Rows.Count + 3, data.Tables[1].Columns.Count]);
                            
                        }
                        // sheet 3
                        if (data.Tables[2].Rows.Count > 0)
                        {
                            var sheet2 = package.Workbook.Worksheets.Add("Ca làm việc");
                            sheet2.Cells[3, 1].LoadFromDataTable(data.Tables[2], true);

                            ExcelFormats.FormatCell(sheet2.Cells[3, 1, 3, data.Tables[2].Columns.Count], "#C6E0B4", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);

                            sheet2.Column(2).Width = 16;
                            sheet2.Column(3).Width = 30;
                            sheet2.Column(4).Width = 16;
                            sheet2.Column(5).Width = 16;
                            sheet2.Column(6).Width = 16;
                            sheet2.Column(7).Width = 16;
                            sheet2.Column(8).Width = 16;

                            ExcelFormatTimeShift.BorderCell(sheet2.Cells[3, 1, data.Tables[2].Rows.Count + 3, data.Tables[2].Columns.Count]);
                            
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Xuất File mẫu thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
        public class WorkingPlanDefault_Import
        {
            public int? EmployeeId { get; set; }
            public int? ShopId { get; set; }
            public DateTime? FromDate { get; set; }
            public DateTime? ToDate { get; set; }
            public string ShiftCode { get; set; }
            public int? T2 { get; set; }
            public int? T3 { get; set; }
            public int? T4 { get; set; }
            public int? T5 { get; set; }
            public int? T6 { get; set; }
            public int? T7 { get; set; }
            public int? CN { get; set; } 
            public string Plan { get; set; }
            public int Row { get; set; }
            public DateTime? From { get; set; }
            public DateTime? To { get; set; }
        }
        [HttpPost("Import")]
        public async Task<ResultInfo> Import([FromForm] IFormCollection ifile)
        {
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
                        if (package != null && package.Workbook.Worksheets["Dữ liệu"] != null)
                        {
                            try
                            {
                                List<WorkingPlanDefault_Import> dataImport = new List<WorkingPlanDefault_Import>();
                                ExcelWorksheet sheet = package.Workbook.Worksheets["Dữ liệu"];
                                List<ShiftListEntity> listShift = _shiftListService.GetList(AccountId);
                                List<EmployeeShopModel> listES = _employeeService.EmployeeShopPermission(AccountId, UserId).Result;
                                if (sheet != null)
                                {

                                    // Check data input
                                    #region Check data input
                                    for (int row = 6; row <= sheet.Dimension.End.Row; row++)
                                    {
                                        WorkingPlanDefault_Import item = new WorkingPlanDefault_Import();
                                        var EmployeeCode = sheet.Cells[row, 5].Value;
                                        var ShopCode = sheet.Cells[row, 9].Value;
                                        var FromDate = sheet.Cells[row, 13].Value;
                                        var ToDate = sheet.Cells[row, 14].Value;
                                        var ShiftCode = sheet.Cells[row, 15].Value;

                                        int t2 = 0, t3 = 0, t4 = 0, t5 = 0, t6 = 0, t7 = 0, cn = 0;

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 17].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 17].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 17].Value).Trim().ToLower() == "x")
                                            {
                                                 t2 = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 17].Value).Trim().ToLower() == "nk")
                                            {
                                                t2 = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",17]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 18].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 18].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 18].Value).Trim().ToLower() == "x")
                                            {
                                                t3 = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 18].Value).Trim().ToLower() == "nk")
                                            {
                                                t3 = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",18]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 19].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 19].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 19].Value).Trim().ToLower() == "x")
                                            {
                                                t4 = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 19].Value).Trim().ToLower() == "nk")
                                            {
                                                t4 = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",19]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 20].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 20].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 20].Value).Trim().ToLower() == "x")
                                            {
                                                t5 = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 20].Value).Trim().ToLower() == "nk")
                                            {
                                                t5 = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",20]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 21].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 21].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 21].Value).Trim().ToLower() == "x")
                                            {
                                                t6 = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 21].Value).Trim().ToLower() == "nk")
                                            {
                                                t6 = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",21]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 22].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 22].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 22].Value).Trim().ToLower() == "x")
                                            {
                                                t7 = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 22].Value).Trim().ToLower() == "nk")
                                            {
                                                t7 = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",22]", "");
                                            }
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[row, 23].Value)) && !string.IsNullOrWhiteSpace(Convert.ToString(sheet.Cells[row, 23].Value)))
                                        {
                                            if (Convert.ToString(sheet.Cells[row, 23].Value).Trim().ToLower() == "x")
                                            {
                                                cn = 1;
                                            }
                                            else if (Convert.ToString(sheet.Cells[row, 23].Value).Trim().ToLower() == "nk")
                                            {
                                                cn = -1;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã Ca làm việc: không tồn tại - Cell[" + row + ",23]", "");
                                            }
                                        }

                                        #region check
                                        int employeeId = 0;
                                        int? TypeId = 0;
                                        int shopId = 0;
                                        DateTime checkDate;
                                        DateTime? frDate = null;
                                        DateTime? tDate = null;
                                        string RefCode = string.Empty;

                                        
                                        if (string.IsNullOrEmpty(Convert.ToString(EmployeeCode).Trim()))
                                        {
                                            return new ResultInfo(0, "Mã nhân viên không được để trống - Cell[" + row + ",5]", "");
                                        }
                                        else
                                        {
                                            var employees = listES.Where(p => p.EmployeeCode == Convert.ToString(EmployeeCode).Trim()).FirstOrDefault();
                                            if (employees != null)
                                            {
                                                employeeId = employees.EmployeeId;
                                                TypeId = employees.TypeId;
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Mã nhân viên không tồn tại - Cell[" + row + ",5]", "");
                                            }
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(FromDate)))
                                        {
                                            return new ResultInfo(0, "Ngày bắt đầu không được để trống - Cell[" + row + ",13]", "");
                                        }
                                        else
                                        {
                                            if(DateTime.TryParseExact(Convert.ToString(FromDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                frDate = Convert.ToDateTime(Convert.ToString(FromDate).Trim());

                                                if(Convert.ToDateTime(Convert.ToString(FromDate).Trim()).DayOfWeek != DayOfWeek.Monday)
                                                {
                                                    return new ResultInfo(0, "Ngày bắt đầu: phải là Thứ 2 - Cell[" + row + ",13]", "");
                                                }

                                                string datenow = DateTime.Now.ToString("yyyy-MM-dd");

                                                DateTime Thu2 = Convert.ToDateTime(datenow);
                                                while (Thu2.DayOfWeek != DayOfWeek.Monday)
                                                {
                                                    Thu2 = Thu2.AddDays(-1);
                                                }

                                                if (frDate < Thu2)
                                                {
                                                    return new ResultInfo(0, "Ngày bắt đầu: phải lớn hơn hoặc bằng T2 của tuần hiện tại - Cell[" + row + ",13]", "");
                                                }
                                           
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Ngày bắt đầu không đúng định dạng - Cell[" + row + ",13]", "");
                                            }
                                               
                                        }

                                        if (!string.IsNullOrEmpty(Convert.ToString(ToDate)))
                                        {
                                           
                                            if (DateTime.TryParseExact(Convert.ToString(ToDate).Trim(), "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
                                            {
                                                tDate = Convert.ToDateTime(Convert.ToString(ToDate).Trim());
                                            }
                                            else
                                            {
                                                return new ResultInfo(0, "Ngày kết thúc không đúng định dạng - Cell[" + row + ",14]", "");
                                            }
                              
                                        }

                                        if (string.IsNullOrEmpty(Convert.ToString(ShiftCode)) || string.IsNullOrWhiteSpace(Convert.ToString(ShiftCode)))
                                        {
                                            return new ResultInfo(0, "Mã ca làm việc không được để trống - Cell[" + row + ",15]", "");
                                        }
                                        else
                                        {
                                            string ShiftGroup = null;
                                            switch (TypeId)
                                            {
                                                case 3:
                                                    ShiftGroup = "ALPHA";
                                                    break;
                                                case 6:
                                                    ShiftGroup = "MT";
                                                    break;
                                                default:
                                                    ShiftGroup = null;
                                                    break;
                                            }
                                           
                                            var tmp = listShift.Where(s => s.ShiftCode == Convert.ToString(ShiftCode).Trim() && s.ShiftGroup == ShiftGroup && s.RefCode == "ON").FirstOrDefault();
                                            if (tmp == null)
                                            {
                                                return new ResultInfo(0, "Mã ca làm việc không tồn tại - Cell[" + row + ",15]", "");
                                            }
                                            else
                                            {

                                                if (string.IsNullOrEmpty(Convert.ToString(ShopCode)))
                                                {
                                                    return new ResultInfo(0, "Mã Shop không được để trống - Cell[" + row + ",9]", "");
                                                }
                                                else
                                                {
                                                    if(tmp.ShiftCode == "NT")
                                                    {
                                                        var shopsEntity = listES.Where(p => p.ShopCode == Convert.ToString(ShopCode).Trim()).FirstOrDefault();
                                                        if (shopsEntity != null)
                                                        {
                                                            shopId = shopsEntity.ShopId;
                                                        }
                                                        else
                                                        {
                                                            return new ResultInfo(0, "Mã Shop: không tồn tại - Cell[" + row + ",9]", "");
                                                        }
                                                    }
                                                    else
                                                    {
                                                        var shopsEntity = listES.Where(p => p.EmployeeId == employeeId && p.ShopCode == Convert.ToString(ShopCode).Trim()).FirstOrDefault();
                                                        if (shopsEntity != null)
                                                        {
                                                            shopId = shopsEntity.ShopId;
                                                        }
                                                        else
                                                        {
                                                            return new ResultInfo(0, "Mã Shop: không tồn tại hoặc không được phân quyền - Cell[" + row + ",9]", "");
                                                        }
                                                    }

                            
                                                }

                                                RefCode = tmp.RefCode;
                                                var checkData = dataImport.Where(p => p.EmployeeId == employeeId && p.ShopId == shopId && p.ShiftCode == Convert.ToString(ShiftCode).Trim() && p.Row != row && p.FromDate == frDate).FirstOrDefault();
                                                if (checkData != null)
                                                {
                                                    return new ResultInfo(0, string.Format("Dữ liệu bị trùng: Dòng {0} - {1}", checkData.Row, row), "");
                                                }
                                                else
                                                {
                                                    // Check End Time 
                                                    if (!Convert.ToString(ShiftCode).Trim().Contains("/2"))
                                                    {
                                                        var time_from = Convert.ToDateTime(Convert.ToString(tmp.From).Trim());
                                                        var time_to = Convert.ToDateTime(Convert.ToString(tmp.To).Trim());

                                                        var checkTime = dataImport.Where(p => p.EmployeeId == employeeId
                                                                                            && (p.To >= time_from && p.From <= time_to)
                                                                                            && ((p.ToDate == null && tDate == null)
                                                                                                || (tDate == null && p.ToDate != null && p.ToDate > frDate)
                                                                                                || (tDate != null && p.ToDate == null && tDate > p.FromDate)
                                                                                                || (tDate != null && p.ToDate != null && p.ToDate >= frDate && p.FromDate <= tDate)
                                                                                                )
                                                                                            && ((p.T2 == t2 && t2 == 1)
                                                                                                || (p.T3 == t3 && t3 == 1)
                                                                                                || (p.T4 == t4 && t4 == 1)
                                                                                                || (p.T5 == t5 && t5 == 1)
                                                                                                || (p.T6 == t6 && t6 == 1)
                                                                                                || (p.T7 == t7 && t7 == 1)
                                                                                                || (p.CN == cn && cn == 1)
                                                                                                )
                                                                                            && (p.ShiftCode != Convert.ToString(ShiftCode).Trim() || p.FromDate != frDate)
                                                                                            && !p.ShiftCode.Contains("/2")
                                                                                         ).FirstOrDefault();
                                                        if (checkTime != null)
                                                        {
                                                            return new ResultInfo(0, string.Format("Ca làm việc bị chồng lên nhau: Dòng {0} - {1}", checkTime.Row, row), "");
                                                        }

                                                        item.From = time_from;
                                                        item.To = time_to;
                                                    }

                                                    // Check NK
                                                    var checkNK = dataImport.Where(p => p.EmployeeId == employeeId && p.ShopId == shopId 
                                                                                        && ((p.ToDate == null && tDate == null)
                                                                                            || (tDate == null && p.ToDate != null && p.ToDate > frDate)
                                                                                            || (tDate != null && p.ToDate == null && tDate > p.FromDate)
                                                                                            || (tDate != null && p.ToDate != null && p.ToDate >= frDate && p.FromDate <= tDate)
                                                                                            )
                                                                                        && ((p.T2 + t2 == 0 && t2 != 0)
                                                                                            || (p.T3 + t3 == 0 && t3 != 0)
                                                                                            || (p.T4 + t4 == 0 && t4 != 0)
                                                                                            || (p.T5 + t5 == 0 && t5 != 0)
                                                                                            || (p.T6 + t6 == 0 && t6 != 0)
                                                                                            || (p.T7 + t7 == 0 && t7 != 0)
                                                                                            || (p.CN + cn == 0 && cn != 0)
                                                                                            )
                                                                                     ).FirstOrDefault();
                                                    if (checkNK != null)
                                                    {
                                                        return new ResultInfo(0, string.Format("Ngày ON và OFF trùng nhau: Dòng {0} - {1}", checkNK.Row, row), "");
                                                    }

                                                    // Check 1 ca 1 shop 
                                                    //var check1ca1shop = dataImport.Where(p => p.EmployeeId == employeeId  && p.ShiftCode == Convert.ToString(ShiftCode).Trim()
                                                    //                                    && p.ShopId != shopId && RefCode == "ON"
                                                    //                                    && ((p.ToDate == null && tDate == null)
                                                    //                                        || (tDate == null && p.ToDate != null && p.ToDate > frDate)
                                                    //                                        || (tDate != null && p.ToDate == null && tDate > p.FromDate)
                                                    //                                        || (tDate != null && p.ToDate != null && p.ToDate >= frDate && p.FromDate <= tDate)
                                                    //                                        )
                                                    //                                    && ((p.T2 == t2 && t2 == 1)
                                                    //                                        || (p.T3 == t3 && t3 == 1)
                                                    //                                        || (p.T4 == t4 && t4 == 1)
                                                    //                                        || (p.T5 == t5 && t5 == 1)
                                                    //                                        || (p.T6 == t6 && t6 == 1)
                                                    //                                        || (p.T7 == t7 && t7 == 1)
                                                    //                                        || (p.CN == cn && cn == 1)
                                                    //                                        )
                                                    //                                 ).FirstOrDefault();
                                                    //if(check1ca1shop != null)
                                                    //{
                                                    //    return new ResultInfo(0, string.Format("Chỉ được thêm: 1 Cửa hàng - 1 Ca làm việc: Dòng {0} - {1}", check1ca1shop.Row, row), "");

                                                    //}


                                                }
                                            }
                                        }

                                        if (t2 == 0 && t3 == 0 && t4 == 0 && t5 == 0 && t6 == 0 && t7 == 0 && cn == 0)
                                        {
                                            return new ResultInfo(0, "Vui lòng chọn 1 ngày trong tuần - Cell[" + row + ", 17-23]", "");
                                        }

                                        // Check day 1 off

                                        #endregion check

                                        #region add
                                        item.Row = row;
                                        item.EmployeeId = employeeId;
                                        item.ShopId = shopId;
                                        item.FromDate = frDate;
                                        item.ToDate = tDate;
                                        item.ShiftCode = Convert.ToString(ShiftCode).Trim();
                                        item.T2 = t2;
                                        item.T3 = t3;
                                        item.T4 = t4;
                                        item.T5 = t5;
                                        item.T6 = t6;
                                        item.T7 = t7;
                                        item.CN = cn;
                                       
                                        // Check
                                        int?[] array = { item.T2, item.T3, item.T4, item.T5, item.T6, item.T7, item.CN };
                                        List<int?> checkX = array.Where(a => a.Value == 1).ToList();
                                        if (checkX.Count == 0)
                                        {
                                            return new ResultInfo(0, "Mỗi tuần có ít nhất 1 ngày đi làm - Cell[" + row + ",11-12-13-14-15-16-17]", "");
                                        }

                                        item.Plan = CreatePlan(item.T2, item.T3, item.T4, item.T5, item.T6, item.T7, item.CN);
                                        #endregion add
                                        dataImport.Add(item);
                                    }
                                    #endregion Check data input

                                    // Send data import
                                    if (dataImport.Count > 0)
                                    {
                                        // Save File
                                        string fileSaveName = "WorkingPlan_Default_" + DateTime.Now.ToString("yyyyMMddhhmmss") + "_UserId_" + UserId + Path.GetExtension(file.FileName);
                                        string pathSave = Path.Combine(folder, "Upload/import/WorkingPlan_Default");
                                        if (!System.IO.Directory.Exists(pathSave))
                                        {
                                            System.IO.Directory.CreateDirectory(pathSave);
                                        }
                                        pathSave += fileSaveName;
                                        using (var fstream = System.IO.File.Create(pathSave))
                                        {
                                            file.CopyTo(fstream);
                                        }
                                      
                                        string json = JsonConvert.SerializeObject(dataImport);
                                        var Result = await Task.Run(() => _service.Import(UserId, json)); 
                                        if (Result > 0)
                                        {
                                            return new ResultInfo(1, string.Format("Import thành công: {0} rows", dataImport.Count), "");
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
            return new ResultInfo(0, "Dữ liệu rỗng", "");
        }
        
    }
}
