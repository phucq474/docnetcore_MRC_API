using System;

namespace SpiralEntity.Models
{
    public class EmployeeShopModel
    {
        public int? ParentId { get; set; }
        public int EmployeeId { get; set; }
        public string EmployeeCode { get; set; }
        public int ShopId { get; set; }
        public string ShopCode { get; set; }
        public int? TS { get; set; }
        public DateTime? FromDateTS { get; set; }
        public DateTime? ToDateTS { get; set; }
        public int? NV { get; set; }
        public DateTime? FromDateNV { get; set; }
        public int TypeId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}