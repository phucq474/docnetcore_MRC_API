using System;

namespace SpiralEntity.Models
{
    public class MenuModel
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int MenuId { get; set; }
        public string MenuTitle { get; set; }
        public string MenuTitleVN { get; set; }
        public string MenuUrl { get; set; }
        public string MenuCss { get; set; }
        public string MenuIcon { get; set; }
        public int? DisplayOrder { get; set; }
        public string Children { get; set; }
        public Boolean IsView { get; set; }
    }
}