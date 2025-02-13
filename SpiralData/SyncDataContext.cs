using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SyncDataContext:DataContext
    {

        public async Task<int> WorkingHistory_Import(int UserId,string JsonEmployees, string JsonWorking)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[API.WorkingHistory.Import]", UserId, JsonEmployees, JsonWorking);
        }
        public async Task<int> Record(string Json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[API.MRC.Syns.Record]", Json);
        }
        public async Task<DataTable> STAFF_INFORMATION(string FromDate,string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.STAFF_INFORMATION]", FromDate, ToDate);
        }
        public async Task<DataTable> STORE_LIST(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.STORE_LIST]", FromDate, ToDate);
        }
        public async Task<DataTable> OSA(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.OSA]", FromDate, ToDate);
        }
        public async Task<DataTable> MCP(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.MCP]", FromDate, ToDate);
        }
        public async Task<DataTable> ATTENDANCE(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.ATTENDANCE]", FromDate, ToDate);
        }
        public async Task<DataTable> VISIBILITY(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.VISIBILITY]", FromDate, ToDate);
        }
        public async Task<DataTable> SALESBYMONTH(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.SALESBYMONTH]", FromDate, ToDate);
        }
        public async Task<DataTable> DATEJOIN(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.DATEJOIN]", FromDate, ToDate);
        }
        public async Task<DataTable> WORKING_HISTORY(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MRC.Syns.WORKING_HISTORY]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_ATTENDANCE(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.ATTENDANCE]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_Coverage(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.Coverage]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_Inventory(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.Inventory]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_MCP(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.MCP]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_OSA(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.OSA]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_STAFF_INFORMATION(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.STAFF_INFORMATION]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_STORE_LIST(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.STORE_LIST]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_Visibility(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.Visibility]", FromDate, ToDate);
        }
        public async Task<DataTable> MTDashboard_PlanCall(string FromDate, string ToDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[API.MTDashboard.PlanCall]", FromDate, ToDate);
        }
    }
}
