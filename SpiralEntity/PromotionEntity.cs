using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "Promotion")]
    public class PromotionEntity
    {
        [Key]
        public int Id { get; set; }
        public Int64 EmployeeId { get; set; }
        public Int64 ShopId { get; set; }
        public int WorkDate { get; set; }
        public int CategoryId { get; set; }
        public int CompetitorId { get; set; }
        public int? PromotionId { get; set; }
        public int? FromDate { get; set; }
        public int? ToDate { get; set; }
        public string Content { get; set; }
        public string ContactName { get; set; }
        public string Phone { get; set; }
        public string Guiid { get; set; }
        public string QCContent { get; set; }
        public int? AccountId { get; set; }
        public int? ProductId { get; set; }
        public string Title { get; set; }
    }
}
