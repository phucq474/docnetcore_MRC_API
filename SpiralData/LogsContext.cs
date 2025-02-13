using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class LogsContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LogsEntity>().HasKey("ID");
            modelBuilder.Entity<LogsEntity>().ToTable("Logs");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<int> WriteLog(LogsEntity logs)
        {
            await this.Logs.AddAsync(logs);
            return await this.SaveChangesAsync();
        }
    }
}
