using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class UserPermissionEntity
    {
        public const string ROLE = "ROLE";
        public const string MENU = "MENU";
        public const string MODULE = "MODULE";
        [Key]
        public int Id { get; set; }
        public int EmployeeId { get; set; }
        public int ObjectId { get; set; }
        public string ObjectType { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
