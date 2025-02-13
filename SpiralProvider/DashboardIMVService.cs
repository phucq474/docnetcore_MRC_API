using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IDashboardIMVService
    {
        Task<DataSet> SellIn_Total(int accountId, int userId, string jsonData);
    }

    public class DashboardIMVService: IDashboardIMVService
    {
        private readonly DashboardIMVContext _context;
        public DashboardIMVService(DashboardIMVContext context)
        {
            _context = context;
        }
        public async Task<DataSet> SellIn_Total(int accountId, int userId, string jsonData)
        {
            return await _context.SellIn_Total(accountId, userId, jsonData);
        }
    }
}
