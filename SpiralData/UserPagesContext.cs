using System;
using System.Collections.Generic;
using System.Text;
using SpiralEntity;
using SpiralEntity.Models;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Threading.Tasks;

namespace SpiralData
{
    public class UserPagesContext:DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserPagesEntity>().HasKey("Id");
            modelBuilder.Entity<UserPagesEntity>().ToTable("UserPages");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<int> setPermission(int accountId, string jsonData, int? employeeId, int? position)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[UserPermission.Action]", accountId, jsonData, employeeId, position);
        }
    }
}
