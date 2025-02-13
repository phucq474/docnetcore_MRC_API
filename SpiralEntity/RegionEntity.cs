using System;
using System.Collections.Generic;
using System.Text;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpiralEntity
{
    [Table("Region")]
    public class RegionEntity
    {
        [Key]
        public int Id { get; set; }
        public int AreaId { get; set; }
        public string AreaName { get; set; }
        public int? RegionId { get; set; }
        public string RegionName { get; set; }
        public int ProvinceId { get; set; }
        public string ProvinceName { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int AccountId { get; set; }
        public int? OrderBy { get; set; }
        public int? DistrictId { get; set; }
        public string DistrictName { get; set; }
        public int? TownId { get; set; }
        public string TownName { get; set; }
        public string ProvinceCode { get; set; }
    }
}
