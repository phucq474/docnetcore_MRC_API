using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
namespace SpiralEntity
{
    [Table("UserPages")]
    public class UserPagesEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long Id { set; get; }
        public int UserId { get; set; }
        public int MenuId { get; set; }
        public Boolean View { get; set; }
        public Boolean Create { get; set; }
        public Boolean Edit { get; set; }
        public Boolean Delete { get; set; }
        public Boolean Export { get; set; }
        public Boolean Import { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}
