using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISOSResultService
    {
        Task<DataTable> GetList(int AccountId, int UserId, string JsonData);
        Task<DataSet> Export(int AccountId, int UserId, string JsonData);
        Task<DataTable> GetDetail(string JsonData);
    }
    public class SOSResultService : ISOSResultService
    {
        private readonly SOSResultContext _context;
        public SOSResultService(SOSResultContext context)
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
