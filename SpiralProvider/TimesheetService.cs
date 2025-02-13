using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ITimesheetService
    {
        Task<int> Timesheets_Update(int? AccountId, int? UserId, string JsonData);
        Task<DataTable> Timesheets_GetDetail(int? UserId, string JsonData, int accountId);
        Task<DataTable> Timesheets_GetList(int AccountId, int UserId, string JsonData);
        Task<DataTable> Timesheet_Export(int accountId, int userId, string jsonData);
        Task<DataTable> AttendantReport_ShiftList(int accountId);
        Task<DataTable> Timesheet_Export_Detail(int accountId, int userId, string jsonData);
        Task<DataTable> Timesheet_Export_ChangePlan(int accountId, int userId, string jsonData);
        Task<DataTable> Timesheet_Export_Total(int accountId, int userId, string jsonData);
        Task<DataTable> Timesheet_Export_WorkingPlan(int accountId, int userId, string jsonData);
        Task<int> Timesheets_Unlock(int userId, int employeeId, int workDate);
        Task<DataTable> GetShiftList(int accountId, int userId, int? employeeId);
        Task<DataTable> Timesheet_Export_ByEmployee(int accountId, int userId, string jsonData);
        Task<DataTable> Timesheet_Export_ByStore(int accountId, int userId, string jsonData);
    }
    public class TimesheetService : ITimesheetService
    {
        private readonly TimesheetContext _context;
        public TimesheetService(TimesheetContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Timesheets_GetList(int AccountId, int UserId, string JsonData)
        {
            return await _context.Timesheets_GetList(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> Timesheets_GetDetail(int? UserId, string JsonData, int accountId)
        {
            return await _context.Timesheets_GetDetail( UserId, JsonData, accountId);
        }
        public async Task<int> Timesheets_Update(int? AccountId, int? UserId, string JsonData)
        {
            return await _context.Timesheets_Update(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> Timesheet_Export(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheets_Export(accountId, userId, jsonData);
        }
        public async Task<DataTable> AttendantReport_ShiftList(int accountId)
        {
            return await _context.AttendantReport_ShiftList(accountId);
        }
        public async Task<DataTable> Timesheet_Export_Detail(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_Detail(accountId, userId, jsonData);
        }
        public async Task<DataTable> Timesheet_Export_ChangePlan(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_ChangePlan(accountId, userId, jsonData);
        }
        public async Task<DataTable> Timesheet_Export_Total(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_Total(accountId, userId, jsonData);
        }
        public async Task<DataTable> Timesheet_Export_WorkingPlan(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_WorkingPlan(accountId, userId, jsonData);
        }
        public async Task<int> Timesheets_Unlock(int userId, int employeeId, int workDate)
        {
            return await _context.Timesheets_Unlock(userId, employeeId, workDate);
        }
        public async Task<DataTable> GetShiftList(int accountId, int userId, int? employeeId)
        {
            return await _context.GetShiftList(accountId, userId, employeeId);
        }
        public async Task<DataTable> Timesheet_Export_ByEmployee(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_ByEmployee(accountId, userId, jsonData);
        }
        public async Task<DataTable> Timesheet_Export_ByStore(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_ByStore(accountId, userId, jsonData);
        }
    }
}
