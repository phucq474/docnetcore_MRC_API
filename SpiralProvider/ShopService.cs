using Microsoft.Extensions.Options;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IShopService
    {
        List<ShopsEntity> GetList(int accountId);
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
        Task<DataSet> Export(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, string json);
        Task<List<ShopDDLModel>> GetShopByEmployee(int? employeeId, string json, int AccountId);
        ShopsEntity GetByShopCode(string ShopCode);
        Task<List<ShopDDLModel>> GetShopByEmployeeForm(int? AccountId, int? UserId, int? WorkDate, int? Position, string SupId, string EmployeeId, int? DealerId, string Area, string Region, string Province);

    }
    public class ShopService : IShopService
    {
        private readonly ShopContext _context;
        public ShopService(ShopContext context)
        {
            _context = context;
        }
        public List<ShopsEntity> GetList(int accountId)
        {
            return _context.GetList(accountId);
        }
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await _context.Filter(accountId, userId, jsonData);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await _context.Export(accountId, userId, jsonData);
        }
        public async Task<int> Import(int accountId, string json)
        {
            return await _context.Import(accountId, json);
        }
        public async Task<List<ShopDDLModel>> GetShopByEmployee(int? employeeId, string json, int AccountId)
        {
            var data = await _context.GetShopByEmployee(employeeId, json, AccountId);
            if (data != null)
                return (List<ShopDDLModel>)data;
            return null;
        }
        public ShopsEntity GetByShopCode(string ShopCode)
        {
            var data = _context.Shops.Where(s => s.ShopCode == ShopCode && s.Status == 1).FirstOrDefault();
            if (data != null)
            {
                return data;
            }
            else return null;
        }
        public async Task<List<ShopDDLModel>> GetShopByEmployeeForm(int? AccountId, int? UserId, int? WorkDate, int? Position, string SupId, string EmployeeId, int? DealerId, string Area, string Region, string Province)
        {
            var data = await _context.GetShopByEmployeeForm(AccountId, UserId, WorkDate, Position, SupId, EmployeeId, DealerId, Area, Region, Province);
            if (data != null)
                return (List<ShopDDLModel>)data;
            else
                return null;
        }
    }
}