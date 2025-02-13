using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    public class AccountMenuEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int MenuId { get; set; }
        public int? ParentId { get; set; }
        public string MenuTitle { get; set; }
        [Column("MenuTitle.vi-VN")]
        public string MenuTitleVN { get; set; }
        public int? SortList { get; set; }
        public string ic_name { get; set; }
        public string virtualUrl { get; set; }
        public DateTime? CreateDate { set; get; }
    }
}
