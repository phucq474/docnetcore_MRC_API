using SpiralData;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IWorkingPlanDefaultService
    {
        Task<DataTable> Filter(int userId, string jsonData);
        Task<DataTable> Insert(int userId, string jsonData);
        Task<DataTable> Update(string jsonData, string jsonUpdate);
        Task<int> Delete(string id);
        Task<DataTable> Export(int userId, string jsonData);
        Task<DataSet> GetTemplate(int userId, string jsonData);
        Task<DataTable> GetShop(int employeeId, int FromDate);
        Task<int> Import(int userId, string json);
        Task<List<WorkingPlanDefaultModel>> WorkingPlanDefault_GetByEmployeeFromDate(int? emloyeeId, int? dateTime);
     }
    public class WorkingPlanDefaultService : IWorkingPlanDefaultService
    {
        private readonly WorkingPlanDefaultContext _context;
        public WorkingPlanDefaultService(WorkingPlanDefaultContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int userId, string jsonData)
        {
            return await _context.Filter(userId, jsonData);
        }
        public async Task<DataTable> Insert(int userId, string jsonData)
        {
            return await _context.Insert(userId, jsonData);
        }
        public async Task<DataTable> Update(string jsonData, string jsonUpdate)
        {
            return await _context.Update(jsonData, jsonUpdate);
        }
        public async Task<int> Delete(string id)
        {
            return await _context.Delete(id);
        }
        public async Task<DataTable> Export(int userId, string jsonData)
        {
            return await _context.Export(userId, jsonData);
        }
        public async Task<DataSet> GetTemplate(int userId, string jsonData)
        {
            return await _context.GetTemplate(userId, jsonData);
        }
        public async Task<DataTable> GetShop(int employeeId, int FromDate)
        {
            return await _context.GetShop(employeeId, FromDate);
        }
        public async Task<int> Import(int userId, string json)
        {
            return await _context.Import(userId, json);
        }
        public async Task<List<WorkingPlanDefaultModel>> WorkingPlanDefault_GetByEmployeeFromDate(int? emloyeeId, int? dateTime)
        {
            var data = await _context.WorkingPlanDefault_GetByEmployeeFromDate(emloyeeId, dateTime);
            if (data != null)
            {
                return (List<WorkingPlanDefaultModel>)data;
            }
            return null;
        }
    }
}
