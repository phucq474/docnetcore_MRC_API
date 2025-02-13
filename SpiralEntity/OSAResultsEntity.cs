using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class OSAResultsEntity
    {
        public int Id { get; set; }
        public int? ShopId { get; set; }
        public DateTime? WorkDate { get; set; }
        public int? ProductId { get; set; }
        public int? OSA { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? QCValue { get; set; }
    }
}
