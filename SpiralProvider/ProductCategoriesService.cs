using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IProductCategoriesService
    {
        List<ProductCategoriesEntity> GetList(int accountId);
        Task<DataTable> Filter(int AccountId,string jsonData);
        Task<DataTable> Export(int AccountId, string jsonData);
        Task<int> Import(int AccountId, string jsondata);
    }
    public class ProductCategoriesService : IProductCategoriesService
    {
        private readonly ProductCategoriesContext _context;
        public ProductCategoriesService(ProductCategoriesContext context)
        {
            _context = context;
        }
        public List<ProductCategoriesEntity> GetList(int accountId)
        {
            return _context.GetList(accountId);
        }
        
        public async Task<DataTable> Filter(int AccountId, string jsonData)
        {
            return await _context.Filter(AccountId, jsonData);
        }

        public async Task<DataTable> Export(int AccountId, string jsonData)
        {
            return await _context.Export(AccountId, jsonData);
        }
        public async Task<int> Import(int AccountId, string jsondata)
        {
            return await _context.Import(AccountId, jsondata);
        }
    }
}
