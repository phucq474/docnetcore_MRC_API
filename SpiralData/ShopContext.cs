using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class ShopContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ShopsEntity>().ToTable("Shops");
            modelBuilder.Entity<ShopsEntity>().HasKey(table => new
            {
                table.Id,
                table.AccountId
            });
            base.OnModelCreating(modelBuilder);
        }

        public List<ShopsEntity> GetList(int accountId)
        {
            var data = Shops.Where(s => s.AccountId == accountId).ToList();
            return data;
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Shops.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Shops.Insert]", accountId, jsonData);
        }

        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Shops.Update]", accountId, jsonData);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.Shops.Export]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.Shops.Import]", accountId, json);
        }
         
        public async Task<IList<ShopDDLModel>> GetShopByEmployee(int? employeeId, string json, int AccountId)
        {
            return await this.SqlRawAsync<ShopDDLModel>("[dbo].[VNM.Shops.GetByEmployee]", employeeId, json, AccountId);
        }
        public async Task<IList<ShopDDLModel>> GetShopByEmployeeForm(int? AccountId, int? UserId, int? WorkDate, int? Position, string SupId, string EmployeeId, int? DealerId, string Area, string Region, string Province)
        {
            return await this.SqlRawAsync<ShopDDLModel>("dbo.[Store.GetByEmployee]", AccountId, UserId, WorkDate, Position, SupId, EmployeeId, DealerId, Area, Region, Province);
        }
    } 
}
