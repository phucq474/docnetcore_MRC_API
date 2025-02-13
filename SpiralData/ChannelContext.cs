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
    public class ChannelContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ChannelEntity>().HasKey("Id");
            modelBuilder.Entity<ChannelEntity>().ToTable("Channel");
            base.OnModelCreating(modelBuilder);
        }

        public List<ChannelEntity> GetList(int accountId)
        {
            var data = Channel.Where(c => c.AccountId == accountId).ToList();
            if (data != null)
                return data;
            else
                return null;
        }

        public async Task<DataTable> Filter(int accountId, int? id)
        {
            return await this.ExcuteDataTableAsync("[VNM.Channel.Filter]", accountId, id);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[VNM.Channel.Insert]", accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[VNM.Channel.Update]", accountId, jsonData);
        }
    }
}
