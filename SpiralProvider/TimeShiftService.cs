using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ITimeShiftService
    {
        Task<DataTable> Filter(int accountId, int userId, int? fromDate, int? toDate, int? dealerId, string shopCode, int? categoryId);
        Task<DataTable> Update(int id, int? categoryId, int? toDate, string fromTo, string shift);
        Task<DataTable> Insert(int shopId, int? categoryId, int fromDate_int, int? toDate_int, string shift, string from, string to, string from1, string to1);
        Task<DataTable> CheckEndTime(int accountId, int shopId, int? categoryId, int fromDate_int, string shift);
        Task<DataTable> ShiftLists(int accountId);
        Task<DataTable> Export(int accountId, int userId, int? fromDate, int? toDate, int? dealerId, string shopCode, int? categoryId);
        Task<int> Import(int accountId, DataTable dataImport);
        Task<int> Delete(int timeShiftId, int userId);
        Task<DataTable> TmpImport(int accountId, int? fromDate, string shopCode);
    }
    public class TimeShiftService : ITimeShiftService
    {
        private readonly TimeShiftContext _context;
        public TimeShiftService(TimeShiftContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int accountId, int userId, int? fromDate, int? toDate, int? dealerId, string shopCode, int? categoryId)
        {
            return await _context.Filter(accountId, userId, fromDate, toDate, dealerId, shopCode, categoryId);
        }
        public async Task<DataTable> Update(int id, int? categoryId, int? toDate, string fromTo, string shift)
        {
            return await _context.Update(id, categoryId, toDate, fromTo, shift);
        }
        public async Task<DataTable> Insert(int shopId, int? categoryId, int fromDate_int, int? toDate_int, string shift, string from, string to, string from1, string to1)
        {
            return await _context.Insert(shopId, categoryId, fromDate_int, toDate_int, shift, from, to, from1, to1);
        }
        public async Task<DataTable> CheckEndTime(int accountId, int shopId, int? categoryId, int fromDate_int, string shift)
        {
            return await _context.CheckEndTime(accountId, shopId, categoryId, fromDate_int, shift);
        }
        public async Task<DataTable> ShiftLists(int accountId)
        {
            return await _context.ShiftList(accountId);
        }
        public async Task<DataTable> Export(int accountId, int userId, int? fromDate, int? toDate, int? dealerId, string shopCode, int? categoryId)
        {
            return await _context.Export(accountId, userId, fromDate, toDate, dealerId, shopCode, categoryId);
        }
        public async Task<int> Import(int accountId, DataTable dataImport)
        {
            return await _context.Import(accountId, dataImport);
        }
        public async Task<int> Delete(int timeShiftId, int userId)
        {
            return await _context.Delete(timeShiftId, userId);
        }
        public async Task<DataTable> TmpImport(int accountId, int? fromDate, string shopCode)
        {
            return await _context.TmpImport(accountId, fromDate, shopCode);
        }
    
    }
}
