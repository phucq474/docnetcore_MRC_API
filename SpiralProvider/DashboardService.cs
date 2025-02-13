using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using SpiralData;
using SpiralEntity.Models;

namespace SpiralService
{

    public interface IDashboardService
    {
        Task<List<DashboardModel>> SellOutSummary(int accountId, string data, int employeeId);
        Task<DataTable> Attendant_Byday(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_ByLeader(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_ToanQuoc(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_Area(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_ByLeaderV2(int accountId, int userId, string jsonData);
        Task<DataSet> Status_Area(int accountId, int userId, string jsonData);
        Task<DataSet> Status_Leader(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_Visit_ST(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_Visit_CHTL(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_Status_CHTL(int accountId, int userId, string jsonData);
        Task<DataSet> Attendant_Status_ST(int accountId, int userId, string jsonData);
        Task<DataSet> OSA(int accountId, int userId, string jsonData);
        Task<DataSet> SOS(int accountId, int userId, string jsonData);
        Task<DataSet> SellOut_MT(int accountId, int userId, string jsonData);
        Task<DataSet> AlphaSellArea(int accountId, int employeeId, string jsonData);
    }
    public class DashboardService:IDashboardService
    {
        private readonly DashboardContext _context;
        public DashboardService(DashboardContext context)
        {
            _context = context;
        }
        public async Task<List<DashboardModel>> SellOutSummary(int accountId, string data, int employeeId)
        {
           var results= await _context.SellOutSummary(accountId, data, employeeId);
            if (results != null)
                return results.ToList();
            else
                return null;
        }

        public async Task<DataTable> Attendant_Byday(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_Byday(accountId, userId, jsonData);
        }
        public async Task<DataSet> Attendant_ByLeader(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_ByLeader(accountId, userId, jsonData);
        }
        public async Task<DataSet> Attendant_ToanQuoc(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_ToanQuoc(accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Area(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_Area(accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_ByLeaderV2(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_ByLeaderV2(accountId, userId, jsonData);
        }

        public async Task<DataSet> Status_Area(int accountId, int userId, string jsonData)
        {
            return await _context.Status_Area(accountId, userId, jsonData);
        }

        public async Task<DataSet> Status_Leader(int accountId, int userId, string jsonData)
        {
            return await _context.Status_Leader(accountId, userId, jsonData);
        }
        public async Task<DataSet> Attendant_Visit_ST(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_Visit_ST(accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Visit_CHTL(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_Visit_CHTL(accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Status_CHTL(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_Status_CHTL(accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Status_ST(int accountId, int userId, string jsonData)
        {
            return await _context.Attendant_Status_ST(accountId, userId, jsonData);
        }

        public async Task<DataSet> OSA(int accountId, int userId, string jsonData)
        {
            return await _context.OSA(accountId, userId, jsonData);
        }

        public async Task<DataSet> SOS(int accountId, int userId, string jsonData)
        {
            return await _context.SOS(accountId, userId, jsonData);
        }
        public async Task<DataSet> SellOut_MT(int accountId, int userId, string jsonData)
        {
            return await _context.SellOut_MT(accountId, userId, jsonData);
        }
        #region sellAlPha
        public async Task<DataSet> AlphaSellArea(int accountId, int employeeId, string jsonData)
        {
            return await _context.AlphaSellArea(accountId, employeeId, jsonData);
        }
        #endregion
    }
}
