using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class MobileMenuContext : DataContext
    {
        public async Task<DataTable> GetList()
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Mobile.Menu.GetList]");
        }
        public async Task<DataTable> GetListMenu(int accountId, int userId, int? position)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MobileMenu.GetList]", accountId, userId, position);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MobileMenu.Filter]", accountId, userId, json);
        }

        public async Task<DataTable> Insert(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MobileMenu.Insert]", accountId, userId, json);
        }
        public async Task<DataTable> Update(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[MobileMenu.Update]", accountId, userId, json);
        }
        public async Task<int> Delete(int accountId, int userId, int id)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[MobileMenu.Delete]", accountId, userId, id);
        }
    }
}
