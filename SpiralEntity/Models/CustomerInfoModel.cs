namespace SpiralEntity.Models
{
    public class CustomerInfoModel
    {
        public int EmployeeId { get; set; }
        public string CustomerPhone { get; set; }
        public string CustomerName { get; set; }
        public string CustomerAddress { get; set; }
        public string CustomerDesc { get; set; }
        public float? Lat { get; set; }
        public float? Lng { get; set; }
        public int PlanDate { get; set; }
        public string TypeSave { get; set; }
        public int? CusId { get; set; }
    }
}