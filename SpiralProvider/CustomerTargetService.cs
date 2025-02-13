using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ICustomerTargetService
    {
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<DataTable> Insert(int accountId, int userId, string jsonData);
        Task<DataTable> Update(int accountId, int userId, string jsonData);
        Task<int> Delete(int accountId, int userId, int id);
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string json);
    }
    public class CustomerTargetService : ICustomerTargetService
    {
        private readonly CustomerTargetContext _context;
        public CustomerTargetService(CustomerTargetContext context)
        {
            _context = context;
        }

        public async Task<int> Delete(int accountId, int userId, int id)
        {
            return await _context.Delete(accountId, userId, id);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await _context.Export(accountId, userId, jsonData);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await _context.Filter(accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await _context.Import(accountId, userId, json);
        }

        public async Task<DataTable> Insert(int accountId, int userId, string jsonData)
        {
            return await _context.Insert(accountId, userId, jsonData);
        }

        public async Task<DataTable> Update(int accountId, int userId, string jsonData)
        {
            return await _context.Update(accountId, userId, jsonData);
        }
    }
}
