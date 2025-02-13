using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IOSATargetService
    {
        Task<DataTable> GetDetail(string jsonData);
        Task<DataTable> GetList(int accountId, int userId, string jsonData);
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string jsonData);
        Task<int> Delete(int accountId, int userId, string listId);
    }
    public class OSATargetService : IOSATargetService
    {
        private readonly OSATargetContext _context;
        public OSATargetService(OSATargetContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetDetail( string jsonData)
        {
            return await _context.GetDetail( jsonData);
        }
        public async Task<DataTable> GetList(int accountId,int userId, string jsonData)
        {
            return await _context.GetList(accountId, userId, jsonData);
        }
        public async Task<DataSet> Export(int accountId,int userId, string jsonData)
        {
            return await _context.Export(accountId, userId, jsonData);
        }
        public async Task<int> Import(int accountId,  int userId, string jsonData)
        {
            return await _context.Import(accountId, userId, jsonData);
        }

        public async Task<int> Delete(int accountId, int userId, string listId)
        {
            return await _context.Delete(accountId, userId, listId);
        }
    }
}
