using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SOSListContext : DataContext
    {
        public async Task<DataTable> Filter(int accountId, int UserId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.SOSLists.GetList]", accountId, UserId, jsonData);
        }
        public async Task<DataTable> Export(int accountId, int UserId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.SOSLists.Export]", accountId, UserId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, int UserId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.SOSLists.Update]", accountId, UserId, jsonData);
        }
    }
}
