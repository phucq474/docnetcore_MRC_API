using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IHRService
    {
        Task<int> import(int AccountId, int Year, DataTable dtImport, int UserId);
    }
    public class HRService : IHRService
    {
        private readonly HRContext _context;
        public HRService(HRContext context)
        {
            _context = context;
        }
        public async Task<int> import(int AccountId, int Year, DataTable dtImport, int UserId)
        {
            return await _context.ImportData(AccountId, Year, dtImport, UserId);
        }
    }
}
