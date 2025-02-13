using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using SpiralEntity;
using SpiralEntity.Models;

namespace SpiralData
{
    public class MobileContext : DataContext
    {
        public async Task<IList<CalendarModel>> getWeekByYear()
        {
            return await this.SqlRawAsync<CalendarModel>("[dbo].[Mobile.getWeekByYear]");
        }
        public async Task<IList<ShiftListModel>> getShiftType(string json)
        {
            return await this.SqlRawAsync<ShiftListModel>("[dbo].[Mobile.getShiftList]", json);
        }
        public async Task<IList<WorkingPlanEntity>> getPlanByWeek(string data, int weekByYear)
        {
            return await this.SqlRawAsync<WorkingPlanEntity>("[dbo].[Mobile.getData.WorkingPlan]", data, weekByYear);
        }
        public async Task<int> copyPlan(string data, int week)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Mobile.WorkingPlan.InsertByWeek]", data, week);
        }
        public async Task<int> savePlan(string data, int week, string planChange)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Mobile.WorkingPlan.SavePlan]", data, week, planChange);
        }
        public async Task<IList<AlertEntity>> changeShift(string data, int ShopId, int WorkDate, string ShiftCode, string NoteChange)
        {
            return await this.SqlRawAsync<AlertEntity>("[dbo].[Mobile.TimeShift.Change]", data, ShopId, WorkDate, ShiftCode, NoteChange);
        }
        public async Task<IList<AlertEntity>> noteLate(string data, int ShopId, int WorkDate, int TimeLate, string Note)
        {
            return await this.SqlRawAsync<AlertEntity>("[dbo].[Mobile.Employee.LateNote]", data, ShopId, WorkDate, TimeLate, Note);
        }
        public async Task<int> uploadFile(string data, int ShopId, string photoPath)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Mobile.UploadFile.Issue]", data, ShopId, photoPath);
        }
        public async Task<IList<ConfirmWorkingPlanModel>> getConfirmPlan(string data, int weekByYear)
        {
            return await this.SqlRawAsync<ConfirmWorkingPlanModel>("[dbo].[Mobile.getData.SupConfirm]", data, weekByYear);
        }
        public async Task<int> ConfirmRejectPlan(int AccountId, int UserId, int ShopId, int EmployeeId, int WorkDate, string Note, int IsConfirmOrReject, int Type)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Mobile.SupConfirmAndReject]", AccountId, UserId, ShopId, EmployeeId, WorkDate, Note, IsConfirmOrReject, Type);
        }
        public async Task<IList<ShopModel>> GetShopByEmployee(int? AccountId, int? UserId, int? WorkDate, int? Position, string SupId, string EmployeeId, int? DealerId, string Area, string Region, string Province)
        {
            return await this.SqlRawAsync<ShopModel>("dbo.[Store.GetByEmployee]", AccountId, UserId, WorkDate, Position, SupId, EmployeeId, DealerId, Area, Region, Province);
        }
        public async Task<DataTable> SellOut_GetStoreList(string data)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Daikin.SellOut.Mobile.getStoreList]", data);
        }
        public async Task<DataTable> SellOut_GetProducts(string data)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Daikin.SellOut.Mobile.GetProducts]", data);
        }
        public async Task<DataTable> SellOut_GetDataByShop(string data, int ShopId, string Dayview)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Daikin.SellOut.Mobile.GetDataByShop]", data, ShopId, Dayview);
        }
        public async Task<int> SellOut_UpdateOrDelete(string data, long? selloutId, int? quantity)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Daikin.SellOut.Mobile.SaveOrUpdate]", data, selloutId, quantity);
        }

        public async Task<DataTable> SSub_GetStoreList(string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Pana.SSub.GetStoreList]", json);
        }

        public async Task<DataTable> SSub_GetDisplay(string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Pana.SSub.GetDisplay]", json);
        }

        public async Task<DataTable> SSub_Insert(string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Pana.SSub.Insert]", json);
        }

        public async Task<DataTable> GetListRawByReport_Dynamic(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Mobile.RawData.byReport.GetDynamic]", accountId, userId, jsonData);
        }

        public async Task<DataTable> ExportRawByReport_Dynamic(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Mobile.RawData.byReport.Export]", accountId, userId, jsonData);
        }

        public async Task<DataTable> UpdateShopByReport(int accountId, int userId, int Id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Mobile.RawData.byReport.Update]", accountId, userId, Id);
        }
    }
}
