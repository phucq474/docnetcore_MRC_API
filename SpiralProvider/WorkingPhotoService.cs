using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IWorkingPhotoService
    {
        Task<DataTable> GetPhoto(int accountId,string jsonData);
        Task<DataTable> GetPhotoType(int accountId, int? reportId);
        Task<int> DeletePhoto(int userId, int photoId);
        Task<int> Save(int userId, string json, int  accountId);
    }
    public class WorkingPhotoService : IWorkingPhotoService
    {
        private readonly WorkingPhotoContext _context;
        public WorkingPhotoService(WorkingPhotoContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetPhoto(int accountId,string jsonData)
        {
            return await _context.GetPhoto(accountId, jsonData);
        }
        public async Task<DataTable> GetPhotoType(int accountId, int? reportId)
        {
            return await _context.GetPhotoType(accountId, reportId);
        }
        public async Task<int> DeletePhoto(int userId, int photoId)
        {
            return await _context.DeletePhoto(userId, photoId);
        }
        public async Task<int> Save(int userId, string json, int accountId)
        {
            return await _context.Save(userId, json, accountId);
        }
    }
}
