using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
   public class PromotionResultsEntity
    {
        [Key]
        public int Id { get; set; }
        public int ShopId { get; set; }
        public int? EmployeeId { get; set; }
        public int WorkDate { get; set; }
        public int PromotionId { get; set; }
        public int? ProductId { get; set; }
        public int? Value { get; set; }
        public string Comment { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? CCKM { get; set; }
        public int? AccountId { get; set; }
    }
}
