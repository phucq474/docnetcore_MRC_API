namespace SpiralEntity.Models
{
    public class PromotionModel
    {
        public int? Id { get; set; }
        public int? EmployeeId { get; set; }
        public long? ShopId { get; set; }
        public int? WorkDate { get; set; }
        public int? CategoryId { get; set; }
        public int? CompertitorId { get; set; }
        public int? PromotionId { get; set; }
        public int? FromDate { get; set; }
        public int? ToDate { get; set; }
        public string Content { get; set; }
        public long? ShopIdNew { get; set; }
        public int? WorkDateNew { get; set; }
        public string ListId { get; set; }
    }
}