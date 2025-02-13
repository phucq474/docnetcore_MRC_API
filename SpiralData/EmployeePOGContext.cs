using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class EmployeePOGContext : DataContext
    {
        public async Task<int> Delete(int accountId, int userId, string listId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[EmployeePOG.Delete]", accountId, userId, listId);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[EmployeePOG.Export]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[EmployeePOG.Filter]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[EmployeePOG.Import]", accountId, userId, json);
        }

        public async Task<DataTable> Save(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[EmployeePOG.Save]", accountId, userId, jsonData);
        }
    }
}
