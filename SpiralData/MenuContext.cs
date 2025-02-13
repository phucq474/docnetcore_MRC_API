using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class MenuContext : DataContext
    {

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuEntity>().HasKey("Id");
            modelBuilder.Entity<MenuEntity>().ToTable("Menus");
            base.OnModelCreating(modelBuilder);
        }
        public async Task<DataTable> Filter(int AccountId, int? position, int? EmployeeId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[UserPermission.GetList]", AccountId, position, EmployeeId);
        }
     
        public List<MenuEntity> GetListMenus(int accountId)
        {
            var data = Menus.Where(m => m.Status == 1).ToList();
            return data;
        }

        public async Task<DataTable> GetParentAccountMenu(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Menus.GetParentAccountMenu]", accountId);
        }

        public async Task<int> InsertMenu(int accountId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("dbo.[Menus.Insert]", accountId, jsonData);
        }

        public int DisableMenu(int accountId, int id)
        {
            return this.ExcuteNonQuery("[dbo].[Menus.Disable]", accountId, id);
        }

        public async Task<int> UpdateMenu(int accountId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[Menus.Update]", accountId, jsonData);
        }
        public IList<MenuModel> GetMenus(int? account, int? user)
        {
            return this.SqlRaw<MenuModel>("[dbo].[Menus.GetList]", account, user);
        }

        public async Task<DataTable> GetListTopMenus(int accountId, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Menus.GetTopMenu]", accountId, userId);
        }
        public async Task<DataTable> FilterAccountMenu(int accountId, int Id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[AccountMenu.Filter]", accountId, Id);
        }
    }
}
