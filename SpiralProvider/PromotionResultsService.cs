using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IPromotionResultsService
    {
        Task<DataTable> GetList(int AccountId, int UserId, string JsonData);
        Task<DataTable> GetDetail(int ShopId, int EmployeeId, int WorkDate);
        Task<DataTable> ExportRawdata(int userId, string jsonData);
    }
    public class PromotionResultsService: IPromotionResultsService
    {
        private readonly PromotionResultsContext _context;
        public PromotionResultsService(PromotionResultsContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int AccountId, int UserId, string Json)
        {
            return await _context.GetList(AccountId, UserId, Json);
        }
        public async Task<DataTable> GetDetail(int ShopId, int EmployeeId, int WorkDate)
        {
            return await _context.GetDetail( ShopId, EmployeeId, WorkDate);
        }
        public async Task<DataTable> ExportRawdata(int userId, string jsonData)
        {
            return await _context.ExportRawdata(userId, jsonData);
        }
    }
}
