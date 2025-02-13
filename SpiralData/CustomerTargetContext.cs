using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class CustomerTargetContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.CustomerTarget.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Insert(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.CustomerTarget.Insert]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Update(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.CustomerTarget.Update]", accountId, userId, jsonData);
        }

        public async Task<int> Delete(int accountId, int userId, int id)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.CustomerTarget.Delete]", accountId, userId, id);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.CustomerTarget.Export]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.CustomerTarget.Import]", accountId, userId, json);
        }
    }

}
