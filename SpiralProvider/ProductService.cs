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
    public interface IProductService
    {
        List<ProductModel> GetList(int AccountId);
        Task<DataTable> Filter(int AccountId, string jsonData);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataSet> Export(int AccountId, string jsonData);
        Task<int> Import(int accountId, string json);
        Task<DataTable> GetListProductType(int accountId);
    }
    public class ProductService : IProductService
    {
        private readonly ProductContext _context;
        public ProductService(ProductContext productContext)
        {
            _context = productContext;
        }
        public List<ProductModel> GetList(int AccountId)
        {
            var data = _context.GetList(AccountId);
            if (data != null)
                return (List<ProductModel>)data;
            else
                return null;
        }
        public async Task<DataTable> Filter(int AccountId, string jsonData)
        {
            return await _context.Filter(AccountId, jsonData);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataSet> Export(int AccountId, string jsonData)
        {
            return await _context.Export(AccountId, jsonData);
        }
        public async Task<int> Import(int accountId, string json)
        {
            return await _context.Import(accountId, json);
        }

        public async Task<DataTable> GetListProductType(int accountId)
        {
            return await _context.GetListProductType(accountId);
        }
    }
}
