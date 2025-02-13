using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class DashboardIMVContext:DataContext
    {
        #region Sell In
        public async Task<DataSet> SellIn_Total(int accountId, int userId, string json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[IMV.Dashboard.SellIn.TotalSale]", accountId, userId, json);
        }
        #endregion
    }
}
