using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISpiralFormStatisticalService
    {
        Task<DataTable> GetList(int AccountId, int? UserId, string Json);
        Task<DataTable> GetById(int AccountId, int? UserId, string Json);
        Task<DataTable> GetByQuestion(int AccountId, int? UserId, string Json);
    }
   public class SpiralFormStatisticalService : ISpiralFormStatisticalService
    {
        private readonly SpiralFormStatisticalContext _context;
        public SpiralFormStatisticalService(SpiralFormStatisticalContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int AccountId, int? UserId, string Json)
        {
            return await _context.GetList(AccountId, UserId, Json);
        }
        public async Task<DataTable> GetById(int AccountId, int? UserId, string Json)
        {
            return await _context.GetById(AccountId, UserId, Json);
        }
        public async Task<DataTable> GetByQuestion(int AccountId, int? UserId, string Json)
        {
            return await _context.GetByQuestion(AccountId, UserId, Json);
        }
    }
}
