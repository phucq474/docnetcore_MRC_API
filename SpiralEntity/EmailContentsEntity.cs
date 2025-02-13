using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "EmailContent")]
    public class EmailContentsEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }
        public string Replyto { set; get; }
        public string To { set; get; }
        public string Cc { set; get; }
        public string Subtitle { set; get; }
        public string Body { set; get; }
        public string Signature { get; set; }
        public DateTime? SentDate { set; get; }
        public DateTime? CreatedDate { set; get; }
        public int? Status { set; get; }
        public int CreatedBy { set; get; }
        public string Error { get; set; }
    }
}
