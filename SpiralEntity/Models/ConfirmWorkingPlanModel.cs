namespace SpiralEntity.Models
{
    public class ConfirmWorkingPlanModel
    {
        public int PlanId { set; get; }
        public string FullName { set; get; }
        public string WorkDate { set; get; }
        public long ShopId { set; get; }
        public string ShopName { set; get; }
        public string ShiftType { set; get; }
        public string Notes { set; get; }
        public int DateSave { set; get; }
        public string ShiftChange { set; get; }
        public string CheckIn { set; get; }
        public string CheckOut { set; get; }
        public int? TimeLate { set; get; }
        public string NoteLate { set; get; }
        public string TimeIn { set; get; }
        public string TimeOut { set; get; }
        public string TotalTime { set; get; }
        public int isEditShift { set; get; }
        public int isEditLate { set; get; }
        public int isView { set; get; }
        public int? EmployeeId { get; set; }
        public int? AccountId { get; set; }
        public int? UserId { get; set; }
        public int? StatusShiftChange { get; set; }
        public int? StatusLate { get; set; }
        public int? Index { get; set; }
    }
}