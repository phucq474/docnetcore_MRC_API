using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class WorkingTaskContext : DataContext
    {
        public async Task<DataSet> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[WorkingTask.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> GetTask(int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[WorkingTask.GetTask]", userId, json);
        }

        public async Task<DataTable> Save(int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[WorkingTask.Save]", userId, json);
        }

        public async Task<DataTable> Export(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[WorkingTask.Export]", accountId, userId, json);
        }

        public async Task<DataSet> GetDetailByEmployee(int userId, string json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[WorkingTask.GetDetailByEmployee]", userId, json);
        }

        public async Task<DataTable> Coaching_Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.Result.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Coaching_Detail(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Coaching.Result.Detail]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Coaching_Report_Execution(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.Result.Report.Execution]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Coaching_Report_Market_VF(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Coaching.Result.Report.MarketVisitForm]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Coaching_Report_MarketVR(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.Result.Report.MarketVisitRecord]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Coaching_Report_CoachingRecord(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.Result.Report.CoachingRecord]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Coaching_Report_MarketRawdata(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.Result.Report.MarketVisitRawData]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Coaching_Report_CoachingRawdata(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.Result.Report.CoachingRawData]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Export_Actual_Rawdata(int accountId, int userId, string json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[WorkingTask.Actual.Rawdata]", accountId, userId, json);
        }

        public async Task<DataTable> Coaching_GetList(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.GetList]", accountId);
        }

        public async Task<DataTable> Coaching_ByEmployee_Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.ByEmployee.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Coaching_ByEmployee_Detail(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Coaching.ByEmployee.Detail]", accountId, userId, jsonData);
        }
    }
}
