using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class SellInIMVContext: DataContext
    {
        public async Task<DataTable> GetList(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[IMV.SellIn.GetList]", AccountId, UserId, Json);
        }
        public async Task<int> Import(int AccountId, int UserId, string JsonActual,string JsonTarget)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[IMV.SellIn.Import]", AccountId, UserId, JsonActual,JsonTarget);
        }
        public async Task<DataSet> Export(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[IMV.SellIn.Export]", AccountId, UserId, Json);
        }
        public async Task<DataSet> GetTemplate(int AccountId, int UserId, string Json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[IMV.SellIn.GetTemplate]", AccountId, UserId, Json);
        }
    }
}
