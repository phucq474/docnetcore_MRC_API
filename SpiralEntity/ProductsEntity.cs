using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table("Products")]
    public class ProductsEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public int? CategoryId { get; set; }
        public decimal? Price { get; set; }
        public string Barcode { get; set; }
        public decimal? BarrelPrice { get; set; }
        public string BarrelBarcode { get; set; }
        public int? BarrelSize { get; set; }
        public string Unit { get; set; }
        public string Packsize { get; set; }
        public int? OrderBy { get; set; }
        public int? TypeId { get; set; }
        public Boolean? Top { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}
