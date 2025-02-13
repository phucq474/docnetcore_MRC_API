using System;

namespace SpiralEntity.Models
{
    public class OSAPermissionModel
    {
        public string CustomerName { get; set; }
        public int OrderBy { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string ProductCode { get; set; }
        public string ProductName { get; set; }
        public string Barcode { get; set; }
    }
}