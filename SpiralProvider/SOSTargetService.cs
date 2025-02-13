using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISOSTargetService
    {
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string json);
    }
    public class SOSTargetService : ISOSTargetService
    {
        private readonly SOSTargetContext _context;
        public SOSTargetService(SOSTargetContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await _context.Filter(accountId, userId, jsonData);
        }
        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await _context.Export(accountId, userId, jsonData);
        }
        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await _context.Import(accountId, userId, json);
        }
    }
}
