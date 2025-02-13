using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class EmployeeAnnualLeaveContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmployeeAnnualLeaveEntity>().HasKey("Id");
            modelBuilder.Entity<EmployeeAnnualLeaveEntity>().ToTable("[Employee.AnnualLeave]");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataSet> EmployeeAnnualLeave_Filter(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.Employee.AnnualLeave.Filter]", AccountId, UserId, Json);
        }
        public async Task<int> EmployeeAnnualLeave_Save(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.Employee.AnnualLeave.Save]", AccountId, UserId, Json);
        }   
        public async Task<int> EmployeeAnnualLeave_Import(int AccountId,int UserId,string Json, string nBJson)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.Employee.AnnualLeave.Import]", AccountId, UserId, Json, nBJson);
        }
        public async Task<DataTable> EmployeeAnnualLeave_Export(int AccountId,int UserId,string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.Employee.AnnualLeave.Export]", AccountId, UserId, Json);
        }
        public async Task<DataSet> EmployeeAnnualLeave_Template(int AccountId,int UserId,string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.Employee.AnnualLeave.Template]", AccountId, UserId, Json);
        }

        public async Task<int> EmployeeAnnualLeave_Update(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.Employee.AnnualLeave.Update]", accountId, userId, jsonData);
        }
    }
}
