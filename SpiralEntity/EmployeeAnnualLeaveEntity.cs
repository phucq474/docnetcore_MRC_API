using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class EmployeeAnnualLeaveEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public Int32 EmployeeId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int? AL { get; set; }
        public int? CL { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
