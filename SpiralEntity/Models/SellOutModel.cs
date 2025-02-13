namespace SpiralEntity.Models
{
    public class SellOutModel
    {
        public string data { get; set; }
        public string Type { get; set; }
        public long? SellOutId { get; set; }
        public int? WorkDate { get; set; }
        public int? EmployeeId { get; set; }
        public long? ShopId { get; set; }
        public int? ProductId { get; set; }
        public string ProductCode { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public string Serial { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerAddress { get; set; }
    }
}