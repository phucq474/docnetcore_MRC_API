using System;

namespace SpiralEntity.Models
{
    public class EmployeeDropDownListModel
    {
        public int Id { get; set; }
        public int? ParentId { get; set; }
        public int TypeId { get; set; }
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public string FullName { set; get; }
        public string TypeName { get; set; }
        public string Username { get; set; }
        public string Group { get; set; }
        public int? WorkingStatusId { get; set; }
        public DateTime? WorkingDate { get; set; }
        public DateTime? ResignedDate { get; set; }
    }
}