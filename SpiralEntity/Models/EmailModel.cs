namespace SpiralEntity.Models
{
    public class EmailModel : EmailContentsEntity
    {
        public int? rowIndex { set; get; }
        public string EmployeeName { set; get; }
        public string CreateName { set; get; }
        public string monthYear { set; get; }
        public string SendStatus { set; get; }
        public string Link { get; set; }
    }
}