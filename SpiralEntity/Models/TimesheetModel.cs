namespace SpiralEntity.Models
{
    public class TimesheetModel
    {
        public int? EmployeeId { get; set; }
        public int? WorkDate { get; set; }
        public int? Status { get; set; }
        public int? Confirmed { get; set; }
        public int? FromDate { get; set; }
        public int? ToDate { get; set; }
        public int? SupId { get; set; }
        public int? Position { get; set; }
        public decimal? OT { get; set; }
        public decimal? OTPG { get; set; }
        public string Shift { get; set; }
        public string TotalTime { get; set; }
        public string Evidence { get; set; }
        public string Note { get; set; }
        public string Type { get; set; }
        public string EmployeeLists { get; set; }
        public int? Reject { get; set; }
        public string RejectNote { get; set; }
        public string OT_Shift { get; set; }
        public string OT_Note { get; set; }
        public string OT_Day { get; set; }
        public string OT_Night { get; set; }
    }
}