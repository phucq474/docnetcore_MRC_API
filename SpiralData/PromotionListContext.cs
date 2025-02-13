using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class PromotionListContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.PromotionList.Filter]", accountId, jsonData);
        }

        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.PromotionList.Insert]", accountId, jsonData); 
        }

        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.PromotionList.Update]", accountId, jsonData); 
        }

        public async Task<DataTable> Delete(int id)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.PromotionList.Delete]", id); 
        }

        public async Task<DataSet> Export_PromotionList(int accountId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.PromotionList.Rawdata]", accountId, jsonData); 
        }

        public async Task<int> Import(int accountId, string json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.PromotionList.Import]", accountId, json); 
        }

        public async Task<DataTable> GetDivisionList(int accountId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.ProductCategories.GetListDivision]", accountId);
        }

        public async Task<DataTable> GetListPromotionType(int accountId)
        {
            return await this.ExcuteDataTableAsync("[V2.PromotionList.GetListType]", accountId);
        }
    }
}
