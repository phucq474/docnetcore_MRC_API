using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ICalendarService
    {
        Task<DataTable> GetCycle(int accountId);
        List<CalendarEntity> GetList(int? Year, int? Month, DateTime? Date);
    }
    public class CalendarService : ICalendarService
    {
        private readonly CalendarContext _context;
        public CalendarService(CalendarContext context)
        {
            _context = context;
        }
        public List<CalendarEntity> GetList(int? Year, int? Month, DateTime? Date)
        {
            return _context.Calendars.Where(c => (Year == null || c.Year == Year) && (Month == null || c.Month == Month) && (Date == null || c.Date == Date)).ToList();
        }
        public async Task<DataTable> GetCycle(int accountId)
        {
            return await _context.GetCycle(accountId);
        }
    }
}
