using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
   public class WorkingPlanContext:DataContext
    {
        public async Task<DataTable> GetList(int? UserId, string Json, int AccountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.WorkingPlan.GetList]", UserId, Json, AccountId);
        }
        public async Task<DataTable> GetDetail( int? UserId, string Json, int AccountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[WorkingPlan.GetDetail]",  UserId, Json,AccountId);
        }
        public async Task<int> ChangeShift( int? UserId, string Json, int AccountId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[WorkingPlan.ChangeShift]",  UserId, Json, AccountId);
        }
        public async Task<int> Confirm(int? UserId, string Json, int AccountId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[WorkingPlan.Confirm]", UserId, Json, AccountId);
        }
        public async Task<DataSet> WorkingPlan_Filter(int AccountId, int EmployeeId, int? PlanDate, int? CustomerId, string Area, string ProvinceId, string ShopCode)
        {
            return await this.ExcuteDataSetAsync("[dbo].[WorkingPlan.Filter]", AccountId, EmployeeId, PlanDate, CustomerId, Area, ProvinceId, ShopCode);
        }
        public async Task<IList<ResultModel>> WorkingPlan_Save(int UserId,int AccountId,int EmployeeId,int? PlanDate,int? CustomerId,string Area,string ProvinceId,string ShopCode,string ShopSave)
        {
            return await this.SqlRawAsync<ResultModel>("[dbo].[WorkingPlan.Save]", UserId, AccountId, EmployeeId, PlanDate, CustomerId, Area, ProvinceId, ShopCode, ShopSave);
        }

        public async Task<DataSet> Export_LichLamViec(int userId, string jsonData, int AccountId)
        {
            return await this.ExcuteDataSetAsync("[dbo].[WorkingPlan.Export.LLV]", userId, jsonData, AccountId);
        }

        public async Task<DataSet> Template_LLV_PGM(int userId, string jsonData, int AccountId)
        {
            return await this.ExcuteDataSetAsync("[dbo].[WorkingPlan.Template.LLV]", userId, jsonData, AccountId);
        }

        public async Task<int> Import_LLV_PGM(int userId, string json, int AccountId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[WorkingPlan.Import.LLV]", userId, json, AccountId);
        }

        public async Task<DataTable> Export_ChangeWP_RawData(int userId, string jsonData, int AccountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[WorkingPlan.ChangeWP.RawData]", userId, jsonData, AccountId);
        }
        public async Task<int> RemoveChangeShift(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.WorkingPlan.RemoveChangeShift]", accountId, userId, jsonData);
        }
    }
}
