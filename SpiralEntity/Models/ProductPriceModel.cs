namespace SpiralEntity.Models
{
    public class ProductPriceModel
    {
        public string CategoryCode { get; set; }
        public string CategoryVN { get; set; }
        public string SubCatagoryVN { get; set; }
        public string ProductCode { get; set; }
        public string ProductNameVN { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
        public decimal? Price { get; set; }
        public long ProductId { get; set; }
        public int PriceId { get; set; }
        public decimal? PriceNPD { get; set; }
        public int? FromDate { get; set; }
        public int? ToDate { get; set; }
        public int? CategoryId { get; set; }
        public int? SubCategoryId { get; set; }
    }
}