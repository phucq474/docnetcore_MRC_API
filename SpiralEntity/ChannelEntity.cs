using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class ChannelEntity
    {
        [Key]
        public int Id { get; set; }
        public string ChannelCode { get; set; }
        public string ChannelName { get; set; }
        public string Description { get; set; }
        public int? Order { get; set; }
        public int AccountId { get; set; }
    }
}
