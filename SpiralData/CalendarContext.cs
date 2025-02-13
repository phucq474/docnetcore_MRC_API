using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class CalendarContext:DataContext
    {
        public async Task<DataTable> GetCycle(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Calendars.GetByCycle]", accountId);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CalendarEntity>().HasKey("Id");
            modelBuilder.Entity<CalendarEntity>().ToTable("Calendars");
            base.OnModelCreating(modelBuilder);
        }
    }
}
