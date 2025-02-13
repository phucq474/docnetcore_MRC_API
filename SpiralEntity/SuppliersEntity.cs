using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace SpiralEntity
{
    public class SuppliersEntity
    {
        [Key]
        public int Id { get; set; }
        public string SupplierCode { get; set; }
        public string SupplierName { get; set; }
        public int? ParentId { get; set; }
        public string Contact { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Fax { get; set; }
        public string FullName { get; set; }
        public int? Status { get; set; }
        public int? OrderBy { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int? AccountId { get; set; }
    }
}
