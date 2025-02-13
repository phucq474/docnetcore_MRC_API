using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class PromotionResultsContext :DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PromotionResultsEntity>().HasKey("Id");
            modelBuilder.Entity<PromotionResultsEntity>().ToTable("PromotionResults");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataTable> GetList(int AccountId,int UserId,string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Promotion.Filter]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetDetail(int ShopId,int EmployeeId,int WorkDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Promotion.Detail]", ShopId, EmployeeId, WorkDate);
        }

        public async Task<DataTable> ExportRawdata(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.PromotionResults.Rawdata]", userId, jsonData);
        }
    }
}
