using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISpiralFormResultService
    {
        Task<long> InsertResult(SpiralFormResultEntity form);
        Task<int> AddressSurvey_Insert(int? AccountId, int? UserId, string FormData);
    }
   public class SpiralFormResultService: ISpiralFormResultService
    {
        private readonly SpiralFormResultContext _context;
        public SpiralFormResultService(SpiralFormResultContext context)
        {
            _context = context;
        }
        public async Task<long> InsertResult(SpiralFormResultEntity form)
        {
            return await _context.InsertResult(form);
        }
        public async Task<int> AddressSurvey_Insert(int? AccountId, int? UserId, string FormData)
        {
            return await _context.AddressSurvey_Insert(AccountId, UserId, FormData);
        }
    }
}
