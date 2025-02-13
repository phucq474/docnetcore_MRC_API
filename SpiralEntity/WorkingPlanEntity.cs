using System;
namespace SpiralEntity
{
    public class WorkingPlanEntity
    {
        public int Id { get; set; }
        public int ShopId { get; set; }
        public int EmployeeId { set; get; }
        public DateTime WorkingDay { get; set; }
        public string ShiftType { get; set; }
        public string LastShift { get; set; }
        public int? BShopId { get; set; }
        public string LastChanged { get; set; }
        public int? RefId { get; set; }
        public string ChangeNote { get; set; }
        public DateTime? ChangeDate { get; set; }
        public int? ConfirmBy { get; set; }
        public int? Confirm { get; set; }
        public string ConfirmNote { get; set; }
        public DateTime? ConfirmDate { get; set; }
        public int? AttendantConfirm { get; set; }
        public string AttendantNote { get; set; }
        public int? AttendantConffirmBy { get; set; }
        public DateTime? AddtendantConfirmDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? AccountId { get; set; }
    }
}
