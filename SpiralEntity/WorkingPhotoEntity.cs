using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class WorkingPhotoEntity
    {
        [Key]
        public Int32 Id { get; set; }
        public int? DivisionId { get; set; }
        public int? ItemId { get; set; }
        public string Photo { get; set; }
        public int? IsDelete { get; set; }
        public DateTime? CreateDate { get; set; }
        public int? BrandId { get; set; }
        public int? ShopId { get; set; }
        public int? EmployeeId { get; set; }
        public string GUID { get; set; }
        public int? PhotoDate { get; set; }
        public int? ReportId { get; set; }
        public string PhotoMore { get; set; }
        public DateTime? PhotoTime { get; set; }
        public string PhotoType { get; set; }
    }
}
