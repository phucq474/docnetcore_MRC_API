using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IWorkingTaskService
    {
        Task<DataSet> Filter(int accountId, int userId, string jsonData);
        Task<DataTable> GetTask(int userId, string json);
        Task<DataTable> Save(int userId, string json);
        Task<DataTable> Export(int accountId, int userId, string json);
        Task<DataSet> GetDetailByEmployee(int userId, string json);
        Task<DataTable> Coaching_Filter(int accountId, int userId, string jsonData);
        Task<DataSet> Coaching_Detail(int accountId, int userId, string jsonData);
        Task<DataTable> Coaching_Report_Execution(int accountId, int userId, string jsonData);
        Task<DataSet> Coaching_Report_Market_VF(int accountId, int userId, string jsonData);
        Task<DataTable> Coaching_Report_MarketVR(int accountId, int userId, string jsonData);
        Task<DataTable> Coaching_Report_CoachingRecord(int accountId, int userId, string jsonData);
        Task<DataTable> Coaching_Report_MarketRawdata(int accountId, int userId, string jsonData);
        Task<DataTable> Coaching_Report_CoachingRawdata(int accountId, int userId, string jsonData);
        Task<DataSet> Export_Actual_Rawdata(int accountId, int userId, string json);
        Task<DataTable> Coaching_GetList(int accountId);
        Task<DataTable> Coaching_ByEmployee_Filter(int accountId, int userId, string jsonData);
        Task<DataTable> Coaching_ByEmployee_Detail(int accountId, int userId, string jsonData);
    }
    public class WorkingTaskService : IWorkingTaskService
    {
        private readonly WorkingTaskContext _context;
        public WorkingTaskService(WorkingTaskContext workingTaskContext)
        {
            _context = workingTaskContext;
        }
        public async Task<DataSet> Filter(int accountId, int userId, string jsonData)
        {
            return await this._context.Filter(accountId, userId, jsonData);
        }
        public async Task<DataTable> GetTask(int userId, string json)
        {
            return await this._context.GetTask(userId, json);
        }
        public async Task<DataTable> Save(int userId, string json)
        {
            return await this._context.Save(userId, json);
        }
        public async Task<DataTable> Export(int accountId, int userId, string json)
        {
            return await this._context.Export(accountId, userId, json);
        }
        public async Task<DataSet> GetDetailByEmployee(int userId, string json)
        {
            return await this._context.GetDetailByEmployee(userId, json);
        }
        public async Task<DataTable> Coaching_Filter(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Filter(accountId, userId, jsonData);
        }
        public async Task<DataSet> Coaching_Detail(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Detail(accountId, userId, jsonData);
        }
        public async Task<DataTable> Coaching_Report_Execution(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Report_Execution(accountId, userId, jsonData);
        }
        public async Task<DataSet> Coaching_Report_Market_VF(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Report_Market_VF(accountId, userId, jsonData);
        }
        public async Task<DataTable> Coaching_Report_MarketVR(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Report_MarketVR(accountId, userId, jsonData);
        }
        public async Task<DataTable> Coaching_Report_CoachingRecord(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Report_CoachingRecord(accountId, userId, jsonData);
        }
        public async Task<DataTable> Coaching_Report_MarketRawdata(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Report_MarketRawdata(accountId, userId, jsonData);
        }
        public async Task<DataTable> Coaching_Report_CoachingRawdata(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_Report_CoachingRawdata(accountId, userId, jsonData);
        }
        public async Task<DataSet> Export_Actual_Rawdata(int accountId, int userId, string json)
        {
            return await this._context.Export_Actual_Rawdata(accountId, userId, json);
        }
        public async Task<DataTable> Coaching_GetList(int accountId)
        {
            return await this._context.Coaching_GetList(accountId);
        }
        public async Task<DataTable> Coaching_ByEmployee_Filter(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_ByEmployee_Filter(accountId, userId, jsonData);
        }
        public async Task<DataTable> Coaching_ByEmployee_Detail(int accountId, int userId, string jsonData)
        {
            return await this._context.Coaching_ByEmployee_Detail(accountId, userId, jsonData);
        }
    }
}

