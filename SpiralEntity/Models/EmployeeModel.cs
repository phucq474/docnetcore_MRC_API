using System;

namespace SpiralEntity.Models
{
    public class EmployeeModel
    {
        public int? Id { set; get; }
        public string EmployeeCode { get; set; }
        public string LastName { get; set; }
        public string FisrtName { get; set; }
        public string FullName { get; set; }
        public int? Gender { get; set; }
        public int? Marital { get; set; }
        public string Email { get; set; }
        public string Mobile { get; set; }
        public DateTime? Birthday { get; set; }
        public int? WorkingStatusId { get; set; }
        public DateTime? WorkingDate { get; set; }
        public DateTime? ResignedDate { get; set; }
        public string IdentityCardNumber { get; set; }
        public DateTime? IdentityCardDate { get; set; }
        public string IdentityCardBy { get; set; }
        public string ImageUrl { get; set; }
        public string Address { get; set; }
        public string TemporaryAddress { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public int? Status { get; set; }
        public int? TypeId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string WorkingStatus { get; set; }
        public string Position { get; set; }
        public DateTime? StartDate { get; set; }
        public string OldCode { get; set; }

        #region Parent

        public int? ParentId { get; set; }
        public string ParentName { get; set; }
        public int? FromDateParent { get; set; }
        public int? ToDateParent { get; set; }

        #endregion Parent

        #region EmployeeWorking

        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public DateTime? ActualDate { get; set; }
        public string MaternityComment { get; set; }
        public int? MaternityStatus { get; set; }
        public bool? IsDelete { get; set; }

        #endregion EmployeeWorking

        #region health

        public string BHYT { get; set; }
        public DateTime? DateVaccin1 { get; set; }
        public string TypeVaccin1 { get; set; }
        public DateTime? DateVaccin2 { get; set; }
        public string TypeVaccin2 { get; set; }
        public string VaccinStatus { get; set; }
        public string ReasonNoVaccin { get; set; }

        #endregion health

        #region IMEI

        public string IMEI { get; set; }
        public int? CheckIMEI { get; set; }
        public string imei0 { get; set; }
        public string imei1 { get; set; }
        public string imei2 { get; set; }

        #endregion IMEI
    }
}