using Microsoft.AspNetCore.Http;
using OfficeOpenXml;
using OfficeOpenXml.Style;
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

namespace MRCApi.Extentions
{
    public class EmployeeExtends
    {
        public static async Task<ResultInfo> Import(IFormFile fileUpload, string sWebRootFolder, IEmployeeService _service, int AccountId, int UserId, string UserName)
        {
            try
            {
                var stream = fileUpload.OpenReadStream();
                bool flag = false;
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                //string desName = DateTime.Now.ToString("yyyyMMddhhmmss") + "_" + fileUpload.FileName;
                //string pathDes = Path.Combine(sWebRootFolder, "Upload/import/" + UserName + "/");
                //if (!System.IO.Directory.Exists(pathDes))
                //{
                //    System.IO.Directory.CreateDirectory(pathDes);
                //}
                //pathDes += desName;
                //var fstream = System.IO.File.Create(pathDes);
                //await fileUpload.CopyToAsync(fstream);
                using (var package = new ExcelPackage(stream))
                {

                    ExcelWorkbook workBook = package.Workbook;
                    if (workBook != null && workBook.Worksheets.Count > 0)
                    {
                        var sheet = workBook.Worksheets["EmployeeList"];
                        if (sheet != null)
                        {
                            DataTable dt = new DataTable();
                            dt.Columns.Add("EmployeeCode", typeof(string));
                            dt.Columns.Add("ParentId", typeof(int));
                            dt.Columns.Add("LastName", typeof(string));
                            dt.Columns.Add("FisrtName", typeof(string));
                            dt.Columns.Add("FullName", typeof(string));
                            dt.Columns.Add("Gender", typeof(int));
                            dt.Columns.Add("Marital", typeof(int));
                            dt.Columns.Add("Email", typeof(string));
                            dt.Columns.Add("Mobile", typeof(string));
                            dt.Columns.Add("Birthday", typeof(DateTime));
                            dt.Columns.Add("IdentityCardNumber", typeof(string));
                            dt.Columns.Add("IdentityCardDate", typeof(DateTime));
                            dt.Columns.Add("IdentityCardBy", typeof(string));
                            dt.Columns.Add("Address", typeof(string));
                            dt.Columns.Add("City", typeof(string));
                            dt.Columns.Add("TypeId", typeof(int));
                            dt.Columns.Add("Status", typeof(int));
                            dt.Columns.Add("DeviceAddress", typeof(string));
                            dt.Columns.Add("UserName", typeof(string));
                            dt.Columns.Add("WorkingStatusId", typeof(int));
                            dt.Columns.Add("FromDate", typeof(DateTime));
                            dt.Columns.Add("ToDate", typeof(DateTime));
                            dt.Columns.Add("ActualDate", typeof(DateTime));
                            dt.Columns.Add("FromDateParent", typeof(int));
                            dt.Columns.Add("ToDateParent", typeof(int));
                            int endRow = sheet.Dimension.End.Row;
                            for (int i = 5; i <= endRow; i++)
                            {
                                string EmployeeCode = Convert.ToString(sheet.Cells[i, 2].Value).Trim().ToUpper();
                                string FirstName = Convert.ToString(sheet.Cells[i, 3].Value).Trim();
                                string LastName = Convert.ToString(sheet.Cells[i, 4].Value).Trim();
                                string FullName = Convert.ToString(sheet.Cells[i, 5].Value).Trim();
                                string Username = Convert.ToString(sheet.Cells[i, 6].Value).Trim();
                                string TypeId = Convert.ToString(sheet.Cells[i, 7].Value).Trim();
                                string ParentCode = Convert.ToString(sheet.Cells[i, 9].Value).Trim();
                                string FromDateParent = Convert.ToString(sheet.Cells[i, 11].Value).Trim();
                                string ToDateParent = Convert.ToString(sheet.Cells[i, 12].Value).Trim();

                                string WorkingStatusId = Convert.ToString(sheet.Cells[i, 13].Value).Trim();
                                string FromDate = Convert.ToString(sheet.Cells[i, 15].Value).Trim();
                                string ToDate = Convert.ToString(sheet.Cells[i, 16].Value).Trim();
                                string ActualDate = Convert.ToString(sheet.Cells[i, 17].Value).Trim();
                                string Gender = Convert.ToString(sheet.Cells[i, 18].Value).Trim().ToLower();
                                string Marital = Convert.ToString(sheet.Cells[i, 19].Value).Trim().ToLower();
                                string Birthday = Convert.ToString(sheet.Cells[i, 20].Value).Trim();
                                string Email = Convert.ToString(sheet.Cells[i, 21].Value).Trim();
                                string Mobile = Convert.ToString(sheet.Cells[i, 22].Value).Trim();
                                string Address = Convert.ToString(sheet.Cells[i, 23].Value).Trim();
                                string City = Convert.ToString(sheet.Cells[i, 24].Value).Trim();
                                string IdentityCardNumber = Convert.ToString(sheet.Cells[i, 25].Value).Trim();
                                string IdentityCardDate = Convert.ToString(sheet.Cells[i, 26].Value).Trim();
                                string IdentityCardBy = Convert.ToString(sheet.Cells[i, 27].Value).Trim();
                                string DeviceAddress = Convert.ToString(sheet.Cells[i, 28].Value).Trim();
                                string Status = Convert.ToString(sheet.Cells[i, 29].Value).Trim();
                                DateTime _Birthday, _FromDate, _ToDate, _ActualDate, _IdentityCardDate;
                                #region Check Data Excel
                                var parent = new EmployeesEntity();

                                if (!CheckString(EmployeeCode))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("EmployeeCode is not null - Cell[{0},2]", i), "");
                                }
                                if (!CheckString(FullName))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("FullName is not null - Cell[{0},5]", i), "");
                                }
                                if (!CheckString(Username))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("Username is not null - Cell[{0},6]", i), "");
                                }
                                else
                                {
                                    if (_service.CheckValidByEmployeeCode(AccountId, EmployeeCode, Username) == false)
                                    {
                                        return new ResultInfo(500, string.Format("Username is duplicate - Cell[{0},6]", i), "");
                                    }
                                }
                                if (!CheckString(TypeId))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("Position is not null - Cell[{0},7]", i), "");
                                }
                                if (!CheckString(ParentCode))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("ParentCode is not null - Cell[{0},9]", i), "");
                                }
                                else
                                {
                                    parent = await Task.Run(() => _service.GetEmployeeByCode(AccountId, ParentCode));
                                    if (parent == null)
                                    {
                                        flag = true;
                                        return new ResultInfo(500, string.Format("ParentCode is NOT Right - Cell[{0},9]", i), "");
                                    }
                                }

                                if (!CheckString(FromDateParent))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("Thời gian quản lý không được để trống - Cell[{0},11]", i), "");
                                }

                                if (!CheckString(WorkingStatusId))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("WorkingStatusId is not null - Cell[{0},13]", i), "");
                                }
                                else
                                {
                                    if (WorkingStatusId.Equals("4") && !CheckString(ToDate))
                                    {
                                        flag = true;
                                        return new ResultInfo(500, string.Format("WorkingStatusId is NOT Right - Cell[{0},13] - Cell[{0},16]", i), "");
                                    }
                                }
                                if (!CheckString(FromDate))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("FromDate is not null - Cell[{0},15]", i), "");
                                }
                                if (!CheckString(Status))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("Status is not null - Cell[{0},29]", i), "");
                                }
                                else
                                {
                                    if (!Status.Equals("0") && !Status.Equals("1"))
                                    {
                                        flag = true;
                                        return new ResultInfo(500, string.Format("Status is NOT Right - Cell[{0},29]", i), "");
                                    }
                                }
                                if (CheckString(Birthday) && !DateTime.TryParse(Birthday, out _Birthday))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("Birthday is NOT Right - Cell[{0},20]", i), "");
                                }
                                if (CheckString(FromDate) && !DateTime.TryParse(FromDate, out _FromDate))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("FromDate is NOT Right - Cell[{0},15]", i), "");
                                }
                                if (CheckString(ToDate) && !DateTime.TryParse(ToDate, out _ToDate))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("ToDate is NOT Right - Cell[{0},16]", i), "");
                                }
                                if (CheckString(ActualDate) && !DateTime.TryParse(ActualDate, out _ActualDate))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("ActualDate is NOT Right - Cell[{0},17]", i), "");
                                }
                                if (CheckString(IdentityCardDate) && !DateTime.TryParse(IdentityCardDate, out _IdentityCardDate))
                                {
                                    flag = true;
                                    return new ResultInfo(500, string.Format("IdentityCardDate is NOT Right - Cell[{0},26]", i), "");
                                }

                                #endregion
                                DataRow row = dt.NewRow();
                                row["EmployeeCode"] = EmployeeCode;
                                if (CheckString(FirstName)) row["FisrtName"] = FirstName;
                                else row["FisrtName"] = DBNull.Value;

                                if (CheckString(LastName)) row["LastName"] = LastName;
                                else row["LastName"] = DBNull.Value;

                                row["FullName"] = FullName;
                                row["ParentId"] = parent.Id;
                                row["UserName"] = Username;
                                row["TypeId"] = Convert.ToInt16(TypeId);

                                if (CheckString(Gender))
                                {
                                    if (Gender.Equals("male"))
                                        row["Gender"] = 2;
                                    else if (Gender.Equals("female"))
                                        row["Gender"] = 1;
                                    else row["Gender"] = DBNull.Value;
                                }
                                else
                                    row["Gender"] = DBNull.Value;

                                if (CheckString(Marital))
                                {
                                    if (Marital.Equals("single"))
                                        row["Marital"] = 1;
                                    else if (Marital.Equals("married"))
                                        row["Marital"] = 2;
                                    else
                                        row["Marital"] = DBNull.Value;
                                }
                                else
                                    row["Marital"] = DBNull.Value;

                                if (CheckString(Birthday)) row["Birthday"] = Convert.ToDateTime(Birthday);
                                else row["Birthday"] = DBNull.Value;

                                if (CheckString(Email)) row["Email"] = Email;
                                else row["Email"] = DBNull.Value;

                                if (CheckString(Mobile)) row["Mobile"] = Mobile;
                                else row["Mobile"] = DBNull.Value;

                                if (CheckString(Address)) row["Address"] = Address;
                                else row["Address"] = DBNull.Value;

                                if (CheckString(City)) row["City"] = City;
                                else row["City"] = DBNull.Value;

                                if (CheckString(IdentityCardNumber)) row["IdentityCardNumber"] = IdentityCardNumber;
                                else row["IdentityCardNumber"] = DBNull.Value;

                                if (CheckString(IdentityCardDate)) row["IdentityCardDate"] = Convert.ToDateTime(IdentityCardDate);
                                else row["IdentityCardDate"] = DBNull.Value;

                                if (CheckString(IdentityCardBy)) row["IdentityCardBy"] = IdentityCardBy;
                                else row["IdentityCardBy"] = DBNull.Value;

                                if (CheckString(DeviceAddress)) row["DeviceAddress"] = DeviceAddress;
                                else row["DeviceAddress"] = DBNull.Value;

                                row["Status"] = Convert.ToInt16(Status);
                                row["WorkingStatusId"] = Convert.ToInt16(WorkingStatusId);
                                row["FromDate"] = Convert.ToDateTime(FromDate);

                                if (CheckString(ToDate)) row["ToDate"] = Convert.ToDateTime(ToDate);
                                else row["ToDate"] = DBNull.Value;

                                if (CheckString(ActualDate)) row["ActualDate"] = Convert.ToDateTime(ActualDate);
                                else row["ActualDate"] = DBNull.Value;

                                row["FromDateParent"] = Convert.ToInt32(Convert.ToDateTime(FromDateParent).ToString("yyyy-MM-dd").Replace("-", ""));
                                if (!string.IsNullOrEmpty(ToDateParent) && !string.IsNullOrWhiteSpace(ToDateParent))
                                    row["ToDateParent"] = Convert.ToInt32(Convert.ToDateTime(ToDateParent)).ToString("yyyy-MM-dd").Replace("-", "");
                                dt.Rows.Add(row);
                            }
                            package.Save();
                            if (dt.Rows.Count > 0)
                            {
                                int val = await Task.Run(() => _service.Employee_Import(UserId, AccountId, dt));
                                if (val > 0)
                                {
                                    return new ResultInfo(200, string.Format("Import Thành công. {0} rows", dt.Rows.Count), "");
                                }
                                else
                                {
                                    return new ResultInfo(500, "Không thành công", "");
                                }
                            }

                        }
                        else return new ResultInfo(500, "Sheet EmployeeList not found!", "");
                    }
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
            return new ResultInfo(500, "Không thành công", "");
        }

        public static bool CheckString(string Input)
        {
            if (string.IsNullOrEmpty(Input) || string.IsNullOrWhiteSpace(Input))
                return false;
            return true;
        }

        public static bool CheckDate(string Input) 
        {
            DateTime checkDate;
            if (DateTime.TryParseExact(Input, "yyyy-MM-dd", System.Globalization.CultureInfo.InvariantCulture, DateTimeStyles.None, out checkDate))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
