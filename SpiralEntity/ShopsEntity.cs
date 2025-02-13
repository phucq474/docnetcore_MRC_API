using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    public class ShopsEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int? CustomerId { get; set; }
        public int? ChannelId { get; set; }
        public string ShopCode { get; set; }
        public string ShopName { get; set; }
        public string Address { get; set; }
        public int ProvinceId { get; set; }
        public Decimal? Latitude { get; set; }
        public Decimal? Longitude { get; set; }
        public int? Accuracy { get; set; }
        public int Status { get; set; }
        public DateTime? ClosedDate { get; set; }
        public int? FormatId { get; set; }
        public int? Frequency { get; set; }
        public int? IsDelete { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }

    }
}
