using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class ProductPriceContext : DataContext
    {
        public async Task<DataTable> Filter(string JsonData ,int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[ProductPrice.GetList]", JsonData, accountId);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.ProductPrice.Insert]", accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.ProductPrice.Update]", accountId, jsonData);
        }
        public async Task<DataTable> Delete(int id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.ProductPrice.Delete]", id);
        }
        public async Task<DataTable> Save(string Action, string JsonData, int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[ProductPrice.Save]", Action, JsonData, accountId);
        }
        //public async Task<DataSet> Export(int accountId, string jsonData)
        //{
        //    return await this.ExcuteDataSetAsync("[dbo].[VNM.ProductPrice.Export]", accountId, jsonData);
        //}
        public async Task<DataSet> Export(int accountId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[ProductPrice.Export]", accountId, jsonData);
        }
        //public async task<int> import(int accountid, string jsondata)
        //{
        //    return await this.excutenonqueryasync("[dbo].[vnm.productprice.import]", accountid, jsondata);
        //}
        public async Task<int> Import(int accountId, string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[ProductPrice.Import]", accountId, jsonData);
        }
    }
}
