using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SellInContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.SellIn.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataTable> GetDetail(int accountId, int userId, int id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.MRC.SellIn.Filter.Detail]", accountId, userId, id);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.MRC.SellIn.Export]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.MRC.SellIn.Import]", accountId, userId, json);
        }

    }
}
