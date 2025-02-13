using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;


namespace SpiralData
{
    public class WorkingResultOOLContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkingResultOOLEntity>().HasKey("Id");
            modelBuilder.Entity<WorkingResultOOLEntity>().ToTable("WorkingResultOOL");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataTable> FilterOOLResult(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Visibility.Filter]", AccountId, UserId, Json);
        }
        public async Task<DataSet> ExportOOLResult(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.Visibility.Export]", AccountId, UserId, Json);
        }
        public async Task<DataTable> DetailOOLResult(int EmployeeId, int ShopId, int WorkDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Visibility.Detail]", EmployeeId, ShopId, WorkDate);
        }
    }
}
