using System;
using System.Data;
using System.Threading.Tasks;
using SpiralData;

namespace SpiralService
{
    public interface IQCService
    {
        Task<DataTable> GetDynamic(int AccountId, int userId, string jsonData);
        Task<DataTable> GetDetail(int AccountId, int userId, string jsonData);
        Task<DataTable> GetByKPI(int AccountId, int userId, string jsonData);
        Task<int> Detail_Update(int AccountId, int userId, string jsonData);
        Task<DataSet> Report_Rawdata(int AccountId, int userId, string jsonData);
        Task<DataTable> Report_OSA(int AccountId, int userId, string jsonData);
    }
    public class QCService : IQCService
    {
        private readonly QCContext _context;
        public QCService(QCContext context)
        {
            _context = context;
        }

        public async Task<DataTable> GetDynamic(int AccountId, int userId, string jsonData)
        {
            return await _context.GetDynamic(AccountId, userId, jsonData);
        }
        public async Task<DataTable> GetDetail(int AccountId, int userId, string jsonData)
        {
            return await _context.GetDetail(AccountId, userId, jsonData);
        }
        public async Task<DataTable> GetByKPI(int AccountId, int userId, string jsonData)
        {
            return await _context.GetByKPI(AccountId, userId, jsonData);
        }
        public async Task<int> Detail_Update(int AccountId, int userId, string jsonData)
        {
            return await _context.Detail_Update(AccountId, userId, jsonData);
        }
        public async Task<DataSet> Report_Rawdata(int AccountId, int userId, string jsonData)
        {
            return await _context.Report_Rawdata(AccountId, userId, jsonData);
        }
        public async Task<DataTable> Report_OSA(int AccountId, int userId, string jsonData)
        {
            return await _context.Report_OSA(AccountId, userId, jsonData);
        }
    }
}
