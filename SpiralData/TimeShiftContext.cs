using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using System.Data;
using SpiralEntity;
using System.Threading.Tasks;

namespace SpiralData
{
    public class TimeShiftContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ShiftTimeEntity>().HasKey("Id");
            modelBuilder.Entity<ShiftTimeEntity>().ToTable("TimeShift");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> Filter(int accountId, int userId, int? fromDate, int? toDate, int? dealerId, string shopCode, int? categoryId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.Filter]", accountId, userId, fromDate, toDate, dealerId, shopCode, categoryId);
        }

        public async Task<DataTable> Update(int id, int? categoryId, int? toDate, string fromTo, string shift)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.Update]", id, categoryId, toDate, fromTo, shift);
        }

        public async Task<DataTable> Insert(int shopId, int? categoryId, int fromDate_int, int? toDate_int, string shift, string from, string to, string from1, string to1)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.Insert]", shopId, categoryId, fromDate_int, toDate_int, shift, from, to, from1, to1);
        }

        public async Task<DataTable> CheckEndTime(int accountId, int shopId, int? categoryId, int fromDate_int, string shift)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.CheckEndTime]",accountId, shopId, categoryId, fromDate_int, shift);
        }

        public async Task<DataTable> ShiftList(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.ShiftLists]", accountId);
        }

        public async Task<DataTable> Export(int accountId, int userId, int? fromDate, int? toDate, int? dealerId, string shopCode, int? categoryId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.ExportAll]", accountId, userId, fromDate, toDate, dealerId, shopCode, categoryId);
        }

        public async Task<int> Import(int accountId, DataTable dataImport)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[TimeShift.Import]", accountId, dataImport);
        }

        public async Task<int> Delete(int timeShiftId, int userId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[TimeShift.Delete]", timeShiftId, userId);
        }

        public async Task<DataTable> TmpImport(int accountId, int? fromDate, string shopCode)
        {
            return await this.ExcuteDataTableAsync("[dbo].[TimeShift.TmpImport]", accountId, fromDate, shopCode);
        }
    }
}
