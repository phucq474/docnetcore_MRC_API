using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace SpiralData
{
    public class QCContext : DataContext
    {
        public async Task<DataTable> GetDynamic(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.QC.GetDynamic]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetDetail(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.QC.GetDetail]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetByKPI(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.QC.GetByKPI]", AccountId, UserId, Json);
        }
        public async Task<int> Detail_Update(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[V2.QC.Detail.Update]", AccountId, UserId, Json);
        }
        public async Task<DataSet> Report_Rawdata(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.QC.Report.RawData]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_OSA(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.QC.Report.OSA]", accountId, userId, jsonData);
        }
    }
}
