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
    public interface ISpiralFormService
    {
        Task<SpiralFormEntity> CreateForm(SpiralFormEntity form, int userId, int accountId);
        Task<DataTable> GetResultTotal(int AccountId, int? UserId, string JsonData);
        Task<SpiralFormEntity> GetById(string accessKey, int? formId);
        Task<SpiralFormModel> GetResultById(int accountId, int userId, long Id);
        Task<int> UpdateResult(int AccountId, int UserId, long Id, string FormData);
        Task<SpiralFormEntity> GetByKey(string Key, string Host);
        Task<List<SpiralFormEntity>> GetList(int accountId, int? fromDate, string title, int userId);
        Task<SpiralFormEntity> accesskey(string accessKey);
        Task<List<ShopDDLModel>> GetStore(int? AccountId, int? UserId);

        Task<DataTable> TabDeTail(int accountId, int workDate, int formId, int? SupervisorId, string listEm);
        Task<DataSet> ExportRawData(int accountId, int userId, string jsonData);
        List<QuestionModel> GetQuestionName(int accountId, int formId);
        Task<DataTable> InactiveSpiralForm(int accountId, int formId);
        Task<DataTable> Delete_SpiralFormResult(int accountId, int id, int userId);
        Task<DataTable> Notify_GetEmployees(int accountId, int userId, string json);
        Task<List<SpiralFormModel>> ExportImage(int accountId, int userId, string jsonData);
        Task<int> Notify_UpdateMessenger(int accountId, int userId, string json);
        Task<int> LogData(int userId, long id);
        Task<DataSet> ExportForm42(int accountId, int userId, string jsonData);
    }
    public class SpiralFormService : ISpiralFormService
    {
        private readonly SpiralFormContext _context;
        public SpiralFormService(SpiralFormContext context)
        {
            _context = context;
        }

        public async Task<DataTable> GetResultTotal(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetResultTotal(AccountId, UserId, JsonData);
        }
        public async Task<SpiralFormEntity> accesskey(string accessKey)
        {
            return await Task.Run(() => _context.SpiralForm.Where(s => s.AccessKey == accessKey).FirstOrDefault());
        }

        public async Task<List<ShopDDLModel>> GetStore(int? AccountId, int? UserId)
        {
            var data = await _context.GetStore(AccountId, UserId);
            if (data != null)
                return (List<ShopDDLModel>)data;
            else
                return null;
        }
        public async Task<SpiralFormEntity> CreateForm(SpiralFormEntity form, int userId, int accountId)
        {
            return await _context.CreateForm(form, userId, accountId);
        }
        public async Task<SpiralFormEntity> GetById(string accessKey, int? formId)
        {
            return await Task.Run(() => _context.SpiralForm.Where(s => s.AccessKey == accessKey || s.Id == formId).FirstOrDefault());
        }
        public async Task<SpiralFormEntity> GetByKey(string Key, string Host)
        {
            var data = await _context.GetByKey(Key, Host);
            if (data != null)
            {
                return data.FirstOrDefault();
            }
            else
            {
                return null;
            }

        }
        public async Task<SpiralFormModel> GetResultById(int accountId, int userId, long Id)
        {
            return await Task.Run(() => _context.GetResultById(accountId, userId, Id));
        }
        public async Task<int> UpdateResult(int AccountId, int UserId, long Id, string FormData)
        {
            return await _context.UpdateResult(AccountId, UserId, Id, FormData);
        }
        public async Task<List<SpiralFormEntity>> GetList(int accountId, int? fromDate, string title, int userId)
        {
            return await _context.GetList(accountId, fromDate, title, userId);
        }
        public async Task<DataTable> TabDeTail(int accountId, int workDate, int formId, int? SupervisorId, string listEm)
        {
            return await _context.TabDetail(accountId, workDate, formId, SupervisorId, listEm);
        }
        public async Task<DataSet> ExportRawData(int accountId, int userId, string jsonData)
        {
            return await _context.ExportRawData(accountId, userId, jsonData);
        }
        public async Task<List<SpiralFormModel>> ExportImage(int accountId, int userId, string jsonData)
        {
            return await _context.ExportImage(accountId, userId, jsonData);
        }

        public List<QuestionModel> GetQuestionName(int accountId, int formId)
        {
            var data = _context.GetQuestionName(accountId, formId);
            if (data != null)
            {
                return data.ToList();
            }
            else
            {
                return null;
            }
        }
        public async Task<DataTable> InactiveSpiralForm(int accountId, int formId)
        {
            return await _context.InactiveSpiralForm(accountId, formId);
        }
        public async Task<DataTable> Delete_SpiralFormResult(int accountId, int id, int userId)
        {
            return await _context.Delete_SpiralFormResult(accountId, id, userId);
        }
        public async Task<DataTable> Notify_GetEmployees(int accountId, int userId, string json)
        {
            return await _context.Notify_GetEmployees(accountId, userId, json);
        }
        public async Task<int> Notify_UpdateMessenger(int accountId, int userId, string json)
        {
            return await _context.Notify_UpdateMessenger(accountId, userId, json);
        }
        public async Task<int> LogData(int userId, long id)
        {
            return await _context.LogData(userId, id);
        }
        public async Task<DataSet> ExportForm42(int accountId, int userId, string jsonData)
        {
            return await _context.ExportForm42(accountId, userId, jsonData);
        }
    }

}
