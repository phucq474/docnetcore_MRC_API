using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class ApproachContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Approach.GetList]", accountId, userId, jsonData);
        }

        public async Task<DataTable> GetDetail(int accountId, int id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Approach.Detail]", accountId, id);
        }

        public async Task<DataTable> Export_Rawdata(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Approach.RawData]", accountId, userId, jsonData);
        }
    }
}
