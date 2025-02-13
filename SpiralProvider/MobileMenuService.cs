using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IMobileMenuService
    {
        Task<DataTable> GetList();
        Task<DataTable> GetListMenu(int accountId, int userId, int? position);
        Task<DataTable> Filter(int accountId, int userId, string json);
        Task<DataTable> Insert(int accountId, int userId, string json);
        Task<DataTable> Update(int accountId, int userId, string json);
        Task<int> Delete(int accountId, int userId, int id);
    }
    public class MobileMenuService : IMobileMenuService
    {
        private readonly MobileMenuContext _context;
        public MobileMenuService(MobileMenuContext context)
        {
            _context = context;
        }

        public async Task<DataTable> GetList()
        {
            return await _context.GetList();
        }
        public async Task<DataTable> GetListMenu(int accountId, int userId, int? position)
        {
            return await _context.GetListMenu(accountId, userId, position);
        }
        public async Task<DataTable> Filter(int accountId, int userId, string json)
        {
            return await _context.Filter(accountId, userId, json);
        }
        public async Task<DataTable> Insert(int accountId, int userId, string json)
        {
            return await _context.Insert(accountId, userId, json);
        }
        public async Task<DataTable> Update(int accountId, int userId, string json)
        {
            return await _context.Update(accountId, userId, json);
        }
        public async Task<int> Delete(int accountId, int userId, int id)
        {
            return await _context.Delete(accountId, userId, id);
        }
    }
}
