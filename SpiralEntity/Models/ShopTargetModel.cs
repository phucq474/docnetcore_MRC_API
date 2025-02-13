namespace SpiralEntity.Models
{
    public class ShopTargetModel
    {
        public string ShopCode { get; set; }
        public string EmployeeCode { get; set; }
        public string TargetName { get; set; }
        public int? Visit { get; set; }
        public int? Quantity { get; set; }
        public decimal? Amount { get; set; }
        public int? Year { get; set; }
        public int? Month { get; set; }
    }
}