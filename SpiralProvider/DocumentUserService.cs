using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IDocumentUserService
    {
        Task<DataTable> Filter(int userId, string jsonData);
        Task<DataTable> Detail(string jsonData);
        Task<DataTable> Insert(int userId, string jsonData);
        Task<int> Update(string jsonData);
        Task<int> Delete(int employeeId, string listId);
        Task<DataTable> GetDocument(int AccountId, string jsonData);
    }
    public class DocumentUserService : IDocumentUserService
    {
        private readonly DocumentUserContext _context;
        public DocumentUserService(DocumentUserContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int userId, string jsonData)
        {
            return await _context.Filter(userId, jsonData);
        }
        public async Task<DataTable> Detail(string jsonData)
        {
            return await _context.Detail(jsonData);
        }
        public async Task<DataTable> Insert(int userId, string jsonData)
        {
            return await _context.Insert(userId, jsonData);
        }
        public async Task<int> Update(string jsonData)
        {
            return await _context.Update(jsonData);
        }
        public async Task<int> Delete(int employeeId, string listId)
        {
            return await _context.Delete(employeeId, listId);
        }
        public async Task<DataTable> GetDocument(int AccountId, string jsonData)
        {
            return await _context.GetDocument(AccountId, jsonData);
        }
    }
}
