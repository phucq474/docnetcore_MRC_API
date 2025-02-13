using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralEntity
{
    public class MessengerEntity
    {
        public long? Id { get; set; }
        public int? Remove { get; set; }
        public int? AccountId { get; set; }
        public int? Sended { get; set; }
        public int? CreatedBy { get; set; }
        public int? UserId { get; set; }
        public long? RefId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string TypeReport { get; set; }
        public string HyperLinks { get; set; }
        public DateTime? ActiveDate { get; set; }
        public DateTime? DisableDate { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? NotifyId { get; set; }
    }
}
