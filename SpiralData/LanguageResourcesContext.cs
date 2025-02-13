using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System.Linq;
using System.Threading.Tasks;
using System.Data;

namespace SpiralData
{
    public class LanguageResourcesContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LanguageResourcesEntity>().HasKey("Id");
            modelBuilder.Entity<LanguageResourcesEntity>().ToTable("LanguageResources");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> data_report(int accountId)
        {
            return await this.ExcuteDataTableAsync("dbo.[LanguageResources.Report]", accountId);
        }

        
        public async Task<DataTable> Filter(string resourceName, int accountId)
        {
            return await this.ExcuteDataTableAsync("dbo.[LanguageResources.Filter]", resourceName, accountId);
        }

        public async Task<DataTable> LanguageResources_Insert(int accountId, string resourceName, string vietnam, string english)
        {
            return await this.ExcuteDataTableAsync("dbo.[LanguageResources.Insert]", accountId, resourceName, vietnam, english);
        }

        public async Task<int> Import(int accountId, DataTable dataImport)
        {
            return await this.ExcuteNonQueryAsync("dbo.[LanguageResources.Import]", accountId, dataImport);
            
        }

        public async Task<DataTable> LanguageResources_InsertSingle(int accountId, string resourceName, string vietNam, int display)
        {
            return await this.ExcuteDataTableAsync("dbo.[LanguageResources.InsertSingle]", accountId, resourceName, vietNam, display);
        }

        public async Task<DataTable> LanguageResources_Update(int? idVn, int? idEn, string vietNam, string english)
        {
            return await this.ExcuteDataTableAsync("dbo.[LanguageResources.Update]", idVn, idEn, vietNam, english);
        }
    }
}
