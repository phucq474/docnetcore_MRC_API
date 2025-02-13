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
    public class RegionContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<RegionEntity>().HasKey("Id");
            modelBuilder.Entity<RegionEntity>().ToTable("Region");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> GetArea(int accountId)
        {
            return await this.ExcuteDataTableAsync("[Region.GetArea]", accountId);
        }

        public async Task<int> ImportMaster(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[V2.Region.Import]",accountId, userId, json);
        }
    }
}
