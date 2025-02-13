using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class DocumentContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<DocumentsEntity>().HasKey("Id");
            modelBuilder.Entity<DocumentsEntity>().ToTable("Document");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<int> CreateDoc(int AccountId,string jsonData , string Path, string FileExtend, int LoginId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Document.Insert]", AccountId, jsonData, Path, FileExtend, LoginId);
        }   
        public async Task<int> ImportNotify(int AccountId, int Month, int Year, int LoginId, DataTable dt)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Messenger.Import]", AccountId, Month, Year, LoginId, dt);
        }
        public async Task<IList<DocumentModel>> GetList(int AccountId, int FromDate, int? ToDate, int? DocumentType, int UserId)
        {
            return await this.SqlRawAsync<DocumentModel>("dbo.[Document.GetList]", AccountId, FromDate, ToDate, DocumentType, UserId);
        }
        public async Task<int> RemoveNotify(int accountId, string idList, int userId)
        {
            return await Task.Run(() => this.ExcuteNonQuery("dbo.[Notify.Remove]", accountId, idList, userId));
        }

        public async Task<int> RemoveDoc(int accountId, int docId)
        {
            var docItem = await this.Document.FirstOrDefaultAsync(s => s.Id == docId);
            if (docItem != null)
            {
                docItem.IsDelete = 1;
                this.Document.Update(docItem);
                await this.SaveChangesAsync();
            }
            return docId;
        }

        public async Task<DataTable> Delete(int id, string listIndex)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Document.Delete]", id, listIndex);
        }

        public async Task<DataTable> Detail(int id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Document.Detail]", id);
        }

        public async Task<int> UpdateNotify(int accountId, string idList, int userId)
        {
            return await Task.Run(() => this.ExcuteNonQuery("dbo.[Notify.Update]", accountId, idList, userId));
        }

        public async Task<IQueryable<MessengerModel>> GetNotifyGroup(int accountId, int userId)
        {
            var lst = await Task.Run(() => (from g in this.Messengers
                                            where g.AccountId == accountId
                                            select new MessengerModel { TypeReport = g.TypeReport }).Distinct());
            return lst;
        }
    }
}
