using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class MappingContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataTable> MapGetShop(int AccountId, int UserId, string JsonSearch)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Mapping.GetShop]", AccountId, UserId, JsonSearch);
        }
        public async Task<DataTable> DigitalMapping_GetRouteByEmployee(int AccountId, int UserId, string JsonSearch)
        {
            return await this.ExcuteDataTableAsync("[dbo].[DigitalMapping.GetRouteByEmployee]", AccountId, UserId, JsonSearch);
        }
        public async Task<DataTable> DigitalMapping_DistanceFromStartPoint(int AccountId, int UserId, string JsonSearch)
        {
            return await this.ExcuteDataTableAsync("[dbo].[DigitalMapping.DistanceFromStartPoint]", AccountId, UserId, JsonSearch);
        }
        public async Task<DataTable> DigitalMapping_ChartSellOut(int AccountId, int UserId, DateTime FromDate, DateTime ToDate, Int32 ShopId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[DigitalMapping.ChartSellOut]", AccountId, UserId, FromDate, ToDate, ShopId);
        }
        public async Task<int> Customer_SaveInfo(int AccountId, int UserId, int EmployeeId, int PlanDate, string CustomerPhone, string CustomerName, string CustomerAddress, string CustomerDesc, float? Lat, float? Lng,string TypeSave,int? CusId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Customers.SaveInfo]", AccountId, UserId, EmployeeId, PlanDate, CustomerPhone, CustomerName, CustomerAddress, CustomerDesc, Lat, Lng, TypeSave,CusId);
        }
        public async Task<DataTable> Customer_GetListCustomer(int AccountId, int UserId, int? FromDate, int? ToDate, int? EmployeeId)
        {
            if (EmployeeId == 0) EmployeeId = null;
            return await this.ExcuteDataTableAsync("[dbo].[Customers.GetListCustomer]", AccountId, UserId, FromDate, ToDate, EmployeeId);
        }
        public async Task<DataTable> CustomerTracking_Export(int AccountId,int UserId,int FromDate,int ToDate,int? EmployeeId,string CustomerPhone)
        {
            return await this.ExcuteDataTableAsync("[dbo].[CustomerTracking.Export]", AccountId, UserId, FromDate, ToDate, EmployeeId, CustomerPhone);
        }
        public async Task<DataTable> LG_AttendantKTV_Export(int AccountId,int UserId,int FromDate,int ToDate,int? EmployeeId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[LG.Attendant.KTV.Export]", AccountId, UserId, FromDate, ToDate, EmployeeId);
        }
    }
}
