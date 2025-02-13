using Microsoft.EntityFrameworkCore;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IDocumentService
    {
        Task<List<DocumentModel>> GetList(int AccountId, int FromDate, int? ToDate, int? DocumentType, int UserId);
        Task<int> CreateDoc(int AccountId, string jsonData, string Path, string FileExtend, int LoginId);
        Task<int> RemoveDoc(int accountId, int docId);
        Task<DataTable> Detail(int id);
        Task<DataTable> Delete(int id, string listIndex);
    }
    public class DocumentService : IDocumentService
    {
        private readonly DocumentContext _docContext;
        public DocumentService(DocumentContext docContext)
        {
            this._docContext = docContext;
        }

        public async Task<int> CreateDoc(int AccountId, string jsonData, string Path, string FileExtend, int LoginId)
        {
            return await _docContext.CreateDoc(AccountId, jsonData, Path, FileExtend, LoginId);
        }
        public async Task<List<DocumentModel>> GetList(int AccountId, int FromDate, int? ToDate, int? DocumentType, int UserId)
        {
            var data = await _docContext.GetList(AccountId, FromDate, ToDate, DocumentType, UserId);
            if (data != null)
                return data.ToList();
            else
                return null;
        }
        public async Task<int> RemoveDoc(int accountId, int docId)
        {
            return await _docContext.RemoveDoc(accountId, docId);
        }
        public async Task<DataTable> Detail(int id)
        {
            return await _docContext.Detail(id);
        }
        public async Task<DataTable> Delete(int id, string listIndex)
        {
            return await _docContext.Delete(id, listIndex);
        }
    }
}
