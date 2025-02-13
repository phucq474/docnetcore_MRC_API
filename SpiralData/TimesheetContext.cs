using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class TimesheetContext : DataContext
    {
        public async Task<DataTable> Timesheets_GetList(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.GetList]", AccountId, UserId, Json);
        }
        public async Task<DataTable> Timesheets_GetDetail(int? UserId, string JsonData, int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Timesheets.GetDetail]", UserId, JsonData, accountId);
        }
        public async Task<int> Timesheets_Update(int? AccountId, int? UserId,string JsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Timesheets.Update]", AccountId, UserId, JsonData);
        }
        public async Task<DataTable> Timesheets_Export(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Export]", AccountId, UserId, Json);
        }

        public async Task<DataTable> AttendantReport_ShiftList(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.ShiftList]", accountId);
        }

        public async Task<DataTable> Timesheet_Export_Detail(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.Detail]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Timesheet_Export_ChangePlan(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.ChangePlan]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Timesheet_Export_Total(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.Total]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Timesheet_Export_WorkingPlan(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.WorkingPlan]", accountId, userId, jsonData);
        }

        public async Task<int> Timesheets_Unlock(int userId, int employeeId, int workDate)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Timesheets.Unlock]", userId, employeeId, workDate);
        }

        public async Task<DataTable> GetShiftList(int accountId, int userId, int? employeeId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[ShiftLists.GetListTimeSheet]", accountId, userId, employeeId);
        }

        public async Task<DataTable> Timesheet_Export_ByEmployee(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.ByEmployee]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Timesheet_Export_ByStore(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.ByStore]", accountId, userId, jsonData);
        }
    }
}
