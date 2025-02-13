using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISOSListService
    {
        Task<DataTable> Filter(int accountId, int UserId, string jsonData);
        Task<DataTable> Export(int AccountId, int UserId, string jsonData);
        Task<DataTable> Update(int AccountId, int UserId, string jsonData);
    }
    public class SOSListService : ISOSListService
    {
        private readonly SOSListContext _context;
        public SOSListService(SOSListContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int accountId, int UserId, string jsonData)
        {
            return await _context.Filter(accountId,UserId,jsonData);
        }
        public async Task<DataTable> Export( int AccountId, int UserId, string jsonData)
        {
            return await _context.Export(AccountId, UserId, jsonData);
        }
        public async Task<DataTable> Update(int AccountId, int UserId, string jsonData)
        {
            return await _context.Update(AccountId, UserId, jsonData);
        }
    }
}
