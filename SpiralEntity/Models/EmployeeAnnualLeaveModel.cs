namespace SpiralEntity.Models
{
    public class EmployeeAnnualLeaveModel
    {
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public decimal? AL { get; set; }
        public decimal? CL { get; set; }
        public decimal? NB { get; set; }
        public decimal? MonthAL { get; set; }
        public decimal? MonthNB { get; set; }
        public string LeaderCode { get; set; }
        public string LeaderName { get; set; }
    }
}