using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class EmployeeMarketsEntity
    {
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int MarketCode { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public Boolean? IsDelete { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? CreatedBy { get; set; }
    }
}
