using Microsoft.EntityFrameworkCore;
using SpiralData;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using SpiralEntity;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IMessengerService
    {
        Task<IList<AlertEntity>> UploadNotification(DataTable tb, string ReportType);
        Task<List<MessengerModel>> GetList(int AccountId, int Month, int Year, int? Status, string notifyType, string employeeId, int UserId, int? Position, string notifyTitle);
        Task<int> RemoveNotify(int accountId, string idList, int userId);
        Task<int> UpdateNotify(int accountId, string idList, int userId);
        Task<int> ImportNotify(int account, int month, int year, int loginid, DataTable dtImport);
        Task<List<MessengerModel>> GetNotifyGroup(int accountId, int userId);
        Task<DataTable> Export(int accountId, int month, int year, int? status, string notifyType, string employeeId, int userId, int? position, string notifyTitle);
        Task<DataTable> GetNotifyTitle(int accountId, int userId);
    }
    public class MessengerService : IMessengerService
    {
        private readonly MessengerContext _context;
        public MessengerService(MessengerContext context)
        {
            _context = context;
        }
        public async Task<List<MessengerModel>> GetList(int AccountId, int Month, int Year, int? Status, string notifyType,string employeeId, int UserId, int? Position, string notifyTitle)
        {
            var data = await _context.GetList(AccountId, Month, Year, Status, notifyType, employeeId, UserId, Position, notifyTitle);
            if (data != null)
                return data.ToList();
            else return null;
        }
        public async Task<List<MessengerModel>> GetNotifyGroup(int accountId, int userId)
        {
            var result = await this._context.GetNotifyGroup(accountId, userId);
            if (result != null)
                return result.ToList();
            else return null;
        }

        public async Task<int> ImportNotify(int AccountId, int month, int year, int employeeId, DataTable dtImport)
        {
            return await _context.ImportNotify(AccountId, month, year, employeeId, dtImport);
        }

        public async Task<int> RemoveNotify(int accountId, string idList, int userId)
        {
            var result = await _context.RemoveNotify(accountId, idList, userId);
            return result;
        }

        public async Task<int> UpdateNotify(int accountId, string idList, int userId)
        {
            var result = await _context.UpdateNotify(accountId, idList, userId);
            return result;
        }

        public async Task<IList<AlertEntity>> UploadNotification(DataTable tb, string ReportType)
        {
            var result = await _context.UploadNotification(tb, ReportType);
            if (result != null)
                return result.ToList();
            else return null;
        }
        public async Task<DataTable> Export(int accountId, int month, int year, int? status, string notifyType, string employeeId, int userId, int? position, string notifyTitle)
        {
            return await _context.Export(accountId, month, year, status, notifyType, employeeId, userId, position, notifyTitle);
        }

        public async Task<DataTable> GetNotifyTitle(int accountId, int userId)
        {
            return await _context.GetNotifyTitle(accountId, userId);
        }
    }
}
