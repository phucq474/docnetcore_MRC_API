using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class AttendantContext : DataContext
    {
     
        public async Task<DataTable> GetDynamic(int AccountId, int? UserId, string Json)
        {
             return await this.ExcuteDataTableAsync("[dbo].[MRC.Attendant.Filter]", AccountId, UserId, Json);
        }
        public async Task<DataTable> Report_Attendant_RawData(int userId, string jsonData, int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.RawData]", userId, jsonData, accountId);
        }

        public async Task<DataTable> FilterUpdate(int shopId, int employeeId, int? PhotoDate, string ShiftCode)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Attendant.FilterUpdate]", shopId, employeeId, PhotoDate, ShiftCode);
        }

        public async Task<DataTable> Update(long? photoID, int photoType, string photoTime, int photoDate, string photo, string ShiftCode, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Attendant.UpdateItem]", photoID, photoType, photoTime, photoDate, photo, ShiftCode, userId);
        }

        public async Task<DataTable> InsertItem(int employeeId, int shopId, int photoDate, string photoTime, int? photoType, string photo, string ShiftCode, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Attendant.InsertItem]", employeeId, shopId, photoDate, photoTime, photoType, photo, ShiftCode, userId);
        }

        public async Task<DataTable> Insert(int employeeId, int shopId, string photoTime, int photoType, string photo, decimal? latitude, decimal? longitude, string ShiftCode, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Attendant.Insert]", employeeId, shopId, photoTime, photoType, photo, latitude, longitude, ShiftCode, userId);
        }

        public async Task<int> DeleteAll(int shopId, int employeeId, int photoDate, string ShiftCode, int userId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.Attendant.DeleteAll]", shopId, employeeId, photoDate, ShiftCode, userId);
        }

        public async Task<int> DeleteItem(long photoId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.Attendant.DeleteItem]", photoId);
        }

        public async Task<DataTable> GetShift(int accountId, int employeeId, int shopId, string workDate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Attendant.GetShift]", accountId, employeeId, shopId, workDate);
        }

        public async Task<DataTable> Timesheet_Export_Total(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Attendants.Timesheets.Report.Total]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_Attendant_TimeStore(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Attendants.Report.TimeStore]", accountId, userId, jsonData);
        }
    }
}
