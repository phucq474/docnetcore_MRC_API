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
    public class ProductContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ProductsEntity>().HasKey("Id");
            modelBuilder.Entity<ProductsEntity>().ToTable("Products");
            base.OnModelCreating(modelBuilder);
        }

        public IList<ProductModel> GetList(int AccountId)
        {
            return this.SqlRaw<ProductModel>("[dbo].[V2.MRC.Products.GetList]", AccountId);
        }
        public async Task<DataTable> Filter(int AccountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Products.Filter]", AccountId, jsonData);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Products.Insert]", accountId, jsonData);
        }

        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Products.Update]", accountId, jsonData);
        }

        public async Task<DataSet> Export(int AccountId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.Products.Export]", AccountId, jsonData);
        }

        public async Task<int> Import(int accountId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.Products.Import]", accountId, json);
        }

        public async Task<DataTable> GetListProductType(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Products.ListProductType]", accountId);
        }
    }
}
