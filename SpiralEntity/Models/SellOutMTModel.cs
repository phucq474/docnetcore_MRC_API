using System;

namespace SpiralEntity.Models
{
    public class SellOutMTModel
    {
        public Int16? EmployeeId { get; set; }
        public Int16? ShopId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string ShopCode { get; set; }
        public string ShopName { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? AmountMHTT1 { get; set; }
        public decimal? AmountMHTT2 { get; set; }
        public decimal? AmountC { get; set; }
        public decimal? AmountD { get; set; }
        public decimal? TotalTarget { get; set; }
        public decimal? TargetMHTT1 { get; set; }
        public decimal? TargetMHTT2 { get; set; }
        public decimal? TargetC { get; set; }
        public decimal? TargetD { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public DateTime? UpToDate { get; set; }
    }
}