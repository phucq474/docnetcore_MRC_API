using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISellInService
    {
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<DataTable> GetDetail(int accountId, int userId, int id);
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string json);
    }
    public class SellInService : ISellInService
    {
        private readonly SellInContext _context;
        public SellInService(SellInContext context)
        {
            _context = context;
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await _context.Export(accountId, userId, jsonData);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await _context.Filter(accountId, userId, jsonData);
        }

        public async Task<DataTable> GetDetail(int accountId, int userId, int id)
        {
            return await _context.GetDetail(accountId, userId, id);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await _context.Import(accountId, userId, json);
        }

    }
}
