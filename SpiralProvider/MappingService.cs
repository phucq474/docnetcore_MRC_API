using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IMappingService
    {
        Task<DataTable> MapGetShop(int AccountId, int UserId, string JsonSearch);
        Task<DataTable> DigitalMapping_GetRouteByEmployee(int AccountId, int UserId, string JsonSearch);
        Task<DataTable> DigitalMapping_DistanceFromStartPoint(int AccountId, int UserId, string JsonSearch);
        Task<DataTable> DigitalMapping_ChartSellOut(int AccountId, int UserId, DateTime FromDate, DateTime ToDate, Int32 ShopId);
        Task<int> Customer_SaveInfo(int AccountId, int UserId, int EmployeeId, int PlanDate, string CustomerPhone, string CustomerName, string CustomerAddress, string CustomerDesc, float? Lat, float? Lng, string TypeSave,int? CusId);
        Task<DataTable> Customer_GetListCustomer(int AccountId, int UserId, int? FromDate, int? ToDate, int? EmployeeId);
        Task<DataTable> CustomerTracking_Export(int AccountId, int UserId, int FromDate, int ToDate, int? EmployeeId, string CustomerPhone);
        Task<DataTable> LG_AttendantKTV_Export(int AccountId, int UserId, int FromDate, int ToDate, int? EmployeeId);
    }
    public class MappingService : IMappingService
    {
        private readonly MappingContext _context;
        public MappingService(MappingContext context)
        {
            _context = context;
        }
        public async Task<DataTable> MapGetShop(int AccountId, int UserId, string JsonSearch)
        {
            return await _context.MapGetShop(AccountId, UserId, JsonSearch);
        }
        public async Task<DataTable> DigitalMapping_GetRouteByEmployee(int AccountId, int UserId, string JsonSearch)
        {
            return await _context.DigitalMapping_GetRouteByEmployee(AccountId, UserId, JsonSearch);
        }
        public async Task<DataTable> DigitalMapping_DistanceFromStartPoint(int AccountId, int UserId, string JsonSearch)
        {
            return await _context.DigitalMapping_DistanceFromStartPoint(AccountId, UserId, JsonSearch);
        }
        public async Task<DataTable> DigitalMapping_ChartSellOut(int AccountId, int UserId, DateTime FromDate, DateTime ToDate, Int32 ShopId)
        {
            return await _context.DigitalMapping_ChartSellOut(AccountId, UserId, FromDate, ToDate, ShopId);
        }
        public async Task<int> Customer_SaveInfo(int AccountId, int UserId, int EmployeeId,int PlanDate, string CustomerPhone,string CustomerName, string CustomerAddress, string CustomerDesc, float? Lat, float? Lng, string TypeSave,int? CusId)
        {
            return await _context.Customer_SaveInfo(AccountId, UserId, EmployeeId,PlanDate, CustomerPhone,CustomerName, CustomerAddress, CustomerDesc, Lat, Lng,TypeSave,CusId);
        }
        public async Task<DataTable> Customer_GetListCustomer(int AccountId, int UserId, int? FromDate, int? ToDate, int? EmployeeId)
        {
            return await _context.Customer_GetListCustomer(AccountId, UserId, FromDate, ToDate, EmployeeId);
        }
        public async Task<DataTable> CustomerTracking_Export(int AccountId, int UserId, int FromDate, int ToDate, int? EmployeeId, string CustomerPhone)
        {
            return await _context.CustomerTracking_Export(AccountId, UserId, FromDate, ToDate, EmployeeId, CustomerPhone);
        }
        public async Task<DataTable> LG_AttendantKTV_Export(int AccountId, int UserId, int FromDate, int ToDate, int? EmployeeId)
        {
            return await _context.LG_AttendantKTV_Export(AccountId, UserId, FromDate, ToDate, EmployeeId);
        }
    }
}
