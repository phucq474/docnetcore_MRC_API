using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table("Competitor")]
    public class CompetitorEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string BrandCode { get; set; }
        public string BrandName { get; set; }
        public string CategoryMapping { get; set; }
        public string Competitor { get; set; }
        public int? Status { get; set; }
        public int? Order { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? CreateBy { get; set; }
    }
}
