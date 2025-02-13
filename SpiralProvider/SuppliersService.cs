using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISuppliersService
    {
        Task<List<SuppliersEntity>> GetList(int accountId);
        Task<DataTable> Filter(int accountId,string jsonData);
        Task<DataTable> Insert(int accountId,string jsonData);
        Task<DataTable> Update(int accountId,string jsonData);
        Task<DataTable> Export(int accountId,string jsonData);
        Task<int> Import(int accountId,string jsondata);
    }
    public class SuppliersService : ISuppliersService
    {
        private SuppliersContext _context;
        public SuppliersService(SuppliersContext context)
        {
            _context = context;
        }
        public Task<List<SuppliersEntity>> GetList(int accountId)
        {
            return _context.GetList(accountId);
        }
        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await _context.Filter(accountId, jsonData);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataTable> Export(int accountId, string jsonData)
        {
            return await _context.Export(accountId, jsonData);
        }
        public async Task<int> Import(int accountId, string jsondata)
        {
            return await _context.Import(accountId, jsondata);
        }
    }
}
