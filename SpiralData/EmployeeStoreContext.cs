using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class EmployeeStoreContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeeShopsEntity>().HasKey("Id");
            modelBuilder.Entity<EmployeeShopsEntity>().ToTable("EmployeeShops");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataSet> EmployeeStore_Filter(int AccountId, int UserId, int EmployeeId, int? CustomerId, string Area, string ProvinceId, string ShopCodes)
        {
            return await this.ExcuteDataSetAsync("[dbo].[EmployeeShop.Filter]", AccountId, UserId, EmployeeId, CustomerId, Area, ProvinceId, ShopCodes);
        }
        public async Task<int> EmployeeStore_Save(int AccountId, int UserId, int EmployeeId, string ShopSave, string ShopCode)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[EmployeeShop.Save]", AccountId, UserId, EmployeeId, ShopSave, ShopCode);
        }
        public async Task<DataSet> GetTempStorePermissionImport(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[EmployeeShop.TempImport]", AccountId, UserId, Json);
        }

        public async Task<DataTable> EmployeeStore_EditDate(int Id, int AccountId, int EmployeeId, int ShopId, int FromDate, int? ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.EmployeeStore.EditDate]", Id, AccountId, EmployeeId, ShopId, FromDate, ToDate);
        }
        public async Task<int> EmployeeShop_Import(DataTable tbl,int AccountId,int UserId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[EmployeeShop.Import]", tbl, AccountId, UserId);
        }    
    }
}
