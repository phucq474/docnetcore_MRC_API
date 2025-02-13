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
    public class SuppliersContext:DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SuppliersEntity>().HasKey("Id");
            modelBuilder.Entity<SuppliersEntity>().ToTable("Suppliers");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<List<SuppliersEntity>> GetList(int accountId)
        {
            var data = Suppliers.Where(s => s.Status == 1 && s.AccountId == accountId).ToListAsync();
            return await data;
        }

        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Suppliers.Filter]", accountId, jsonData);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Suppliers.Insert]", accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Suppliers.Update]", accountId, jsonData);
        }

        public async Task<DataTable> Export(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Suppliers.Export]", accountId, jsonData);
        }

        public async Task<int> Import(int accountId, string jsondata)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.Suppliers.Import]", accountId, jsondata);
        }
    }
}
