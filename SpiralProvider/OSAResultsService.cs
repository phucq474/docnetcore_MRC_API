using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IOSAResultsService
    {
        Task<DataTable> GetList(int AccountId, int UserId, string JsonData);
        Task<DataSet> Export(int AccountId, int UserId, string JsonData);
        Task<DataTable> GetDetail(string JsonData);
    }
    public class OSAResultsService : IOSAResultsService
    {
        private readonly OSAResultsContext _context;
        public OSAResultsService(OSAResultsContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int AccountId, int UserId, string JsonData)
        {
            return await _context.GetList(AccountId, UserId, JsonData);
        }
        public async Task<DataSet> Export(int AccountId, int UserId, string JsonData)
        {
            return await _context.Export(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> GetDetail(string JsonData)
        {
            return await _context.GetDetail(JsonData);
        }

    }
}
