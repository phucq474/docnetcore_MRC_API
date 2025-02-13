using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class ProductPriceEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int? CustomerId { get; set; }
        public int? ShopId { get; set; }
        public int ProductId { get; set; }
        public decimal Price { get; set; }
        public decimal BarrelPrice { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
