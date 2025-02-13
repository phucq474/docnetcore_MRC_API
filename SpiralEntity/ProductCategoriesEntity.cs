using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    public class ProductCategoriesEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int DivisionId { get; set; }
        public string Division { get; set; }
        public int? BrandId { get; set; }
        public string Brand { get; set; }
        [Column("Brand.vi-VN")]
        public string BrandVN { get; set; }
        public int? CategoryId { get; set; }
        public string Category { get; set; }
        [Column("Category.vi-VN")]
        public string CategoryVN { get; set; }
        public int? SubCatId { get; set; }
        public string SubCategory { get; set; }
        [Column("SubCategory.vi-VN")]
        public string SubCategoryVN { get; set; }
        public int? VariantId { get; set; }
        public string Variant { get; set; }
        public int? SortList { get; set; }
        public DateTime? CreateDate { get; set; }       
    }
}
