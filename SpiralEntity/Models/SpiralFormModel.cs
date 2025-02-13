namespace SpiralEntity.Models
{
    public class SpiralFormModel : SpiralFormEntity
    {
        public int? EmployeeId { get; set; }
        public string Employees { get; set; }
        public long? ShopId { get; set; }
        public string Shops { get; set; }
        public int? WorkDate { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string ShopCode { get; set; }
        public string ShopName { get; set; }
        public string Question { get; set; }
        public int? QuestionId { get; set; }
        public int? QuestionType { get; set; }
        public string Answer { get; set; }
        public long? RowNum { get; set; }
    }
}