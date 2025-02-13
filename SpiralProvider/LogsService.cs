using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ILogsService
    {
        Task<int> Write(LogsEntity logs);
    }
    public class LogsService : ILogsService
    {
        private readonly LogsContext _context;
        public LogsService(LogsContext context)
        {
            _context = context;
        }

        public async Task<int> Write(LogsEntity logs)
        {
            return await _context.WriteLog(logs);
        }
    }
}
