using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class AccountDomainsEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string Domain { get; set; }
    }
}
