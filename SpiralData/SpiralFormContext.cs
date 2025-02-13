using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SpiralFormContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SpiralFormEntity>().HasKey("Id");
            modelBuilder.Entity<SpiralFormEntity>().ToTable("SpiralForm");
            base.OnModelCreating(modelBuilder);
        }
        public virtual DbSet<SpiralFormEntity> SpiralForm { set; get; }
        public async Task<int> CreateForm(int AccountId, string Title, string SubTitle, int FromDate, int? ToDate, string Banner, string Slogan, string AccessKey, string jsonData, int LoginId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Form.Create]", AccountId, Title, SubTitle, FromDate, ToDate, Banner, Slogan, AccessKey, jsonData, LoginId);
        }
        public async Task<DataTable> GetResultTotal(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Result.GetList]", AccountId, UserId, Json);
        }
        public async Task<List<SpiralFormEntity>> GetByKey(string Key, string Host)
        {
            var data = await this.SqlRawAsync<SpiralFormEntity>("[dbo].[SpiralForm.GetById]", Key, Host);
            return data.ToList();
        }
        public async Task<IList<ShopDDLModel>> GetStore(int? AccountId, int? UserId)
        {
            return await this.SqlRawAsync<ShopDDLModel>("dbo.[SpiralForm.GetStore]", AccountId, UserId);
        }
        public async Task<SpiralFormEntity> CreateForm(SpiralFormEntity f, int userId, int accountId)
        {
            var result = await this.SqlRawAsync<SpiralFormEntity>("[dbo].[SpiralForm.Save]", accountId, userId,
               f.Id, f.Status, f.Title, f.SubTitle, f.Banner, f.UsedEmployees, f.UsedStores, f.Slogan, f.FromDate, f.ToDate,
               f.FormData, f.AccessKey, f.PositionList, f.MMobile, f.InApp, f.PublicUrl, f.WebUrl, f.RepeatDate, f.ActiveDate, f.Public
               );
            var listData = (List<SpiralFormEntity>)result;
            SpiralFormEntity data = listData[0];
            return data;
        }

        public async Task<List<SpiralFormEntity>> GetList(int accountId, int? fromDate, string title, int userId)
        {
            var data= await this.SqlRawAsync<SpiralFormEntity>("dbo.[SpiralForm.GetList]",accountId,userId,fromDate,title );
            return data.ToList();
        }

        public async Task<DataTable> TabDetail(int accountId, int workDate, int formId, int? SupervisorId, string listEm)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.TabDetail]", accountId, workDate, formId, SupervisorId, listEm);
        }

        public async Task<DataSet> ExportRawData(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[SpiralForm.RawData]", accountId, userId, jsonData);
        }
        public async Task<List<SpiralFormModel>> ExportImage(int accountId, int userId, string jsonData)
        {
            var data = await this.SqlRawAsync<SpiralFormModel>("[dbo].[SpiralForm.ExportImage]", accountId, userId, jsonData);
            return data.ToList();
        }

        public IList<QuestionModel> GetQuestionName(int accountId, int formId)
        {
            return this.SqlRaw<QuestionModel>("[dbo].[SpiralForm.GetQuestionName]", accountId, formId);
        }

        public async Task<DataTable> InactiveSpiralForm(int accountId, int formId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.UpdateStatus]", accountId, formId);
        }

        public async Task<DataTable> Delete_SpiralFormResult(int accountId, int id, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Result.Delete]", accountId, id, userId);
        }

        public async Task<DataTable> Notify_GetEmployees(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Notify.GetEmployees]", accountId, userId, json);
        }
        public async Task<int> Notify_UpdateMessenger(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[SpiralForm.Notify.UpdateMessenger]", accountId, userId, json);
        }

        public async Task<int> LogData(int userId, long id)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[SpiralForm.LogData]", userId, id);
        }

        public async Task<DataSet> ExportForm42(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[SpiralForm.Report.Form42]", accountId, userId, jsonData);
        }
        public async Task<SpiralFormModel> GetResultById(int accountId, int userId, long Id)
        {
            var data = await this.SqlRawAsync<SpiralFormModel>("[dbo].[SpiralForm.Result.GetById]", accountId, userId, Id);
            return data.ToList().FirstOrDefault();
        }
        public async Task<int> UpdateResult(int AccountId, int UserId, long Id, string FormData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[SpiralForm.Result.Update]", AccountId, UserId, Id, FormData);
        }
    }
}
