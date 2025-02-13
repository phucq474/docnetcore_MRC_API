using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class ExtraPhotoEntity
    {
        [Key]
        public int Id { get; set; }
        public int? ShopId { get; set; }
        public int? TakenDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? isDelete { get; set; }
        public int? EmployeeId { get; set; }
        public string DvCode { get; set; }
        public string PhotoURL { get; set; }
    }
}
