using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class StockoutTargetContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.StockoutTarget.Filter]", accountId, jsonData);
        }

        public async Task<DataTable> Detail(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.StockoutTarget.Detail]", accountId, jsonData);
        }

        public async Task<int> Insert(int accountId, int userId, string listCustomer, string listProduct, string fromDate, string toDate)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.StockoutTarget.Insert]", accountId, userId, listCustomer, listProduct, fromDate, toDate);
        }
        public async Task<int> Update(int accountId, string JsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.StockoutTarget.Update]", accountId, JsonData);
        }

        public async Task<int> Delete(string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.StockoutTarget.Delete]", jsonData);
        }

        public async Task<DataTable> Export(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.StockoutTarget.Rawdata]", accountId, jsonData);
        }
    }
}
