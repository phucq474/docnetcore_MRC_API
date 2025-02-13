using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
   public class ShiftListEntity
    {
        [Key]
        public int Id { get; set; }
        public string ShiftCode { get; set; }
        public string ShiftName { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public decimal? Value { get; set; }
        public string Note { get; set; }
        public int? Status { get; set; }
        public string RefCode { get; set; }
        public string Color { get; set; }
        public string BackGroundColor { get; set; }
        public string ShiftGroup { get; set; }
        public string GroupName { get; set; }
        public int? Order { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? AccountId { get; set; }
    }
}
