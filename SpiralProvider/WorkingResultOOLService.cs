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
    public interface IWorkingResultOOLService
    {
        Task<DataTable> FilterOOLResult(int AccountId, int UserId, string JsonData);
        Task<DataSet> ExportOOLResult(int AccountId, int UserId, string JsonData);
        Task<DataTable> DetailOOLResult(int EmployeeId, int ShopId, int WorkDate);
    }
    public class WorkingResultOOLService : IWorkingResultOOLService
    {
        private readonly WorkingResultOOLContext _context;
        public WorkingResultOOLService(WorkingResultOOLContext context)
        {
            _context = context;
        }
        public async Task<DataTable> FilterOOLResult(int AccountId, int UserId, string JsonData)
        {
            return await _context.FilterOOLResult(AccountId, UserId, JsonData);
        }
        public async Task<DataSet> ExportOOLResult(int AccountId, int UserId, string JsonData)
        {
            return await _context.ExportOOLResult(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> DetailOOLResult(int EmployeeId, int ShopId, int WorkDate)
        {
            return await _context.DetailOOLResult(EmployeeId, ShopId, WorkDate);
        }
    }
}
