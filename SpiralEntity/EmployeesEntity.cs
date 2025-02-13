using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SpiralEntity
{
    public class EmployeesEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }
        public int AccountId { set; get; }
        public int? DepartmentId { get; set; }
        public string EmployeeCode { get; set; }
        public int? ParentId { get; set; }
        public string LastName { get; set; }
        public string FisrtName { get; set; }
        public string FullName { get; set; }
        public int? Gender { get; set; }
        public int? Marital { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public DateTime? Birthday { get; set; }
        public string IdentityCardNumber { get; set; }
        public DateTime? IdentityCardDate { get; set; }
        public string IdentityCardBy { get; set; }
        public string Address { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Barcode { get; set; }
        public string ImageUrl { get; set; }
        public int? TypeId { get; set; }
        public int? Status { get; set; }
        public string DeviceAddress { get; set; }
        public int? CheckIMEI { get; set; }
        //public string IMEI { get; set; }
        public int? WorkingStatus { get; set; }
        public DateTime? WorkingDate { get; set; }
        public DateTime? ResignedDate {get; set;}
        public string Note { get; set; }
        public DateTime? CreatedDate { get; set; }
        public UsersEntity User { get; set; }
        //public string TemporaryAddress { get; set; }
    }
}
