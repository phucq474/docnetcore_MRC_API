using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IEmployeePOGService
    {
        Task<int> Delete(int accountId, int userId, string listId);
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string json);
        Task<DataTable> Save(int accountId, int userId, string jsonData);
    }

    public class EmployeePOGService : IEmployeePOGService
    {
        private readonly EmployeePOGContext _context;
        public EmployeePOGService(EmployeePOGContext context)
        {
            _context = context;
        }

        public async Task<int> Delete(int accountId, int userId, string listId)
        {
            return await _context.Delete(accountId, userId, listId);
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

        public async Task<DataTable> Save(int accountId, int userId, string jsonData)
        {
            return await _context.Save(accountId, userId, jsonData);
        }
    }
}
