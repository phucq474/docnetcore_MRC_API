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
    public interface IShiftListService
    {
        List<ShiftListEntity> GetList(int accountId);
        Task<DataTable> GetShiftGroup(int accountId);
        Task<DataTable> Filter(int accountId, string jsonData);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataTable> Export(int accountId, string jsonData);
        Task<int> Import(int accountId, string jsondata);
        bool CheckShift(int AccountId, string ShiftCode, string ShiftGroup = null);
    }
    public class ShiftListService : IShiftListService
    {
        private readonly ShiftListContext _context;
        public ShiftListService(ShiftListContext context)
        {
            _context = context;
        }
        public List<ShiftListEntity> GetList(int accountId)
        {
            return _context.ShiftLists.Where(p => p.Status==1 && p.AccountId == accountId).ToList();
        }
        public async Task<DataTable> GetShiftGroup(int accountId)
        {
            return await _context.GetShiftGroup(accountId);
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
        public async Task<DataTable> Export(int accountId, string jsonData)
        {
            return await _context.Export(accountId, jsonData);
        }
        public async Task<int> Import(int accountId, string jsondata)
        {
            return await _context.Import(accountId, jsondata);
        }
        public bool CheckShift(int AccountId, string ShiftCode, string ShiftGroup = null)
        {
            var data = _context.ShiftLists.Where(s => s.ShiftCode == ShiftCode && (ShiftGroup == null || s.ShiftGroup == ShiftGroup) && s.AccountId == AccountId).FirstOrDefault();
            if(data != null)
            {
                return true;
            }
            return false;
        }
    }
}
