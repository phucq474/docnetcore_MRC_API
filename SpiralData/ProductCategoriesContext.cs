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
    public class ProductCategoriesContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductCategoriesEntity>().HasKey("Id");
            modelBuilder.Entity<ProductCategoriesEntity>().ToTable("ProductCategories");
            base.OnModelCreating(modelBuilder);
        }

        public List<ProductCategoriesEntity> GetList(int accountId)
        {
            var data = ProductCategories.Where(p => p.AccountId == accountId).ToList();
            if (data != null)
                return data;
            else
                return null;
        }

        public async Task<DataTable> Filter(int AccountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.ProductCategories.Filter]", AccountId, jsonData);
        }

        public async Task<DataTable> Export(int AccountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.ProductCategories.Export]", AccountId, jsonData);
        }

        public async Task<int> Import(int AccountId, string jsondata)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.ProductCategories.Import]", AccountId, jsondata);
        }
    }
}
