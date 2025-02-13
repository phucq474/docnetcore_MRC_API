using System;
using System.ComponentModel.DataAnnotations;

namespace SpiralEntity
{
    public class CalendarEntity
    {
        [Key]
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public int DayOfWeek { get; set; }
        public string DayOfWeekName { get; set; }
        public string DayOfWeekNameVN { get; set; }
        public string DayOfWeekNameAliasVN { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int WeekByMonth { get; set; }
        public int WeekByYear { get; set; }
        public int? YearByWeek { get; set; }
    }
}
