using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class HRContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public async Task<int> ImportData(int accountId, int year, DataTable dtImport, int userId)
        {
            return await this.ExcuteNonQueryAsync("dbo.[HR.ImportRaw]", accountId, year, dtImport, userId);
        }
    }
}
