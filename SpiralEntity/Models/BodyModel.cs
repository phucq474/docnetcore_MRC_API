namespace SpiralEntity.Models
{
    public class BodyModel
    {
        public long? Id { get; set; }
        public int? AccountId { get; set; }
        public int? UserId { get; set; }
        public string token { get; set; }
        public string FromDate { get; set; }
        public string KPIIssue { get; set; }
        public string ToDate { get; set; }
        public string Area { get; set; }
        public string Region { get; set; }
        public string Province { get; set; }
        public string ShopCode { get; set; }
        public string EmployeeCode { get; set; }
        public string QCStatus { get; set; }
        public string Result { get; set; }
        public int? ResultId { get; set; }
        public int? RefId { get; set; }
        public int? EmployeeId { get; set; }
        public long? ShopId { get; set; }
        public int? WorkDate { get; set; }
        public int? DealerId { get; set; }
        public int? SupId { get; set; }
        public int? QCStatusId { get; set; }
        public int? Row { get; set; }
        public int? Page { get; set; }
        public int? Position { get; set; }
        public int? QCPresent { get; set; }
        public int? QCInstall { get; set; }
        public string KPI { get; set; }
        public string Note { get; set; }
        public string Type { get; set; }
        public decimal? QCPrice { get; set; }
        public int? BrandId { get; set; }
        public int? CategoryId { get; set; }
        public string PhotoType { get; set; }
        public string PhotoPath { get; set; }
        public string PhotoTime { get; set; }
        public int EmployeeWorkingId { get; set; }
        public int? WorkingStatusId { get; set; }
        public string ActualDate { get; set; }
        public int? Status { get; set; }
        public string Comment { get; set; }
        public int? IsDelete { get; set; }
        public int EmployeeCategoryId { get; set; }
    }
}