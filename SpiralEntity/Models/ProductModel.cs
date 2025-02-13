namespace SpiralEntity.Models
{
    public class ProductModel
    {
        public string Division { get; set; }
        public int? DivisionId { get; set; }
        public string Brand { get; set; }
        public string BrandVN { get; set; }
        public int? BrandId { get; set; }
        public int? Id { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public int? CategoryId { get; set; }
        public string BarCode { get; set; }
        public string BarrelBarCode { get; set; }
    }
}