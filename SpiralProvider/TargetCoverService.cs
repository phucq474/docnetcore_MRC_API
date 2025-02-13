using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ITargetCoverService
    {
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string json);
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<int> Delete(int accountId, int userId, int idDelete);
        Task<int> Update(int accountId, int userId, string jsonData);
    }
    public class TargetCoverService : ITargetCoverService
    {
        private TargetCoverContext _context;
        public TargetCoverService(TargetCoverContext context)
        {
            _context = context;
        }

        public async Task<int> Delete(int accountId, int userId, int idDelete)
        {
            return await _context.Delete(accountId, userId, idDelete);
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

        public async Task<int> Update(int accountId, int userId, string jsonData)
        {
            return await _context.Update(accountId, userId, jsonData);
        }
    }
}
