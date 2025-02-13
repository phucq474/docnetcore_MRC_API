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
    public interface IWorkingPlanService
    {
        Task<DataTable> GetList( int? UserId, string JsonData, int AccountId);
        Task<DataTable> GetDetail( int? UserId, string JsonData, int AccountId);
        Task<int> Confirm(int? UserId, string JsonData, int AccountId);
        Task<int> ChangeShift(int? UserId, string JsonData, int AccountId);

        Task<DataSet> WorkingPlan_Filter(int AccountId, int EmployeeId, int? PlanDate, int? CustomerId, string Area, string ProvinceId, string ShopCode);
        Task<IList<ResultModel>> WorkingPlan_Save(int UserId, int AccountId, int EmployeeId, int? PlanDate, int? CustomerId, string Area, string ProvinceId, string ShopCode, string ShopSave);
        Task<DataSet> Export_LichLamViec(int userId, string jsonData, int AccountId);
        Task<DataSet> Template_LLV_PGM(int userId, string jsonData, int AccountId);
        Task<int> Import_LLV_PGM(int userId, string json, int AccountId);
        Task<DataTable> Export_ChangeWP_RawData(int userId, string jsonData, int AccountId);
        Task<int> RemoveChangeShift(int accountId, int userId, string jsonData);

    }
    public class WorkingPlanService : IWorkingPlanService
    {
        private readonly WorkingPlanContext _context;
        public WorkingPlanService(WorkingPlanContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList( int? UserId, string JsonData, int AccountId)
        {
            return await _context.GetList( UserId, JsonData, AccountId);
        }
        public async Task<DataTable> GetDetail( int? UserId, string JsonData, int AccountId)
        {
            return await _context.GetDetail( UserId, JsonData, AccountId);
        }
        public async Task<int> Confirm(int? UserId, string JsonData, int AccountId)
        {
            return await _context.Confirm(UserId, JsonData, AccountId);
        }
        public async Task<int> ChangeShift(int? UserId, string JsonData, int AccountId)
        {
            return await _context.ChangeShift(UserId, JsonData, AccountId);
        }
        public async Task<DataSet> WorkingPlan_Filter(int AccountId, int EmployeeId, int? PlanDate, int? CustomerId, string Area, string ProvinceId, string ShopCode)
        {
            return await _context.WorkingPlan_Filter(AccountId, EmployeeId, PlanDate, CustomerId, Area, ProvinceId, ShopCode);
        }
        public async Task<IList<ResultModel>> WorkingPlan_Save(int UserId, int AccountId, int EmployeeId, int? PlanDate, int? CustomerId, string Area, string ProvinceId, string ShopCode, string ShopSave)
        {
            return await _context.WorkingPlan_Save(UserId, AccountId, EmployeeId, PlanDate, CustomerId, Area, ProvinceId, ShopCode, ShopSave);
        }
        public async Task<DataSet> Export_LichLamViec(int userId, string jsonData, int AccountId)
        {
            return await _context.Export_LichLamViec(userId, jsonData, AccountId);
        }
        public async Task<DataSet> Template_LLV_PGM(int userId, string jsonData, int AccountId)
        {
            return await _context.Template_LLV_PGM(userId, jsonData, AccountId);
        }
        public async Task<int> Import_LLV_PGM(int userId, string json, int AccountId)
        {
            return await _context.Import_LLV_PGM(userId, json, AccountId);
        }
        public async Task<DataTable> Export_ChangeWP_RawData(int userId, string jsonData, int AccountId)
        {
            return await _context.Export_ChangeWP_RawData(userId, jsonData, AccountId);
        }
        public async Task<int> RemoveChangeShift(int accountId, int userId, string jsonData)
        {
            return await _context.RemoveChangeShift(accountId, userId, jsonData);
        }
    }
        
}
