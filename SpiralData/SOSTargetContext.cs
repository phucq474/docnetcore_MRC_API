using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SOSTargetContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.SOSTarget.Filter]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Export(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.SOSTarget.Export]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.SOSTarget.Import]", accountId, userId, json);
        }
    }
}
