using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class CustomersContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CustomersEntity>().HasKey("Id");
            modelBuilder.Entity<CustomersEntity>().ToTable("Customers");
            base.OnModelCreating(modelBuilder);
        }

        public List<CustomersEntity> GetList(int accountId)
        {
            var data = Customers.Where(c => c.AccountId == accountId && c.Status == 1).ToList();
            if (data != null)
            {
                return data;
            }
            else return null;
        }

        public async Task<DataTable> Filter(int AccountId, string JsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Customers.Filter]", AccountId, JsonData);
        }

        public async Task<DataTable> Insert(int AccountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Customers.Insert]", AccountId, jsonData);
        }
        public async Task<DataTable> Update(int AccountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Customers.Update]", AccountId, jsonData);
        }

        public async Task<DataSet> Export(int AccountId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Customers.Export]", AccountId, jsonData);
        }

        public async Task<int> Import(int AccountId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Customers.Import]", AccountId, json);
        }

        public async Task<DataTable> NewCustomer_Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.NewCustomer.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> NewCustomer_Filter_Detail(int accountId, int userId, int id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.NewCustomer.Filter.Detail]", accountId, userId, id);
        }

        public async Task<DataTable> NewCustomer_Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.NewCustomer.Export]", accountId, userId, jsonData);
        }

        public async Task<DataTable> GetAccountList(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Customers.GetListAccount]", accountId);
        }
    }
}
