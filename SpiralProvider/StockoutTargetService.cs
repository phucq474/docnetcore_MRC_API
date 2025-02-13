using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IStockoutTargetService
    {
        Task<DataTable> Filter(int accountId, string jsonData);
        Task<DataTable> Detail(int accountId, string jsonData);
        Task<int> Insert(int accountId, int userId, string listCustomer, string listProduct, string fromDate, string toDate);
        Task<int> Update(int accountId, string jsonData);
        Task<int> Delete(string jsonData);
        Task<DataTable> Export(int accountId, string jsonData);
    }
    public class StockoutTargetService : IStockoutTargetService
    {
        private readonly StockoutTargetContext _context;
        public StockoutTargetService(StockoutTargetContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await _context.Filter(accountId, jsonData);
        }
        public async Task<DataTable> Detail(int accountId, string jsonData)
        {
            return await _context.Detail(accountId, jsonData);
        }
        public async Task<int> Insert(int accountId, int userId, string listCustomer, string listProduct, string fromDate, string toDate)
        {
            return await _context.Insert(accountId, userId, listCustomer, listProduct, fromDate, toDate);
        }
        public async Task<int> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }

        public async Task<int> Delete(string jsonData)
        {
            return await _context.Delete(jsonData);
        }
        public async Task<DataTable> Export(int accountId, string jsonData)
        {
            return await _context.Export(accountId, jsonData);
        }
    }
}
