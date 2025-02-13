using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class OOLListsEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string LocationCode { get; set; }
        public string LocationName { get; set; }
        public int? OrderBy { get; set; }
        public int? Status { get; set; }
        public int? IsSnapImage { get; set; }
        public string Type { get; set; }
    }
}
