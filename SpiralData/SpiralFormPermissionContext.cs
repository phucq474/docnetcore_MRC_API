using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
   public class SpiralFormPermissionContext : DataContext
    {
        public async Task<DataTable> GetList(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Permission.GetList]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetById(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Permission.GetById]", AccountId, UserId, Json);
        }
        public async Task<int> Update(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[SpiralForm.Permission.Update]", AccountId, UserId, Json);
        }
    }
}
