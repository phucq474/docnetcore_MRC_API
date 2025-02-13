using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
  public  class CompetitorContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CompetitorEntity>().HasKey("Id");
            modelBuilder.Entity<CompetitorEntity>().ToTable("Competitor");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> Filter(int accountId, int? Id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Competitor.Filter]", accountId, Id);
        }

        public async Task<DataTable> Insert(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Competitor.Insert]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Competitor.Update]", accountId, jsonData);
        }

        public async Task<DataSet> Export_Competitor(int accountId, int? id)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Competitor.Export]", accountId, id);
        }

        public async Task<int> Import_Competitor(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Competitor.Import]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Filter_Competitor_Result(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Competitor.Result.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Export_Competitor_Result(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Competitor.Result.Export]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Detail_Competitor_Result(int employeeId, int shopId, int workDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Competitor.Result.Detail]", employeeId, shopId, workDate);
        }

        public async Task<DataTable> FilterCompeDetail(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.CompetitorDetailts.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> InsertCompDetail(int accountId, int userId, int categoryId, string contentName, string contentList, string fromDate, string toDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.CompetitorDetailts.Insert]", accountId, userId, categoryId, contentName, contentList, fromDate, toDate);
        }

        public async Task<int> DeleteCompDetail(int accountId, int userId, int id)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.CompetitorDetailts.Delete]", accountId, userId, id);
        }

        public async Task<DataTable> GetListCategory(int accountId, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Category.GetDynamic]", accountId, userId);
        }
    }
}
