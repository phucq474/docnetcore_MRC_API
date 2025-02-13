using Microsoft.EntityFrameworkCore;
using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IMasterListDataService
    {
        List<MasterListDataEntity> GetList(int accountId);
        List<BankEntity> BankGetList();
        Task<List<CompetitorEntity>> GetCompetitor(int accountId);
        List<MasterListDataEntity> GetFilterMaster(string listCode, string name, int accountId);
        Task<DataTable> Filter(int accountId, string jsonData);
        Task<DataTable> GetListCode(int accountId);
        Task<DataTable> GetName(int accountId);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataTable> Delete(int accountId, string jsonData);
    }   
    public class MasterListDataService : IMasterListDataService
    {
        private readonly MasterListDataContext _context;
        public MasterListDataService(MasterListDataContext context)
        {
            _context = context;
        }

        public List<BankEntity> BankGetList()
        {
            var data = _context.BanksGetList();
            if (data != null)
                return data.ToList();
            else
                return new List<BankEntity>();
        }

        public async Task<List<CompetitorEntity>> GetCompetitor(int accountId)
        {
            return await _context.Competitors.OrderBy(o => o.Order).ToListAsync();
        }

        public List<MasterListDataEntity> GetList(int accountId)
        {
            return _context.MasterListDatas.Where(p => p.AccountId == accountId).ToList();
        }
        public List<MasterListDataEntity> GetFilterMaster(string listCode, string name, int accountId)
        {
            if (listCode == null && name == null)
            {
                return _context.MasterListDatas.Where(p =>p.AccountId == accountId).ToList();
            }
            return _context.MasterListDatas.Where(p => p.ListCode == listCode && p.AccountId == accountId).ToList();
        }
        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await _context.Filter(accountId, jsonData);
        }
        public async Task<DataTable> GetListCode(int accountId)
        {
            return await _context.GetListCode(accountId);
        }
        public async Task<DataTable> GetName(int accountId)
        {
            return await _context.GetName(accountId);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataTable> Delete(int accountId, string jsonData)
        {
            return await _context.Delete(accountId, jsonData);
        }
    }
}
