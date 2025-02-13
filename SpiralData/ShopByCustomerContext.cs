using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class ShopByCustomerContext : DataContext
    {
        public async Task<int> Delete(int accountId, int userId, string listId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.ShopByCustomer.Delete]", accountId, userId,listId);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.ShopByCustomer.Export]", accountId, userId, jsonData);  
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.ShopByCustomer.Filter]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.ShopByCustomer.Import]", accountId, userId, json);
        }

        public async Task<DataTable> Save(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.ShopByCustomer.Save]", accountId, userId, jsonData);
        }
    }
}
