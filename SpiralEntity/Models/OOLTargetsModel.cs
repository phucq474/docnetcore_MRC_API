using System;

namespace SpiralEntity.Models
{
    public class OOLTargetsModel
    {
        public int ShopId { get; set; }
        public string ShopCode { get; set; }
        public string Division { get; set; }
        public int DivisionId { get; set; }
        public int? BrandId { get; set; }
        public string Brand { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string LocationName { get; set; }
        public int? Target { get; set; }
        public string TypeName { get; set; }
        public int? Type { get; set; }
    }
}