using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;

namespace SpiralService
{
    public interface IMobileService
    {
        Task<List<CalendarModel>> getWeekByYear();
        Task<List<ShiftListModel>> getShiftType(string json);
        Task<List<WorkingPlanEntity>> getPlanByWeek(string data, int week);
        Task<int> CopyPlanByWeek(string data, int week);
        Task<int> SavePlan(string data, int week, string planChange);
        Task<List<AlertEntity>> setChangeShift(string data, int ShopId, int WorkDate, string ShiftCode, string NoteChange);
        Task<List<AlertEntity>> setNoteLate(string data, int ShopId, int WorkDate, int TimeLate, string Note);
        Task<DataTable> GetListRawByReport_Dynamic(int accountId, int userId, string jsonData);
        Task<int> uploadFile(string data, int ShopId, string PhotoPath);
        Task<List<ConfirmWorkingPlanModel>> getConfirmPlan(string data, int week);
        Task<int> ConfirmRejectPlan(int AccountId, int UserId, int ShopId, int EmployeeId, int WorkDate, string Note, int IsConfirmOrReject, int Type);
        Task<List<ShopModel>> GetShopByEmployee(int? AccountId, int? UserId, int? WorkDate, int? Position, string SupId, string EmployeeId, int? DealerId, string Area, string Region, string Province);

        //SellOut
        Task<DataTable> SellOut_GetStoreList(string data);
        Task<DataTable> SellOut_GetProducts(string data);
        Task<DataTable> SellOut_GetDataByShop(string data, int ShopId, string DayView);
        Task<int> SellOut_UpdateOrDelete(string data, long? selloutId, int? quantity);
        Task<DataTable> SSub_GetStoreList(string json);
        Task<DataTable> SSub_GetDisplay(string json);
        Task<DataTable> SSub_Insert(string json);
        Task<DataTable> ExportRawByReport_Dynamic(int accountId, int userId, string jsonData);
        Task<DataTable> UpdateShopByReport(int accountId, int userId, int Id);
    }

    public class MobileService : IMobileService
    {
        public readonly MobileContext mobileContext;

        public MobileService(MobileContext mobileContext)
        {
            this.mobileContext = mobileContext;
        }

        public async Task<List<CalendarModel>> getWeekByYear()
        {
            var data = await mobileContext.getWeekByYear();
            if (data != null)
                return data.ToList();
            return null;
        }

        public async Task<List<WorkingPlanEntity>> getPlanByWeek(string mData, int mWeek)
        {
            var data = await mobileContext.getPlanByWeek(mData, mWeek);
            if (data != null)
                return data.ToList();
            return null;
        }

        public async Task<int> CopyPlanByWeek(string data, int week)
        {
            return await mobileContext.copyPlan(data, week);
        }

        public async Task<int> SavePlan(string data, int week, string planChange)
        {
            return await mobileContext.savePlan(data, week, planChange);
        }

        public async Task<List<ShiftListModel>> getShiftType(string json)
        {
            var data = await mobileContext.getShiftType(json);
            if (data != null)
                return data.ToList();
            return null;
        }

        public async Task<List<AlertEntity>> setChangeShift(string data, int ShopId, int WorkDate, string ShiftCode, string NoteChange)
        {
            var result = await mobileContext.changeShift(data, ShopId, WorkDate, ShiftCode, NoteChange);
            if (result != null)
                return result.ToList();
            return null;
        }

        public async Task<List<AlertEntity>> setNoteLate(string data, int ShopId, int WorkDate, int TimeLate, string Note)
        {
            var result = await mobileContext.noteLate(data, ShopId, WorkDate, TimeLate, Note);
            if (result != null)
                return result.ToList();
            return null;
        }

        public async Task<int> uploadFile(string data, int ShopId, string photoPath)
        {
            return await mobileContext.uploadFile(data, ShopId, photoPath);
        }

        public async Task<List<ConfirmWorkingPlanModel>> getConfirmPlan(string mData, int week)
        {
            var data = await mobileContext.getConfirmPlan(mData, week);
            if (data != null)
                return data.ToList();
            return null;
        }
        public async Task<int> ConfirmRejectPlan(int AccountId, int UserId, int ShopId, int EmployeeId, int WorkDate, string Note, int IsConfirmOrReject, int Type)
        {
            return await mobileContext.ConfirmRejectPlan(AccountId, UserId, ShopId, EmployeeId, WorkDate, Note, IsConfirmOrReject, Type);
        }
        public async Task<List<ShopModel>> GetShopByEmployee(int? AccountId, int? UserId, int? WorkDate, int? Position, string SupId, string EmployeeId, int? DealerId, string Area, string Region, string Province)
        {
            var data = await mobileContext.GetShopByEmployee(AccountId, UserId, WorkDate, Position, SupId, EmployeeId, DealerId, Area, Region, Province);
            if (data != null)
                return (List<ShopModel>)data;
            else
                return null;

        }

        public async Task<DataTable> SellOut_GetStoreList(string data)
        {
            return await mobileContext.SellOut_GetStoreList(data);
        }

        public async Task<DataTable> SellOut_GetProducts(string data)
        {
            return await mobileContext.SellOut_GetProducts(data);
        }

        public async Task<DataTable> SellOut_GetDataByShop(string data, int ShopId, string DayView)
        {
            return await mobileContext.SellOut_GetDataByShop(data, ShopId, DayView);
        }

        public async Task<int> SellOut_UpdateOrDelete(string data, long? selloutId, int? quantity)
        {
            return await mobileContext.SellOut_UpdateOrDelete(data, selloutId, quantity);
        }
        public async Task<DataTable> SSub_GetStoreList(string json)
        {
            return await mobileContext.SSub_GetStoreList(json);
        }
        public async Task<DataTable> SSub_GetDisplay(string json)
        {
            return await mobileContext.SSub_GetDisplay(json);
        }
        public async Task<DataTable> SSub_Insert(string json)
        {
            return await mobileContext.SSub_Insert(json);
        }

        public async Task<DataTable> GetListRawByReport_Dynamic(int accountId, int userId, string jsonData)
        {
            return await mobileContext.GetListRawByReport_Dynamic(accountId, userId, jsonData);
        }

        public async Task<DataTable> ExportRawByReport_Dynamic(int accountId, int userId, string jsonData)
        {
            return await mobileContext.ExportRawByReport_Dynamic(accountId, userId, jsonData);
        }

        public async Task<DataTable> UpdateShopByReport(int accountId, int userId, int Id)
        {
            return await mobileContext.UpdateShopByReport(accountId, userId, Id);
        }
    }
}