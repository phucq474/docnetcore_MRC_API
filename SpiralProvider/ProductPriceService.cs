using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IProductPriceService
    {
        Task<DataTable> Filter(string JsonData, int accountId);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataTable> Delete(int id);
        Task<DataTable> Save(string Action, string JsonData, int accountId);
        Task<DataSet> Export(int accountId, string jsonData);
        Task<int> Import(int accountId, string json);
    }
    public class ProductPriceService : IProductPriceService
    {
        private readonly ProductPriceContext _context;
        public ProductPriceService(ProductPriceContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(string JsonData ,int accountId)
        {
            return await _context.Filter(JsonData, accountId);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataTable> Delete(int id)
        {
            return await _context.Delete(id);
        }
        public async Task<DataTable> Save(string Action, string JsonData, int accountId)
        {
            return await _context.Save(Action, JsonData, accountId);
        }
        public async Task<DataSet> Export(int accountId, string jsonData)
        {
            return await _context.Export(accountId, jsonData);
        }
        public async Task<int> Import(int accountId, string json)
        {
            return await _context.Import(accountId, json);
        }

    }
}
