using SpiralData;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IAttendantService
    {
        Task<DataTable> GetDynamic(int AccountId, int? UserId, string JsonData);
        Task<DataTable> Report_Attendant_RawData(int userId, string jsonData, int accountId);
        Task<DataTable> FilterUpdate(int shopId, int employeeId, int? PhotoDate, string ShiftCode);
        Task<DataTable> Update(long? photoID, int photoType, string photoTime, int photoDate, string photo, string ShiftCode, int userId);
        Task<DataTable> InsertItem(int employeeId, int shopId, int photoDate, string photoTime, int? photoType, string photo, string ShiftCode, int userId);
        Task<DataTable> Insert(int employeeId, int shopId, string photoTime, int photoType, string photo, decimal? latitude, decimal? longitude, string ShiftCode, int userId);
        Task<int> DeleteAll(int shopId, int employeeId, int photoDate, string ShiftType, int userId);
        Task<int> DeleteItem(long photoId);
        Task<DataTable> GetShift(int accountId, int employeeId, int shopId, string workDate);
        Task<DataTable> Timesheet_Export_Total(int accountId, int userId, string jsonData);
        Task<DataTable> Report_Attendant_TimeStore(int accountId, int userId, string jsonData);
    }
    public class AttendantService : IAttendantService
    {

        private readonly AttendantContext _context;
        public AttendantService(AttendantContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetDynamic(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetDynamic(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> Report_Attendant_RawData(int userId, string jsonData, int accountId)
        {
            return await _context.Report_Attendant_RawData(userId, jsonData, accountId);
        }
        public async Task<DataTable> FilterUpdate(int shopId, int employeeId, int? PhotoDate, string ShiftCode)
        {
            return await _context.FilterUpdate(shopId, employeeId, PhotoDate, ShiftCode);
        }
        public async Task<DataTable> Update(long? photoID, int photoType, string photoTime, int photoDate, string photo, string ShiftCode, int userId)
        {
            return await _context.Update(photoID, photoType, photoTime, photoDate, photo, ShiftCode, userId);
        }
        public async Task<DataTable> InsertItem(int employeeId, int shopId, int photoDate, string photoTime, int? photoType, string photo, string ShiftCode, int userId)
        {
            return await _context.InsertItem(employeeId, shopId, photoDate, photoTime, photoType, photo, ShiftCode, userId);
        }
        public async Task<DataTable> Insert(int employeeId, int shopId, string photoTime, int photoType, string photo, decimal? latitude, decimal? longitude, string ShiftCode, int userId)
        {
            return await _context.Insert(employeeId, shopId, photoTime, photoType, photo, latitude, longitude, ShiftCode, userId);
        }
        public async Task<int> DeleteAll(int shopId, int employeeId, int photoDate, string ShiftType, int userId)
        {
            return await _context.DeleteAll(shopId, employeeId, photoDate, ShiftType, userId);
        }
        public async Task<int> DeleteItem(long photoId)
        {
            return await _context.DeleteItem(photoId);
        }
        public async Task<DataTable> GetShift(int accountId, int employeeId, int shopId, string workDate)
        {
            return await _context.GetShift(accountId, employeeId, shopId, workDate);
        }
        public async Task<DataTable> Timesheet_Export_Total(int accountId, int userId, string jsonData)
        {
            return await _context.Timesheet_Export_Total(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_Attendant_TimeStore(int accountId, int userId, string jsonData)
        {
            return await _context.Report_Attendant_TimeStore(accountId, userId, jsonData);
        }
    }
}
