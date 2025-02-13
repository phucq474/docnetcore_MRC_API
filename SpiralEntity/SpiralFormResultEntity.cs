using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "SpiralForm.Result")]
    public class SpiralFormResultEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { set; get; }
        public int? AccountId { set; get; }
        public int? WorkDate { get; set; }
        public int? EmployeeId { set; get; }
        public long? ShopId { set;  get; }
        public long FormId { get; set; }
        public string FormData { get; set; }
        public int? CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string HyperLink { get; set; }
    }
}
