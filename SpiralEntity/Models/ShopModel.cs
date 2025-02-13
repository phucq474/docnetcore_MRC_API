namespace SpiralEntity.Models
{
    public class ShopModel
    {
        public int? SupplierId { get; set; }
        public int? CustomerId { get; set; }
        public int? ChannelId { get; set; }
        public string ShopCode { get; set; }
        public string ShopName { get; set; }
        public string Address { get; set; }
        public int ProvinceId { get; set; }
        public decimal? Latitude { get; set; }
        public decimal? Longitude { get; set; }
        public int? Accuracy { get; set; }
        public string ClosedDate { get; set; }
        public int? Frequency { get; set; }
        public string Status { get; set; }
        public string StoreType { get; set; }
        public string CustomerCode { get; set; }
    }
}