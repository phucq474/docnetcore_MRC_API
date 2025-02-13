using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralEntity
{
    public class OOLTargetsEntity
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int ShopId { get; set; }
        public int DivisionId { get; set; }
        public int? BrandId { get; set; }
        public string Brand { get; set; }
        public int LocationId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? Target { get; set; }
        public int? OrderBy { get; set; }
        public int? Status { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? Type { get; set; }
    }
}
