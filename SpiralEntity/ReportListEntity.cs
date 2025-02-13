using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
  public  class ReportListEntity
    {
        [Key]
        public int Id { get; set; }
        public int? PositionId { get; set; }
        public string ReportCode { get; set; }
        public string ReportName { get; set; }
        [Column("ReportName.VN")]
        public string ReportNameVN { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
