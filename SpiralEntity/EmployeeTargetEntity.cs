using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class EmployeeTargetEntity
    {
        [Key]
        public int Id { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public int? EmployeeId { get; set; }
        public int? ShopId { get; set; }
        public int? Visit { get; set; }
        public string Note { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
