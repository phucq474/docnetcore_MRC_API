using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SpiralFormResultContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<SpiralFormResultEntity>().HasKey("Id");
            modelBuilder.Entity<SpiralFormResultEntity>().ToTable("SpiralForm.Result");
            base.OnModelCreating(modelBuilder);
        }
        public virtual DbSet<SpiralFormResultEntity> SpiralFormResult { set; get; }
        public async Task<long> InsertResult(SpiralFormResultEntity form)
        {
            SpiralFormResult.Add(form);
            await this.SaveChangesAsync();
            return form.Id;
        }
        public async Task<int> AddressSurvey_Insert(int? AccountId,int? UserId,string FormData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[AddressSurvey.Insert]", AccountId, UserId, FormData);
        }
    }
}
