using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class TargetCoverContext : DataContext
    {
        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.TargetCover.Export]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.TargetCover.Import]", accountId, userId, json);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.TargetCover.Filter]", accountId, userId, jsonData);
        }

        public async Task<int> Delete(int accountId, int userId, int idDelete)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.TargetCover.Delete]", accountId, userId, idDelete);
        }

        public async Task<int> Update(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.TargetCover.Update]", accountId, userId, jsonData);
        }
    }
}
