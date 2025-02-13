using System;

namespace SpiralEntity.Models
{
    public class AttendantModel
    {
        public int? rpIndex { get; set; }
        public long? Id { get; set; }
        public int? EmployeeId { get; set; }
        public int? ShopId { get; set; }
        public int? AttendantType { get; set; }
        public int? AccountId { get; set; }
        public int? CreatedBy { get; set; }
        public Boolean? isDeleted { get; set; }
        public int? AttendantDate { get; set; }
        public DateTime? AttendentTime { get; set; }
        public DateTime? CreateDate { get; set; }
        public DateTime? WorkDate { get; set; }
        public double? Longitude { get; set; }
        public double? Latitude { get; set; }
        public string Photo { get; set; }
        public string Note { get; set; }
        public string FullName { get; set; }
        public string KPI { get; set; }
        public string Reason { get; set; }
    }
}