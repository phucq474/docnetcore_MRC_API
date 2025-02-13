
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SpiralData;
using SpiralEntity;
using System;
using SpiralEntity.Models;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace SpiralService
{
    public interface IEmployeeService
    {
        List<EmployeeDeviceTokenModel> GetToken(int? AccountId, string EmployeeId);
        List<EmployeesEntity> GetList(int AccountId);
        List<EmployeesEntity> GetAll(int AccountId);
        EmployeesEntity GetById(int EmployeeId);
        Task<int> ResetPass(int AccountId, int userId, string oldpass, string password);
        Task<List<EmployeeTypesEntity>> GetListEmployeeType(int AccountId);
        Task<List<EmployeeDropDownListModel>> GetEmployeeDDL(int AccountId, int UserId, int? TypeId, int? ParentId, string PositionList, int? formId);
        Task<DataSet> Employee_GetInfoByEmployeeId(int accountId, int userId,Int64 EmployeeId);
        Task<List<ResultModel>> Employee_Save(int AccountId, int UserId, string Json, string ImageUrl, string Password, string CMNDAfter, string CMNDBefore);
        EmployeesEntity GetByEmployeeCode(int AccountId, string EmployeeCode);
        Task<List<EmployeeModel>> EmployeeGetDynamic(int AccountId, int UserId, int? Position, int? SupId, string EmployeeCode, string EmployeeName, string UserName, string Phone, string CMND, int? Status);
        EmployeesEntity FindEmplyeeByEmail(int AccountId, string email, string username);
        Task<int> ChangePass(int accountId, string oldpass, string newpass, int employeeId);
        Task<EmployeesEntity> GetEmployeeByCode(int AccountId, string EmployeeCode);
        Task<int> ImportTable(DataTable tbl, string Password, int UserId);
        Task<int> Employee_ResetPass(int? EmployeeId, int AccountId);
        Task<int> ResetPassWord(int AccountId, int EmployeeId, string Password);
        Task<List<EmployeeModel>> GetByAccount(int AccountId, int UserId, int? TypeId, int? ParentId);
        List<string> getEmployeeCode(int accountId);
        Task<int> UserSave(int AccountId, string EmployeeCode, string Username, string Password, string Type);
        Task<int> Employee_UpdateStatus(int AccountId, int UserId, int EmployeeId);
        //Task<int> Employee_ResetPass(int EmployeeId);
        Task<int> Employee_Import(int UserId, int AccountId, DataTable tb);
        Task<DataSet> Export(int userId, int AccountId);
        bool CheckValidByEmployeeCode(int AccountId, string EmployeeCode, string UserName);
        EmployeesEntity GetByEmployeeCode(string EmployeeCode);
        Task<IList<ResultModel>> EmployeeWorking_Delete(int AccountId, int UserId, int EmployeeWorkingId);
        Task<IList<ResultModel>> EmployeeWorking_Update(int EmployeeWorkingId, int? FromDate, int? ToDate, int? ActualDate, int? Status, string Comment);
        Task<List<EmployeeShopModel>> EmployeeShopPermission(int AccountId, int UserId);
        Task<DataTable> MT_Employee_Export(int AccountId, int UserId, string Json);

        Task<DataTable> newfeed(int employeeId, int indexFrom, int indexTo, string searchFeed);
        Task<DataTable> usershare(int AccountId, int employeeId);
        Task<DataTable> feeddetail(int employeeId, string feedKey);
        Task<DataTable> FeedComment(int employeeId, string feedKey, int FeedLike, string LikeList, string FeedComment, string FeedMore);
        Task<DataTable> createfeed(int AccountId, int employeeId, string FeedData, string HasTag, string FollowList, string ViewList, string FeedType);
        Task<DataTable> feedupdate(int AccountId, int employeeId, int feedId,  string FeedData, string HasTag, string FollowList, string ViewList, string FeedType);
        Task<DataTable> imei_filter(int accountId, int userId, string jsonData);
        Task<DataTable> imei_insert(int accountId, int userId, string jsonData);
        Task<DataTable> imei_getdata(int accountId, int employeeId);
        Task<int> Import_VNM(int accountId, int userId, string json);
        Task<List<ResultModel>> imei_save(int accountId, int userId, string jsonIMEI);
        Task<DataTable> EmployeeParent_Save(int accountId, int userId, string json);
        Task<DataTable> EmployeePosition_Save(int accountId, int userId, string json);

        Task<DataTable> GetListCity(int accountId, int userId);
        Task<DataTable> GetShopByEmployee (int accountId, int employeeId, int? workDate);
    }

    public class EmployeeService : IEmployeeService
    {
        private readonly EmployeeContext _context;
        public EmployeeService(EmployeeContext context)
        {
            _context = context;
        }
        public async Task<int> ChangePass(int accountId, string oldpass, string newpass, int employeeId)
        {
            oldpass = Helper.Encrypt(oldpass, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            newpass = Helper.Encrypt(newpass, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            return await _context.Changepass(accountId, oldpass, newpass, employeeId);
        }
        public async Task<List<EmployeeTypesEntity>> GetListEmployeeType(int AccountId)
        {
            return await _context.EmployeeTypes.Where(e => e.AccountId == AccountId && e.Status == 1).ToListAsync();
        }
        public List<EmployeesEntity> GetAll(int AccountId)
        {
            return _context.Employees.Where(e => e.AccountId == AccountId ).ToList();
        }
        public List<EmployeesEntity> GetList(int AccountId)
        {
            return _context.Employees.Where(e => e.AccountId == AccountId && e.Status == 1).ToList();
        }
        public EmployeesEntity GetById(int EmployeeId)
        {
            return _context.Employees.Where(a => a.Id == EmployeeId).FirstOrDefault();
        }
        async Task<List<EmployeeDropDownListModel>> IEmployeeService.GetEmployeeDDL(int AccountId, int UserId, int? TypeId, int? ParentId, string PositionList, int? formId)
        {
            var data = await _context.GetEmployeeDDL(AccountId, UserId, TypeId, ParentId, PositionList,formId);
            if (data != null)
                return (List<EmployeeDropDownListModel>)data;
            else
                return null;
        }
        public List<EmployeeDeviceTokenModel> GetToken(int? AccountId, string EmployeeId)
        {
            var data = _context.GetToken(AccountId, EmployeeId);
            if (data != null)
                return (List<EmployeeDeviceTokenModel>)data;
            else
                return null;
        }
        public Task<EmployeesEntity> GetEmployeeByCode(int AccountId, string EmployeeCode)
        {
            return Task.Run(() => (from e in _context.Employees where e.AccountId == AccountId && e.EmployeeCode == EmployeeCode.ToUpper().Trim() select e).FirstOrDefault());
        }
        public async Task<DataSet> Employee_GetInfoByEmployeeId(int accountId, int userId, Int64 EmployeeId)
        {
            return await _context.GetInfoEmployeeById(accountId, userId, EmployeeId);
        }
        public async Task<List<ResultModel>> Employee_Save(int AccountId, int UserId, string Json, string ImageUrl, string Password, string CMNDAfter, string CMNDBefore)
        {
            if (string.IsNullOrEmpty(Password) || string.IsNullOrWhiteSpace(Password))
                Password = null;
            else
                Password = Helper.Encrypt(Password, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            var data = await _context.Employee_Save(AccountId, UserId, Json, ImageUrl, Password, CMNDAfter, CMNDBefore);
            if (data != null)
                return (List<ResultModel>)data;
            else
                return null;
        }
        public async Task<int> Employee_ResetPass(int? EmployeeId, int AccountId)
        {
            return await _context.Employee_ResetPass(EmployeeId, AccountId);
        }
        public EmployeesEntity GetByEmployeeCode(int AccountId, string EmployeeCode)
        {
            var emp = (from e in _context.Employees join u in _context.Users on e.Id equals u.EmployeeId where e.AccountId == AccountId && (EmployeeCode == null || e.EmployeeCode == EmployeeCode) select e).FirstOrDefault();
            return emp;
        }
        public async Task<List<EmployeeModel>> EmployeeGetDynamic(int AccountId, int UserId, int? Position, int? SupId, string EmployeeCode, string EmployeeName, string UserName, string Phone, string CMND, int? Status)
        {
            var data = await _context.EmployeeGetDynamic(AccountId, UserId, Position, SupId, EmployeeCode, EmployeeName, UserName, Phone, CMND, Status);
            if (data != null)
                return (List<EmployeeModel>)data;
            else
                return null;

        }
        public async Task<int> ImportTable(DataTable tbl, string Password, int UserId)
        {
            return await _context.ImportTable(tbl, Password, UserId);
        }
        public async Task<List<EmployeeModel>> GetByAccount(int AccountId, int UserId, int? TypeId, int? ParentId)
        {
            var data = await _context.GetByAccount(AccountId, UserId, TypeId, ParentId);
            if (data != null)
                return (List<EmployeeModel>)data;
            else
                return null;

        }

        public EmployeesEntity FindEmplyeeByEmail(int accountId, string email, string username)
        {
            var item = from e in _context.Employees
                       join u in _context.Users on e.Id equals u.EmployeeId
                       where (e.AccountId == accountId && e.Email == email && u.Username == username)
                       select e;
            return item.FirstOrDefault();
        }
        public async Task<int> ResetPass(int AccountId, int userId, string oldpass, string password)
        {
            string newencrypt = Helper.Encrypt(password, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            var res = await _context.ChangePassWord(userId, oldpass, newencrypt);
            return res;
        }

        public Task<int> ResetPassWord(int AccountId, int EmployeeId, string Password)
        {
            string newencrypt = Helper.Encrypt(Password, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            return _context.ResetPassWord(AccountId, EmployeeId, newencrypt);
        }
        public List<string> getEmployeeCode(int accountId)
        {
            List<string> data = (from e in _context.Employees
                                 where e.AccountId == accountId
                                 select e.EmployeeCode).ToList();
            return data;
        }
        public async Task<int> UserSave(int AccountId, string EmployeeCode, string Username, string Password, string Type)
        {
            Password = Helper.Encrypt(Password, string.Format("ACCOUNT{0}.{1}", 1, "Authorization"));
            return await _context.UserSave(AccountId, EmployeeCode, Username, Password, Type);
        }
        public async Task<int> Employee_UpdateStatus(int AccountId, int userId, int EmployeeId)
        {
            return await _context.Employees_Delete(AccountId, userId, EmployeeId);
        }
        //public async Task<int> Employee_ResetPass(int EmployeeId)
        //{
        //    var user = _context.Users.Where(u => u.EmployeeId == EmployeeId).FirstOrDefault();
        //    user.Password = "wwNQwM5eHzVeyLxa4Wmiig==";
        //    await _context.SaveChangesAsync();
        //    return 1;
        //}
        public async Task<int> Employee_Import(int UserId, int AccountId, DataTable tb)
        {
            return await _context.Employee_Import(UserId, AccountId, tb);
        }
        public async Task<DataSet> Export(int userId, int AccountId)
        {
            return await _context.Export(userId, AccountId);
        }
        public bool CheckValidByEmployeeCode(int AccountId, string EmployeeCode, string UserName)
        {
            var user = from u in _context.Users
                       join e in _context.Employees on u.EmployeeId equals e.Id
                       where u.Username == UserName && u.AccountId == AccountId && e.EmployeeCode != EmployeeCode
                       select new UsersEntity
                       {
                           AccountId = u.AccountId,
                           EmployeeId = u.EmployeeId,
                           Username = u.Username,
                           Employee = u.Employee
                       };
            if (user.FirstOrDefault() != null)
                return false;
            return true;
        }
        public EmployeesEntity GetByEmployeeCode(string EmployeeCode)
        {
            return _context.Employees.Where(e => e.EmployeeCode == EmployeeCode).FirstOrDefault();
        }
        public async Task<IList<ResultModel>> EmployeeWorking_Delete(int AccountId, int UserId, int EmployeeWorkingId)
        {
            var data = await _context.EmployeeWorking_Delete(AccountId, UserId, EmployeeWorkingId);
            if (data != null)
                return (List<ResultModel>)data;
            else
                return null;
        }
        public async Task<IList<ResultModel>> EmployeeWorking_Update(int EmployeeWorkingId, int? FromDate, int? ToDate, int? ActualDate, int? Status, string Comment)
        {
            return await _context.EmployeeWorking_Update(EmployeeWorkingId, FromDate, ToDate, ActualDate, Status, Comment);
        }

        public async Task<List<EmployeeShopModel>> EmployeeShopPermission(int AccountId, int UserId)
        {
            var data = await _context.EmployeePermission(AccountId, UserId);
            if (data != null)
                return (List<EmployeeShopModel>)data;
            else
                return null;
        }
        public async Task<DataTable> MT_Employee_Export(int AccountId, int UserId, string Json)
        {
            return await _context.MT_Employee_Export(AccountId, UserId, Json);
        }

        public async Task<DataTable> newfeed(int employeeId, int indexFrom, int indexTo, string searchFeed)
        {
            return await _context.newfeed(employeeId, indexFrom, indexTo, searchFeed);
        }

        public async Task<DataTable> usershare(int AccountId, int employeeId)
        {
            return await _context.usershare(AccountId,employeeId);
        }
        public async Task<DataTable> feeddetail(int employeeId,string feedKey)
        {
            return await _context.feeddetail(employeeId, feedKey);
        }
        public async Task<DataTable> FeedComment(int employeeId, string feedKey, int FeedLike, string LikeList, string FeedComment, string FeedMore)
        {
            return await _context.FeedComment(employeeId, feedKey, FeedLike, LikeList, FeedComment, FeedMore);
        }
        public async Task<DataTable> createfeed(int AccountId, int employeeId
            , string FeedData, string HasTag, string FollowList, string ViewList, string FeedType)
        {
            return await _context.createfeed(AccountId, employeeId, FeedData, HasTag, FollowList, ViewList, FeedType);
        }
        public async Task<DataTable> feedupdate(int AccountId, int employeeId,int feedId, string FeedData, string HasTag, string FollowList, string ViewList, string FeedType)
        {
            return await _context.feedupdate(AccountId, employeeId, feedId,FeedData, HasTag, FollowList, ViewList, FeedType);
        }
        public async Task<DataTable> imei_filter(int accountId, int userId, string jsonData)
        {
            return await _context.imei_filter(accountId, userId, jsonData);
        }
        public async Task<DataTable> imei_insert(int accountId, int userId, string jsonData)
        {
            return await _context.imei_insert(accountId, userId, jsonData);
        }
        public async Task<DataTable> imei_getdata(int accountId, int employeeId)
        {
            return await _context.imei_getdata(accountId, employeeId);
        }
        public async Task<int> Import_VNM(int accountId, int userId, string json)
        {
            return await _context.Import_VNM(accountId, userId, json);
        }
        public async Task<List<ResultModel>> imei_save(int accountId, int userId, string jsonIMEI)
        {
            var data = await _context.imei_save(accountId, userId, jsonIMEI);
            if (data != null)
                return (List<ResultModel>)data;
            else
                return null;
        }

        public async Task<DataTable> EmployeeParent_Save(int accountId, int userId, string json)
        {
            return await _context.EmployeeParent_Save(accountId, userId, json);
        }
        public async Task<DataTable> EmployeePosition_Save(int accountId, int userId, string json)
        {
            return await _context.EmployeePosition_Save(accountId, userId, json);
        }
        public async Task<DataTable> GetListCity(int accountId, int userId)
        {
            return await _context.GetListCity(accountId, userId);
        }
        public async Task<DataTable> GetShopByEmployee(int accountId, int employeeId, int? workDate)
        {
            return await _context.GetShopByEmployee(accountId, employeeId, workDate);
        }
    }
}

