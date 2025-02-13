using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class LanguagesEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string Name { get; set; }
        public string Culture { get; set; }
        public string Flag { get; set; }
        public Boolean? Published { get; set; }
        public int? DisplayOrder { get; set; }
    }
}
