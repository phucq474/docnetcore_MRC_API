using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "SpiralForm")]
    public class SpiralFormEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { set; get; }
        public int AccountId { set; get; }
        public int? Status { set; get; }
        public string Title { set; get; }
        public string SubTitle { set; get; }
        public string Banner { set; get; }
        public int? Position { set; get; }
        public bool? UsedEmployees { set; get; }
        public bool? UsedStores { set; get; }
        public string Slogan { set; get; }
        public int? FromDate { set; get; }
        public int? ToDate { set; get; }
        public string FormData { set; get; }
        public string AccessKey { set; get; }
        public int? CreateBy { set; get; }
        public DateTime? CreateDate { set; get; }
        public string PositionList { get; set; }
        public int? MMobile { get; set; }
        public int? InApp { get; set; }
        public string PublicUrl { get; set; }
        public string WebUrl { get; set; }
        public int? RepeatDate { get; set; }
        public int? ActiveDate { get; set; }
        public int? Public { get; set; }
    }
}
