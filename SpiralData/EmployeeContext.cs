using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System.Threading.Tasks;

namespace SpiralData
{
    public class EmployeeContext : DataContext
    {

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeesEntity>().HasKey("Id");
            modelBuilder.Entity<EmployeesEntity>()
                .HasOne(u => u.User)
                .WithOne(e => e.Employee)
                .HasForeignKey<UsersEntity>(p => p.EmployeeId);
            modelBuilder.Entity<EmployeesEntity>().ToTable("Employees");
            base.OnModelCreating(modelBuilder);
        }
        public IList<EmployeeDeviceTokenModel> GetToken(int? AccountId, string EmployeeId)
        {
            return this.SqlRaw<EmployeeDeviceTokenModel>("[dbo].[Employees.GetDeviceToken]", AccountId, EmployeeId);
        }
        public async Task<IList<EmployeeDropDownListModel>> GetEmployeeDDL(int AccountId, int UserId, int? TypeId, int? ParentId, string PositionList, int? formId)
        {
            return await this.SqlRawAsync<EmployeeDropDownListModel>("[dbo].[Employee.GetByAccount]", AccountId, UserId, TypeId, ParentId, PositionList,formId);
        }
        public async Task<DataSet> GetInfoEmployeeById(int accountId, int userId,Int64 EmployeeId)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.Employee.GetInfoById]", accountId, userId, EmployeeId);
        }
        public async Task<IList<EmployeeModel>> EmployeeGetDynamic(int AccountId, int UserId, int? Position, int? SupId, string EmployeeCode, string EmployeeName, string UserName, string Phone, string CMND, int? Status)
        {
            return await this.SqlRawAsync<EmployeeModel>("[dbo].[V2.MRC.Employee.Filter]", AccountId, UserId, Position, SupId, EmployeeCode, EmployeeName, UserName, Phone, CMND, Status);
        }

        public async Task<int> Changepass(int accountId, string oldpass, string newpass, int employeeId)
        {
            var result = await this.ExcuteNonQueryAsync("[dbo].[Employees.ChangePass]", accountId, oldpass, newpass, employeeId);
            return result;
        }
        public async Task<int> ImportTable(DataTable tbl, string Password, int UserId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Employees.Import]", tbl, Password, UserId);
        }
        public async Task<IList<EmployeeModel>> GetByAccount(int AccountId, int UserId, int? TypeId, int? ParentId)
        {
            return await this.SqlRawAsync<EmployeeModel>("[dbo].[Employee.GetByAccount]", AccountId, UserId, TypeId, ParentId);
        }

        public async Task<int> ChangePassWord(int userId, string oldpass, string newpass)
        {
            return await this.ExcuteNonQueryAsync("[dbo.Employee.ChangePass]", userId, oldpass, newpass);
        }
        public async Task<int> ResetPassWord(int AccountId, int EmployeeId, string Password)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Employee.ResetPass]", AccountId, EmployeeId, Password);
        }
        public async Task<int> UserSave(int AccountId, string EmployeeCode, string Username, string Password, string Type)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[UserSave]", AccountId, EmployeeCode, Username, Password, Type);
        }
        public async Task<int> Employee_ResetPass(int? EmployeeId, int AccountId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Users.ResetPass]", EmployeeId, AccountId);
        }
        public async Task<IList<ResultModel>> Employee_Save(int AccountId, int UserId, string Json, string ImageUrl, string Password,string CMNDAfter,string CMNDBefore)
        {
            return await this.SqlRawAsync<ResultModel>("[dbo].[V2.MRC.Employee.Save.Upgrade]", AccountId, UserId, Json, ImageUrl, Password,CMNDAfter,CMNDBefore);
        }
        public async Task<int> Employee_Import(int UserId, int AccountId, DataTable tb)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Employee.Import]", UserId, AccountId, tb);
        }

        public async Task<DataSet> Export(int userId, int AccountId)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.Employee.TempReport]", userId, AccountId);
        }
        public async Task<IList<ResultModel>> EmployeeWorking_Delete(int AccountId, int UserId, int EmployeeWorkingId)
        {
            return await this.SqlRawAsync<ResultModel>("[dbo].[V2.MRC.EmployeeWorking.Delete]", AccountId, UserId, EmployeeWorkingId);
        }
        public async Task<IList<ResultModel>> EmployeeWorking_Update(int EmployeeWorkingId, int? FromDate, int? ToDate, int? ActualDate, int? Status, string Comment)
        {
            return await this.SqlRawAsync<ResultModel>("[dbo].[V2.MRC.EmployeeWorking.Update]", EmployeeWorkingId, FromDate, ToDate, ActualDate, Status, Comment);
        }

        public async Task<IList<EmployeeShopModel>> EmployeePermission(int accountId, int userId)
        {
            return await this.SqlRawAsync<EmployeeShopModel>("[dbo].[Employee.GetPermission]", accountId, userId);
        }
        public async Task<DataTable> MT_Employee_Export(int AccountId,int UserId,string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.EmployeeExport]", AccountId, UserId, Json);
        }
        public async Task<DataTable> newfeed(int employeeId, int IndexFrom, int IndexTo, string searchFeed)
        {
            return await ExcuteDataTableAsync("[dbo].[Mobile.GetFeeds]", employeeId, IndexFrom, IndexTo, searchFeed);
        }
        public async Task<DataTable> usershare(int AccountId,int employeeId)
        {
            return await ExcuteDataTableAsync("[dbo].[Mobile.Feed.UserShare]", AccountId, employeeId);
        }
        public async Task<DataTable> feeddetail(int employeeId, string feedKey)
        {
            return await ExcuteDataTableAsync("[dbo].[Mobile.FeedsDetails]",employeeId,feedKey);
        }
        public async Task<DataTable> FeedComment(int employeeId, string feedKey, int FeedLike, string LikeList, string FeedComment, string FeedMore)
        {
            return await ExcuteDataTableAsync("[dbo].[Mobile.Feeds.Comment]", employeeId, feedKey, FeedLike, LikeList, FeedComment, FeedMore);
        }
        public async Task<DataTable> createfeed(int AccountId, int employeeId, string FeedData, string HasTag, string FollowList, string ViewList, string FeedType)
        {
            return await ExcuteDataTableAsync("[dbo].[Mobile.Feeds.Create]", AccountId, employeeId, FeedData, HasTag, FollowList, ViewList, FeedType);
        }
        public async Task<DataTable> feedupdate(int AccountId, int employeeId,int feedId, string FeedData, string HasTag, string FollowList, string ViewList, string FeedType)
        {
            return await ExcuteDataTableAsync("[dbo].[Website.Feed.Follow]", AccountId, employeeId, feedId,  FeedData, HasTag, FollowList, ViewList, FeedType);
        }

        public async Task<DataTable> imei_filter(int accountId, int userId, string jsonData)
        {
            return await ExcuteDataTableAsync("[dbo].[VNM.Employees.IMEI.Filter]", accountId, userId, jsonData);
        }
        public async Task<DataTable> imei_insert(int accountId, int userId, string jsonData)
        {
            return await ExcuteDataTableAsync("[dbo].[VNM.Employees.IMEI.Insert]", accountId, userId, jsonData);
        }

        public async Task<DataTable> imei_getdata(int accountId, int employeeId)
        {
            return await ExcuteDataTableAsync("[dbo].[VNM.Employees.IMEI.GetData]", accountId, employeeId);
        }

        public async Task<int> Import_VNM(int accountId, int userId, string json)
        {
            return await ExcuteNonQueryAsync("[dbo].[V2.MRC.Employees.Import]", accountId, userId, json);
        }

        public async Task<IList<ResultModel>> imei_save(int accountId, int userId, string jsonIMEI)
        {
            return await this.SqlRawAsync<ResultModel>("[dbo].[VNM.Employees.IMEI.Save]", accountId, userId, jsonIMEI);
        }

        public async Task<DataTable> EmployeeParent_Save(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[EmployeesParent.Save]", accountId, userId, json);
        }
        public async Task<DataTable> EmployeePosition_Save(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[EmployeesPosition.Save]", accountId, userId, json);
        }

        public async Task<DataTable> GetListCity(int accountId, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Employee.GetListReigon]", accountId, userId);
        }

        public async Task<int> Employees_Delete(int accountId, int userId, int employeeId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Employees.Delete]", accountId, userId, employeeId);
        }

        public async Task<DataTable> GetShopByEmployee(int accountId, int employeeId, int? workDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Employees.GetShopByEmployee]", accountId, employeeId, workDate);
        }
    }
}
