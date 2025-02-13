using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    public class UsersEntity
    {
        [Key]
        public int EmployeeId { get; set; }
        [Required]
        [StringLength(50)]
        public string Username { set; get; }
        [Required]
        public string Password { set; get; }
        public DateTime? LastLoginDate { set; get; }
        public DateTime? LastPasswordChangedDate { set; get; }
        public DateTime? LastLockoutDate { set; get; }
        public int? Status { set; get; }
        public DateTime? CreateDate { set; get; }
        public bool? IsAdmin { set; get; }
        public int AccountId { get; set; }
        [InverseProperty("User")]
        public EmployeesEntity Employee { set; get; }
    }
}
