namespace SpiralEntity.Models
{
    public class MessengerModel : MessengerEntity
    {
        public int rowIndex { set; get; }
        public string EmployeeName { set; get; }
        public string StatusName { set; get; }
        public string Token { set; get; }
        public string EmployeeCode { get; set; }
        public string Position { get; set; }
        public string NotifyGroup { get; set; }
        public string ImageUrl { get; set; }
    }
}