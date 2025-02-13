namespace SpiralEntity.Models
{
    public class MenuInsertModel
    {
        public int? menuId_m { get; set; }
        public string menuTitle_m { get; set; }
        public string menuUrl_m { get; set; }
        public int displayOrder_m { get; set; }
        public int? parentId_a { get; set; }
        public string ic_name_a { get; set; }
        public string virtualUrl_a { get; set; }
        public int? sortList_a { get; set; }
        public string menuTitleVN_a { get; set; }
    }
}