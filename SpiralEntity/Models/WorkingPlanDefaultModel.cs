namespace SpiralEntity.Models
{
    public class WorkingPlanDefaultModel
    {
        public int? employeeId { get; set; }
        public int? shopId { get; set; }
        public int? fromDate { get; set; }
        public int? toDate { get; set; }
        public string shiftCode { get; set; }
        public int? monday { get; set; }
        public int? tuesday { get; set; }
        public int? wednesday { get; set; }
        public int? thursday { get; set; }
        public int? friday { get; set; }
        public int? saturday { get; set; }
        public int? sunday { get; set; }
        public long? id { get; set; }
        public string shopCode { get; set; }
        public string shopName { get; set; }
        public string plan { get; set; }
        public int? isInsert { get; set; }
    }
}