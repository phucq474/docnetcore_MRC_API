using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IPromotionListService
    {
        Task<DataTable> Filter(int accountId, string jsonData);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataTable> Delete(int id);
        Task<DataSet> Export_PromotionList(int accountId, string jsonData);
        Task<int> Import(int accountId, string json);
        Task<DataTable> GetDivisionList(int accountId);
        Task<DataTable> GetListPromotionType(int accountId);
    }
    public class PromotionListService : IPromotionListService
    {
        private readonly PromotionListContext _context;
        public PromotionListService(PromotionListContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await _context.Filter(accountId, jsonData);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataTable> Delete(int id)
        {
            return await _context.Delete(id);
        }

        public async Task<DataSet> Export_PromotionList(int accountId, string jsonData)
        {
            return await _context.Export_PromotionList(accountId, jsonData);
        }
        public async Task<int> Import(int accountId, string json)
        {
            return await _context.Import(accountId, json);
        }

        public async Task<DataTable> GetDivisionList(int accountId)
        {
            return await _context.GetDivisionList(accountId);
        }

        public async Task<DataTable> GetListPromotionType(int accountId)
        {
            return await _context.GetListPromotionType(accountId);
        }
    }
}
