using System;

namespace SpiralEntity.Models
{
    public class SellOutAlphaModel
    {
        public Int16? EmployeeId { get; set; }
        public Int16? ShopId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string ShopCode { get; set; }
        public string ShopName { get; set; }
        public decimal? TotalAmount { get; set; }
        public decimal? AmountSBBAD { get; set; }
        public decimal? AmountSBPS { get; set; }
        public decimal? AmountGroupA { get; set; }
        public decimal? TotalTarget { get; set; }
        public decimal? TargetSBBAD { get; set; }
        public decimal? TargetSBPS { get; set; }
        public decimal? TargetGroupA { get; set; }
        public int? Month { get; set; }
        public int? Year { get; set; }
        public DateTime? UpToDate { get; set; }
    }
}