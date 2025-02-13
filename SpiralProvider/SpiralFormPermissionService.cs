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
    public interface ISpiralFormPermissionService
    {
        Task<DataTable> GetList(int AccountId, int? UserId, string JsonData);
        Task<DataTable> GetById(int AccountId, int? UserId, string JsonData);
        Task<int> Update(int AccountId, int? UserId, string JsonData);
    }
    public class SpiralFormPermissionService : ISpiralFormPermissionService
    {
        private readonly SpiralFormPermissionContext _context;
        public SpiralFormPermissionService(SpiralFormPermissionContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetList(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> GetById(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetById(AccountId, UserId, JsonData);
        }
        public async Task<int> Update(int AccountId, int? UserId, string JsonData)
        {
            return await _context.Update(AccountId, UserId, JsonData);
        }
    }
}
