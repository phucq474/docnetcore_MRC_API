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
    public class MasterListDataContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MasterListDataEntity>().HasKey("ListCode", "Code");
            modelBuilder.Entity<MasterListDataEntity>().ToTable("MasterListData");
            modelBuilder.Entity<BankEntity>().HasKey("Id");
            modelBuilder.Entity<BankEntity>().ToTable("Banks");
            base.OnModelCreating(modelBuilder);
        }
        public IEnumerable<BankEntity> BanksGetList()
        {
            return this.Banks.AsParallel<BankEntity>();
        }

        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MasterListData.Filter]", accountId, jsonData);
        }

        public async Task<DataTable> GetListCode(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MasterListData.GetListCode]", accountId);
        }

        public async Task<DataTable> GetName(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MasterListData.GetName]", accountId);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MasterListData.Insert]", accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MasterListData.Update]", accountId, jsonData);
        }
        public async Task<DataTable> Delete(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MasterListData.Delete]", accountId, jsonData);
        }
    }
}
