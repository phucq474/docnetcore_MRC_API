using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class OSAResultsContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<OSAResultsEntity>().HasKey("Id");
            modelBuilder.Entity<OSAResultsEntity>().ToTable("OSAResults");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> GetList(int AccountId,int UserId,string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OSAResult.GetList]", AccountId,UserId, Json);
        }
        public async Task<DataTable> GetDetail(string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OSAResult.GetDetail]", Json);
        }
        public async Task<DataSet> Export(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.OSAResult.Export]", AccountId,UserId, Json);
        }

    }
}
