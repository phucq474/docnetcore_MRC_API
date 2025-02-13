using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SOSResultContext : DataContext
    {
        public async Task<DataTable> GetList(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.SOSResult.GetList]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetDetail(string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.SOSResult.GetDetail]", Json);
        }
        public async Task<DataSet> Export(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.SOSResult.Export]", AccountId, UserId, Json);
        }
    }
}
