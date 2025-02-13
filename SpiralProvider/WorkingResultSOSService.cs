using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IWorkingResultSOSService
    {
        Task<DataTable> Filter(int userId, string jsonData);
        Task<DataTable> Detail(string jsonData);
        Task<DataTable> Export(int userId, string jsonData);
        Task<DataTable> Export_Newest(int userId, string jsonData);
    }
    public class WorkingResultSOSService : IWorkingResultSOSService
    {
        private readonly WorkingResultSOSContext _context;
        public WorkingResultSOSService(WorkingResultSOSContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(int userId, string jsonData)
        {
            return await _context.Filter(userId, jsonData);
        }
        public async Task<DataTable> Detail(string jsonData)
        {
            return await _context.Detail(jsonData);
        }
        public async Task<DataTable> Export(int userId, string jsonData)
        {
            return await _context.Export(userId, jsonData);
        }
        public async Task<DataTable> Export_Newest(int userId, string jsonData)
        {
            return await _context.Export_Newest(userId, jsonData);
        }
    }
}
