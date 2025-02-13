using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralEntity
{
    public class WorkingResultOOLEntity
    {
        public int Id { get; set; }
        public int? ResultId { get; set; }
        public int? ShopId { get; set; }
        public int DivisionId { get; set; }
        public int? BrandId { get; set; }
        public int ItemId { get; set; }
        public float Value { get; set; }
        public float? Total { get; set; }
        public int? IsConfirm { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? Type { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? EmployeeId { get; set; }
        public DateTime? WorkDate { get; set; }
        public int? QCValue { get; set; }
    }
}
