using SpiralEntity;
using System.Collections.Generic;
using SpiralData;
using System.Linq;
using System.Data;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IRegionService
    {
        List<RegionEntity> GetList(int accountId);
        RegionEntity GetByMultiInfo(RegionEntity rg);
        Task<DataTable> GetArea(int accountId);
        Task<int> ImportMaster(int accountId, int userId,string json);
    }
    public class RegionService : IRegionService
    {
        private readonly RegionContext _context;
        public RegionService(RegionContext context)
        {
            _context = context;
        }
        public List<RegionEntity> GetList(int accountId)
        {
            return _context.Region.Where(p => p.AccountId == accountId).ToList();
        }
        public RegionEntity GetByMultiInfo(RegionEntity rg)
        {
            return _context.Region.Where(r => r.AccountId == rg.AccountId).FirstOrDefault();
        }
        public async Task<DataTable> GetArea(int accountId)
        {
            return await _context.GetArea(accountId);
        }

        public async Task<int> ImportMaster(int accountId, int userId, string json)
        {
            return await _context.ImportMaster(accountId, userId, json);
        }
    }
}
