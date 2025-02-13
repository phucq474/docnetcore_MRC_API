using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
using SpiralEntity.Models;

namespace SpiralData
{
    public class WorkingPlanDefaultContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReportListEntity>().HasKey("Id");
            modelBuilder.Entity<ReportListEntity>().ToTable("WorkingPlan.Default");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataTable> Filter(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingPlan.Default.GetList]", userId, jsonData);
        }

        public async Task<DataTable> Insert(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingPlan.Default.Insert]", userId, jsonData);
        }
        public async Task<DataTable> Update(string jsonData, string jsonUpdate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingPlan.Default.Update]", jsonData, jsonUpdate);
        }

        public async Task<int> Delete(string id)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.WorkingPlan.Default.Delete]", id);
        }

        public async Task<DataTable> Export(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingPlan.Default.Export]", userId, jsonData);
        }

        public async Task<DataSet> GetTemplate(int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.WorkingPlan.Default.GetTemplate]", userId, jsonData);
        }

        public async Task<DataTable> GetShop(int employeeId, int FromDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingPlan.Defaul.GetShop]", employeeId, FromDate);
        }

        public async Task<int> Import(int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.WorkingPlan.Default.Import]", userId, json);
        }

        public async Task<IList<WorkingPlanDefaultModel>> WorkingPlanDefault_GetByEmployeeFromDate(int? emloyeeId, int? dateTime)
        {
            return await this.SqlRawAsync<WorkingPlanDefaultModel>("[VNM.WorkingPlan.Default.GetByEmployeeFromDate]", emloyeeId, dateTime);
        }

       
    }
}
