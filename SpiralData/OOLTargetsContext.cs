using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class OOLTargetsContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OOLTargetsEntity>().HasKey("Id");
            modelBuilder.Entity<OOLTargetsEntity>().ToTable("OOLTargets");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataSet> OOLTarget_CreateTemplate( int AccountId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.OOLTarget.CreateTeamLate]", AccountId, Json); 
            //return await this.ExcuteDataSetAsync("[dbo].[VNM.OOLTarget.CreateTemplate]", AccountId, Json, UserId);
        }
        //public async Task<int> OOLTarget_Import(int UserId, int AccountId, string Json)
        //{
        //    return await this.ExcuteNonQueryAsync("[dbo].[V2.OOLTarget.Import]", UserId, AccountId, Json);
        //}
        public async Task<int> OOLTarget_Import(int AccountId, string Json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.OOLTarget.Import]", AccountId, Json);
        }
        //public async Task<DataTable> OOLTarget_Filter(int AccountId,int UserId,string Json)
        //{
        //    return await this.ExcuteDataTableAsync("[dbo].[OOLTarget.Filter]", AccountId, UserId, Json); [dbo].[V2.OOLTagert.GetList]
        //}
        public async Task<DataTable> OOLTarget_Filter(int AccountId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OOLTagert.GetList]", AccountId, Json);
        }
        public async Task<DataTable> OOLTargets_Export(int AccountId, string JsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OOLTagert.Export]", AccountId, JsonData);
        }
        public async Task<DataTable> Save(string Action, int AccountId, string JsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OOLTagert.Save]", Action, AccountId, JsonData);
        }
    }
}
