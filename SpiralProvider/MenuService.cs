using SpiralData;
using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IMenuService
    {
      //  List<MenuModel> GetMenus(int AccountId, int UserId);
        Task<DataTable> Filter(int AccountId, int? position, int? EmployeeId);
        int DisableMenu(int AccountId, int id);
        Task<DataTable> GetParentAccountMenu(int accountId);
        List<MenuEntity> GetListMenus(int accountId);
        List<MenuModel> GetMenus(int? account, int? user);
        Task<DataTable> GetListTopMenus(int accountId, int userId);
        Task<int> InsertMenu(int accountId, string jsonData);
        Task<int> UpdateMenu(int accountId, string jsonData);
        Task<DataTable> FilterAccountMenu(int accountId, int id);
    }
    public class MenuService : IMenuService
    {
        private readonly MenuContext _menuContext;
        
        public MenuService(MenuContext menuContext)
        {
            this._menuContext = menuContext;
        }
        public async Task<DataTable> Filter(int AccountId, int? position, int? EmployeeId)
        {
            return await _menuContext.Filter(AccountId, position, EmployeeId);
        }
        public async Task<int> InsertMenu(int accountId, string jsonData)
        {
            return await _menuContext.InsertMenu(accountId, jsonData);   
        }
        
        public int DisableMenu(int AccountId, int id)
        {
            return _menuContext.DisableMenu(AccountId, id);
        }
        public List<MenuEntity> GetListMenus(int accountId)
        {
            return _menuContext.GetListMenus(accountId);
        }
        public async Task<DataTable> GetParentAccountMenu(int accountId)
        {
            return await _menuContext.GetParentAccountMenu(accountId);
        }
        public List<MenuEntity> ListMenu()
        {
            return _menuContext.Menus.ToList();
        }
        public async Task<int> UpdateMenu(int accountId, string JsonData)
        {
            return await _menuContext.UpdateMenu(accountId, JsonData);  
        }
        public List<MenuModel> GetMenus(int? account, int? user)
        {
            var data = _menuContext.GetMenus(account, user);
            if(data != null)
            {
                return data.ToList();
            }
            return null;
        }
        public async Task<DataTable> GetListTopMenus(int accountId, int userId)
        {
            return await _menuContext.GetListTopMenus(accountId, userId);
        }
        public async Task<DataTable> FilterAccountMenu(int accountId, int id)
        {
            return await _menuContext.FilterAccountMenu(accountId, id);
        }
    }
}
