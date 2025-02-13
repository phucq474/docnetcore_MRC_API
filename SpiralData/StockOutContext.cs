using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class StockOutContext : DataContext
    {
        public async Task<DataTable> Filter(int AccountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.StockOut.GetList]", AccountId, userId, jsonData);
        }

        public async Task<DataSet> Export(int AccountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.StockOut.Export]", AccountId, userId, jsonData);
        }

        public async Task<DataTable> Detail(int AccountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.StockOut.GetDetail]", AccountId, jsonData);
        }

        public async Task<DataTable> UpdateDetail(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.StockOut.UpdateDetail]", accountId, userId, jsonData);
        }

        public async Task<DataSet> StockOut_GetTemplate(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.StockOut.Template]", accountId, userId, jsonData);
        }

        public async Task<int> StockOut_Import(int accountId, int userId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.StockOut.Import]", accountId, userId, json);
        }
    }
}
