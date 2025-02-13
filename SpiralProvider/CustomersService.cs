using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ICustomersService
    {
        List<CustomersEntity> GetList(int accountId);
        Task<DataTable> Filter(int AccountId, string JsonData);
        Task<DataTable> Insert(int AccountId, string jsonData);
        Task<DataTable> Update(int AccountId, string jsonData);
        Task<DataSet> Export(int AccountId, string jsonData);
        Task<int> Import(int AccountId, string json);
        Task<DataTable> NewCustomer_Filter(int accountId, int userId, string jsonData);
        Task<DataTable> NewCustomer_Filter_Detail(int accountId, int userId, int id);
        Task<DataTable> NewCustomer_Export(int accountId, int userId, string jsonData);
        Task<DataTable> GetAccountList(int accountId);
    }
    public class CustomersService : ICustomersService
    {
        private readonly CustomersContext _context;
        public CustomersService(CustomersContext context)
        {
            _context = context;
        }
        public List<CustomersEntity> GetList(int accountId)
        {
            return _context.GetList(accountId);
        }
        public async Task<DataTable> Filter(int AccountId, string JsonData)
        {
            return await _context.Filter(AccountId, JsonData);
        }
        public async Task<DataTable> Insert(int AccountId, string jsonData)
        {
            return await _context.Insert(AccountId, jsonData);
        }
        public async Task<DataTable> Update(int AccountId, string jsonData)
        {
            return await _context.Update(AccountId, jsonData);
        }
        public async Task<DataSet> Export(int AccountId, string jsonData)
        {
            return await _context.Export(AccountId, jsonData);
        }

        public async Task<int> Import(int AccountId, string json)
        {
            return await _context.Import(AccountId, json);
        }

        public async Task<DataTable> NewCustomer_Filter(int accountId, int userId, string jsonData)
        {
            return await _context.NewCustomer_Filter(accountId, userId, jsonData);
        }

        public async Task<DataTable> NewCustomer_Filter_Detail(int accountId, int userId, int id)
        {
            return await _context.NewCustomer_Filter_Detail(accountId, userId, id);
        }

        public async Task<DataTable> NewCustomer_Export(int accountId, int userId, string jsonData)
        {
            return await _context.NewCustomer_Export(accountId, userId, jsonData);
        }

        public async Task<DataTable> GetAccountList(int accountId)
        {
            return await _context.GetAccountList(accountId);
        }
    }
}
