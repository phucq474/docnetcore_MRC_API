using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISyncDataService
    {
        Task<int> WorkingHistory_Import(int UserId, string JsonEmployees, string JsonWorking);
        Task<int> Record(string Json);
        Task<DataTable> STAFF_INFORMATION(string FromDate, string ToDate);
        Task<DataTable> OSA(string FromDate, string ToDate);
        Task<DataTable> STORE_LIST(string FromDate, string ToDate);
        Task<DataTable> VISIBILITY(string FromDate, string ToDate);
        Task<DataTable> MCP(string FromDate, string ToDate);
        Task<DataTable> ATTENDANCE(string FromDate, string ToDate);
        Task<DataTable> SALESBYMONTH(string FromDate, string ToDate);
        Task<DataTable> DATEJOIN(string FromDate, string ToDate);
        Task<DataTable> WORKING_HISTORY(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_ATTENDANCE(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_Coverage(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_Inventory(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_MCP(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_OSA(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_STAFF_INFORMATION(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_STORE_LIST(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_Visibility(string FromDate, string ToDate);
        Task<DataTable> MTDashboard_PlanCall(string FromDate, string ToDate);

    }
    public class SyncDataService : ISyncDataService
    {
        private readonly SyncDataContext _context;
        public SyncDataService(SyncDataContext context)
        {
            _context = context;
        }
        public async Task<int> WorkingHistory_Import( int UserId, string JsonEmployees, string JsonWorking)
        {
            return await _context.WorkingHistory_Import(UserId, JsonEmployees, JsonWorking);
        }
        public async Task<int> Record(string Json)
        {
            return await _context.Record(Json);
        }
        public async Task<DataTable> STAFF_INFORMATION(string FromDate, string ToDate)
        {
            return await _context.STAFF_INFORMATION(FromDate, ToDate);
        }
        public async Task<DataTable> STORE_LIST(string FromDate, string ToDate)
        {
            return await _context.STORE_LIST(FromDate, ToDate);
        }
        public async Task<DataTable> OSA(string FromDate, string ToDate)
        {
            return await _context.OSA(FromDate, ToDate);
        }
        public async Task<DataTable> VISIBILITY(string FromDate, string ToDate)
        {
            return await _context.VISIBILITY(FromDate, ToDate);
        }
        public async Task<DataTable> MCP(string FromDate, string ToDate)
        {
            return await _context.MCP(FromDate, ToDate);
        }
        public async Task<DataTable> ATTENDANCE(string FromDate, string ToDate)
        {
            return await _context.ATTENDANCE(FromDate, ToDate);
        }
        public async Task<DataTable> SALESBYMONTH(string FromDate, string ToDate)
        {
            return await _context.SALESBYMONTH(FromDate, ToDate);
        }
        public async Task<DataTable> DATEJOIN(string FromDate, string ToDate)
        {
            return await _context.DATEJOIN(FromDate, ToDate);
        }
        public async Task<DataTable> WORKING_HISTORY(string FromDate, string ToDate)
        {
            return await _context.WORKING_HISTORY(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_ATTENDANCE(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_ATTENDANCE(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_Coverage(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_Coverage(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_Inventory(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_Inventory(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_MCP(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_MCP(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_OSA(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_OSA(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_STAFF_INFORMATION(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_STAFF_INFORMATION(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_STORE_LIST(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_STORE_LIST(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_Visibility(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_Visibility(FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_PlanCall(string FromDate, string ToDate)
        {
            return await _context.MTDashboard_PlanCall(FromDate, ToDate);
        }
    }
}
