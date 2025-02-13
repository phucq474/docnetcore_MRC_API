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
    public interface IEmployeeStoreService
    {
        Task<DataSet> EmployeeStore_Filter(int AccountId, int UserId, int EmployeeId, int? CustomerId, string Area, string ProvinceId, string ShopCodes);

        Task<int> EmployeeStore_Save(int AccountId, int UserId, int EmployeeId, string ShopSave, string ShopCode);
        Task<DataSet> GetTempStorePermissionImport(int AccountId, int UserId, string Json);
        Task<DataTable> EmployeeStore_EditDate(int Id, int AccountId, int EmployeeId, int ShopId, int FromDate, int? ToDate);
        Task<int> EmployeeShop_Import(DataTable tbl, int AccountId, int UserId);
        bool CheckShop(int EmployeeId, int ShopId);
    }
    public class EmployeeStoreService : IEmployeeStoreService
    {
        private readonly EmployeeStoreContext _context;
        public EmployeeStoreService(EmployeeStoreContext context)
        {
            _context = context;
        }
        public async Task<DataSet> EmployeeStore_Filter(int AccountId, int UserId, int EmployeeId, int? CustomerId, string Area, string ProvinceId, string ShopCodes)
        {
            return await _context.EmployeeStore_Filter(AccountId, UserId, EmployeeId, CustomerId, Area, ProvinceId, ShopCodes);
        }
        public async Task<int> EmployeeStore_Save(int AccountId, int UserId, int EmployeeId, string ShopSave, string ShopCode)
        {
            return await _context.EmployeeStore_Save(AccountId, UserId, EmployeeId, ShopSave, ShopCode);
        }
        public async Task<DataSet> GetTempStorePermissionImport(int AccountId, int UserId, string Json)
        {
            return await _context.GetTempStorePermissionImport( AccountId, UserId, Json);
        }
        public async Task<DataTable> EmployeeStore_EditDate(int Id, int AccountId, int EmployeeId, int ShopId, int FromDate, int? ToDate)
        {
            return await _context.EmployeeStore_EditDate(Id, AccountId, EmployeeId, ShopId, FromDate, ToDate);
        }
        public async Task<int> EmployeeShop_Import(DataTable tbl, int AccountId, int UserId)
        {
            return await _context.EmployeeShop_Import( tbl, AccountId, UserId);
        }
        public bool CheckShop(int EmployeeId, int ShopId)
        {
            List<EmployeeShopsEntity> data = _context.EmployeeShops.Where(e => e.EmployeeId == EmployeeId && e.Status == 1 && e.ShopId == ShopId).ToList();
            if(data.Count > 0)
            {
                return true;
            }
            return false;
        }
    }
}
