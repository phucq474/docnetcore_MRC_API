using System;
using System.Collections.Generic;

namespace SpiralEntity.Models
{
    public class AutoMailsModel
    {
        public string MailTo { get; set; }
        public string MailCc { get; set; }
        public string Subject { get; set; }
        public string Body { get; set; }
        public int MyProperty { get; set; }
        public List<string> File_Attach_Url { get; set; }
        public string ReplyTo { get; set; }
        public DateTime SendDate { get; set; }
        public string Signature { get; set; }
    }
}