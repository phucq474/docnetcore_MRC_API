using System;

namespace SpiralEntity.Models
{
    public class UsersModel
    {
        public int AccountId { get; set; }
        public int Id { get; set; }
        public int? PositionId { get; set; }
        public string Position { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { set; get; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public string Token { get; set; }
        public string Type { get; set; }
        public string EmployeeCode { get; set; }
        public string AccountName { get; set; }
        public int? ExpriedDate { set; get; }
        public string Error { get; set; }
        public int? ParentId { get; set; }
        public string MenuList { set; get; }
        public string LangueList { set; get; }
        public string GroupPosition { get; set; }
        public bool? IsAdmin { get; set; }
        public int EmployeeId { get; set; }
        public DateTime? LastPasswordChangedDate { get; set; }
    }
}