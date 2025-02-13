using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class WorkingPhotoContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<WorkingPhotoEntity>().HasKey("Id");
            modelBuilder.Entity<WorkingPhotoEntity>().ToTable("WorkingPhoto");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataTable> GetPhoto(int accountId,string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.WorkingPhoto.GetPhoto]", accountId, jsonData);
        }

        public async Task<DataTable> GetPhotoType(int accountId, int? reportId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Photo.GetPhotoType]", accountId, reportId);
        }

        public async Task<int> DeletePhoto(int userId, int photoId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Photo.Delete]", userId, photoId);
        }

        public async Task<int> Save(int userId, string json, int accountId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Photo.Save]", userId, json, accountId);
        }
    }
}
