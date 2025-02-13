using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using SpiralData;
using SpiralEntity;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class CalendarController : SpiralBaseController
    {
        public readonly ICalendarService _service;
        public CalendarController(CalendarContext _context)
        {
            _service = new CalendarService(_context);
        }
        [HttpGet("GetList")]
        [Authorize]
        public ActionResult<List<CalendarEntity>> GetCalendars([FromHeader] int Year,[FromHeader] int Month,[FromHeader] string Date)
        {
            try
            {
                int? _Year = null, _Month = null;
                DateTime? _Date = null;
                if (Year > 0)
                    _Year = Year;
                if (Month > 0)
                    _Month = Month;
                if (!string.IsNullOrEmpty(Date) && !string.IsNullOrWhiteSpace(Date))
                    _Date = Convert.ToDateTime(Date);
                var result= _service.GetList(_Year, _Month, _Date);
                return result;
            }
            catch(Exception ex)
            {
                string mess = ex.Message;
                return new List<CalendarEntity>();
            }
        }

        [HttpGet("GetCycle")]
        public ActionResult<ResultInfo> GetCycle([FromHeader] int? accId)
        {
            try
            {
                DataTable data = Task.Run(() => _service.GetCycle(accId ?? AccountId)).Result;
                if (data.Rows.Count > 0)
                {
                    return new ResultInfo(200, "", "", data);
                }
                else
                {
                    return new ResultInfo(500, "", "");
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, "");
            }
        }
    }
}
