using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IStockOutService
    {
        Task<DataTable> Filter(int AccountId, int userId, string jsonData);
        Task<DataSet> Export(int AccountId, int userId, string jsonData);
        Task<DataTable> Detail(int accountId, string jsonData);
        Task<DataTable> UpdateDetail(int accountId, int userId, string jsonData);
        Task<DataSet> StockOut_GetTemplate(int accountId, int userId, string jsonData);
        Task<int> StockOut_Import(int accountId, int userId, string json);
    }
    public class StockOutService : IStockOutService
    {
        private readonly StockOutContext _context;
        public StockOutService(StockOutContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int AccountId, int userId, string jsonData)
        {
            return await _context.Filter(AccountId, userId, jsonData);
        }

        public async Task<DataSet> Export(int AccountId, int userId, string jsonData)
        {
            return await _context.Export(AccountId, userId, jsonData);
        }

        public async Task<DataTable> Detail(int AccountId, string jsonData)
        {
            return await _context.Detail(AccountId, jsonData);
        }

        public async Task<DataTable> UpdateDetail(int accountId, int userId, string jsonData)
        {
            return await _context.UpdateDetail(accountId, userId, jsonData);
        }
        public async Task<DataSet> StockOut_GetTemplate(int accountId, int userId, string jsonData)
        {
            return await _context.StockOut_GetTemplate(accountId, userId, jsonData);
        }
        public async Task<int> StockOut_Import(int accountId, int userId, string json)
        {
            return await _context.StockOut_Import(accountId, userId, json);
        }
    }
}
