using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name:"Banks")]
    public class BankEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id{ set; get; } 
        public string BankName { set; get; }
        [Column(name:"BankName.vi-VN")]
        public string BankNameVN { set; get; }
        public string BankAlias { set; get; }
    }
}
