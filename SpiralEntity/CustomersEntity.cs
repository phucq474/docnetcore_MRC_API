using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class CustomersEntity
    {
        [Key]
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string CustomerCode { get; set; }
        public string CustomerName { get; set; }
        public int? ParentId { get; set; }
        public string ContactName { get; set; }
        public string ContactTitle { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public int? Account_Id { get; set; }
        public string AccountCode { get; set; }
        public string AccountName { get; set; }
        public int? Status { get; set; }
        public int? OrderBy { get; set; }
        public string Name => string.Format("{0} - {1}", CustomerName, AccountName);
    }
}
