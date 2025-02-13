using System;

namespace SpiralEntity.Models
{
    public class UserPagePermissionModel
    {
        public int Id { get; set; }
        public int ParentId { get; set; }
        public string ParentTitle { get; set; }
        public string MenuTitle { get; set; }
        public Boolean View { get; set; }
        public Boolean Create { get; set; }
        public Boolean Edit { get; set; }
        public Boolean Delete { get; set; }
        public Boolean Export { get; set; }
        public Boolean Import { get; set; }
    }
}