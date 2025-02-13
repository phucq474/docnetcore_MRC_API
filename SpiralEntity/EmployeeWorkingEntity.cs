using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class EmployeeWorkingEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int WorkingStatusId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
