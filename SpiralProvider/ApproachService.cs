using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IApproachService
    {
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<DataTable> GetDetail(int accountId, int id);
        Task<DataTable> Export_Rawdata(int accountId, int userId, string jsonData);
    }
    public class ApproachService : IApproachService
    {
        private readonly ApproachContext _context;
        public ApproachService(ApproachContext context)
        {
            _context = context;
        }


        public async Task<DataTable> Export_Rawdata(int accountId, int userId, string jsonData)
        {
            return await _context.Export_Rawdata(accountId, userId, jsonData);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await _context.Filter(accountId, userId, jsonData);
        }

        public async Task<DataTable> GetDetail(int accountId, int id)
        {
            return await _context.GetDetail(accountId, id);
        }
    }
}
