using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralEntity.Models
{
   public class WorkingPlanModel
    {
        public long? ShopId { get; set; }
        public int? EmployeeId { get; set; }
        public int? WorkDate { get; set; }
        public string ShiftType { get; set; }
        public string ShiftChange { get; set; }
        public int? SupConfirm { get; set; }
        public string SupNote { get; set; }
        public int? TimeLate { get; set; }
        public int? SupConfirmLate { get; set; }
        public string SupNoteLate { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string ShopCode { get; set; }
        public string ShopName { get; set; }
        public string Date { get; set; }
        public string Type { get; set; }
        public string Notes { get; set; }
        public string NoteLate { get; set; }
    }
}
