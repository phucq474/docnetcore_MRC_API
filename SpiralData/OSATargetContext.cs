using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class OSATargetContext : DataContext
    {
        public async Task<DataTable> GetList(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OSATarget.GetList]", accountId, userId, jsonData);
        }
        public async Task<DataSet> Export(int accountId,int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.OSATarget.Export]", accountId, userId, jsonData);
        }

        public async Task<DataTable> GetDetail( string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.OSATarget.GetDetail]",  jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.OSATarget.Import]", accountId, userId, jsonData );
        }

        public async Task<int> Delete(int accountId, int userId, string listId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.OSATarget.Delete]", accountId, userId, listId);
        }
    }
}
