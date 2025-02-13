using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class AccountsEntity
    {
        [Key]
        public int Id { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public string Domain { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public string Tel { get; set; }
        public string CompanyName { get; set; }
        public string CompanyAddresss { get; set; }
        public int? Administrator { get; set; }
        public DateTime? JoinDate { get; set; }
    }
}
