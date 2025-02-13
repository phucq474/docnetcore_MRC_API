using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
   public class MenuEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int? ParentId { get; set; }
        public string MenuTitle { get; set; }
        [Column("MenuTitle.Vi-VN")]
        public string MenuTitleVN { get; set; }
        public string MenuUrl { get; set; }
        public string MenuCss { get; set; }
        public string MenuIcon { get; set; }
        public int? DisplayOrder { get; set; }
        public int? Status { get; set; }
        public Boolean IsDisplay { get; set; }
        public string virtualUrl { get; set; }
        public string Menu => string.Format("{0} - {1}", MenuTitle, virtualUrl);  
    }
}
