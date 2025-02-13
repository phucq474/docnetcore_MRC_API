using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISellInIMVService
    {
        Task<DataTable> GetList(int AccountId, int UserId, string JsonData);
        Task<int> Import(int AccountId, int UserId, string JsonActual, string JsonTarget);
        Task<DataSet> Export(int AccountId, int UserId, string JsonData);
        Task<DataSet> GetTemplate(int AccountId, int UserId, string JsonData);
    }
    public class SellInIMVService : ISellInIMVService
    {
        private readonly SellInIMVContext _context;
        public SellInIMVService(SellInIMVContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int AccountId, int UserId, string JsonData)
        {
            return await _context.GetList(AccountId, UserId, JsonData);
        }
        public async Task<int> Import(int AccountId, int UserId, string JsonActual, string JsonTarget)
        {
            return await _context.Import(AccountId, UserId, JsonActual, JsonTarget);
        }
        public async Task<DataSet> Export(int AccountId, int UserId, string JsonData)
        {
            return await _context.Export(AccountId, UserId, JsonData);
        }
        public async Task<DataSet> GetTemplate(int AccountId, int UserId, string JsonData)
        {
            return await _context.GetTemplate(AccountId, UserId, JsonData);
        }
    }
}
