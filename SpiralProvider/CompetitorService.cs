using SpiralData;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ICompetitorService
    {
        Task<DataTable> Filter(int accountId, int? Id);
        Task<DataTable> Insert(int accountId, int userId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataSet> Export_Competitor(int accountId, int? id);
        Task<int> Import_Competitor(int accountId, int userId, string jsonData);
        Task<DataTable> Filter_Competitor_Result(int accountId, int userId, string jsonData);
        Task<DataTable> Export_Competitor_Result(int accountId, int userId, string jsonData);
        Task<DataTable> Detail_Competitor_Result(int employeeId, int shopId, int workDate);
        Task<DataTable> FilterCompeDetail(int accountId, int userId, string jsonData);
        Task<DataTable> InsertCompDetail(int accountId, int userId, int categoryId, string contentName, string contentList, string fromDate, string toDate);
        Task<int> DeleteCompDetail(int accountId, int userId, int id);
        Task<DataTable> GetListCategory(int accountId, int userId);
    }
    public class CompetitorService : ICompetitorService
    {
        private readonly CompetitorContext _context;
        public CompetitorService(CompetitorContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int accountId, int? Id)
        {
            return await _context.Filter(accountId, Id);
        }
        public async Task<DataTable> Insert(int accountId, int userId, string jsonData)
        {
            return await _context.Insert(accountId, userId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataSet> Export_Competitor(int accountId, int? id)
        {
            return await _context.Export_Competitor(accountId, id);
        }
        public async Task<int> Import_Competitor(int accountId, int userId, string jsonData)
        {
            return await _context.Import_Competitor(accountId, userId, jsonData);
        }

        public async Task<DataTable> Filter_Competitor_Result(int accountId, int userId, string jsonData)
        {
            return await _context.Filter_Competitor_Result(accountId, userId, jsonData);
        }

        public async Task<DataTable> Export_Competitor_Result(int accountId, int userId, string jsonData)
        {
            return await _context.Export_Competitor_Result(accountId, userId, jsonData);
        }

        public async Task<DataTable> Detail_Competitor_Result(int employeeId, int shopId, int workDate)
        {
            return await _context.Detail_Competitor_Result(employeeId, shopId, workDate);
        }

        public async Task<DataTable> FilterCompeDetail(int accountId, int userId, string jsonData)
        {
            return await _context.FilterCompeDetail(accountId, userId, jsonData);
        }

        public async Task<DataTable> InsertCompDetail(int accountId, int userId, int categoryId, string contentName, string contentList, string fromDate, string toDate)
        {
            return await _context.InsertCompDetail(accountId, userId, categoryId, contentName, contentList, fromDate, toDate);
        }

        public async Task<int> DeleteCompDetail(int accountId, int userId, int id)
        {
            return await _context.DeleteCompDetail(accountId, userId, id);
        }

        public async Task<DataTable> GetListCategory(int accountId, int userId)
        {
            return await _context.GetListCategory(accountId, userId);
        }
    }
}
