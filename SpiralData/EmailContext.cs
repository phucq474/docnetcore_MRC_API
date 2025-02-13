using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class EmailContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<EmailContentsEntity>().HasKey("Id");
            modelBuilder.Entity<EmailContentsEntity>().ToTable("V2.EmailContent");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<int> CreateAutomail(int? year, int? month, int userId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.CreateEmail.AuditDone]", year, month, userId);
        }
        public async Task<IList<EmailModel>> GetList(int year, int month, int? srId, string mailType, int? sendStatus, int userId)
        {
            return await this.SqlRawAsync<EmailModel>("[dbo].[V2.Email.GetList]", year, month, srId, mailType, sendStatus, userId);
        }

        public async Task<int> Sended(int year, int month, string successlist)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.CreateEmail.Sended]", year, month, successlist);
        }

        public async Task<int> CreateAutomailQC(int? year, int? month, int userId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.Create.Email.DoneQC]", year, month, userId);
        }

        public async Task<int> Removemail(int id, int userId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.RemoveMail]", id, userId);
        }
    }
}
