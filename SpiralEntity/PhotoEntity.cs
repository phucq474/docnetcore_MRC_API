using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table("PhotoResult")]
    public class PhotoEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long PhotoID { set; get; }
        public int? ReportId { set; get; }
        public long ShopId { set; get; }
        public int EmployeeId { set; get; }
        public int PhotoDate { set; get; }
        public DateTime? PhotoTime { set; get; }
        public string PhotoNote { set; get; }
        public string PhotoPath { set; get; }
        public string PhotoType { set; get; }
        public decimal? Latitude { set; get; }
        public decimal? Longitude { set; get; }
        public decimal? Accuracy { set; get; }
        public DateTime? CreateDate { set; get; }
        public int? PromotionId { set; get; }
        public string Guiid { set; get; }
        public int AccountId { set; get; }
        public int? FSMNumber { set; get; }

    }
}
