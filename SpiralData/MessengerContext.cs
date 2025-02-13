using Microsoft.EntityFrameworkCore;
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
    public class MessengerContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MessengerEntity>().HasKey("Id");
            modelBuilder.Entity<MessengerEntity>().ToTable("Messenger");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<IList<AlertEntity>> UploadNotification(DataTable dt,string ReportType)
        {
            return await this.SqlRawAsync<AlertEntity>("[dbo].[Messenger.UploadNotification]", dt, ReportType);
        }
        public async Task<int> ImportNotify(int AccountId, int Month, int Year, int LoginId, DataTable dt)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Messenger.Import]", AccountId, Month, Year, LoginId, dt);
        }
        public async Task<IList<MessengerModel>> GetList(int AccountId, int Month, int Year, int? Status, string NotifyType,string employeeId, int UserId, int? Position, string notifyTitle)
        {
            return await this.SqlRawAsync<MessengerModel>("dbo.[Notify.GetList]", AccountId, Month, Year, Status, NotifyType,employeeId, UserId, Position, notifyTitle);
        }
        public async Task<int> RemoveNotify(int accountId, string idList, int userId)
        {
            return await Task.Run(() => this.ExcuteNonQuery("dbo.[Notify.Remove]", accountId, idList, userId));
        }

        public async Task<int> UpdateNotify(int AccountId, string IdList, int UserId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Notify.Update]", AccountId, IdList, UserId);
        }

        public async Task<IQueryable<MessengerModel>> GetNotifyGroup(int accountId, int userId)
        {
            var lst = await Task.Run(() => (from g in this.Messengers
                                            where g.AccountId == accountId
                                            select new MessengerModel { TypeReport = g.TypeReport }).Distinct());
            return lst;
        }

        public async Task<DataTable> Export(int accountId, int month, int year, int? status, string notifyType, string employeeId, int userId, int? position, string notifyTitle)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Notify.Export]", accountId, month, year, status, notifyType, employeeId, userId, position, notifyTitle);
        }

        public async Task<DataTable> GetNotifyTitle(int accountId, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Notify.GetTitle]", accountId, userId);
        }
    }
}
