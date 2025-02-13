using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
   public class ShiftListContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ShiftListEntity>().HasKey("Id");
            modelBuilder.Entity<ShiftListEntity>().ToTable("ShiftList");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> GetShiftGroup(int accountId)
        {
            return await this.ExcuteDataTableAsync("[VNM.ShiftList.GetShiftGroup]", accountId);
        }

        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[VNM.ShiftList.Filter]", accountId, jsonData);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[VNM.ShiftList.Insert]", accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[VNM.ShiftList.Update]", accountId, jsonData);
        }

        public async Task<DataTable> Export(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[VNM.ShiftList.Export]", accountId, jsonData);
        }

        public async Task<int> Import(int accountId, string jsondata)
        {
            return await this.ExcuteNonQueryAsync("[VNM.ShiftList.Import]", accountId, jsondata);
        }
    }
}
