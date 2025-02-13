using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class WorkingPlanDefaultEntity
    {
        [Key]
        public long Id { get; set; }
        public int EmployeeId { get; set; }
        public int ShopId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Plan { get; set; }
        public string ShiftCode { get; set; }
        public DateTime CreatedDate { get; set; }
        public int? CreatedBy { get; set; }
        public int? AccountId { get; set; }
    }
}
