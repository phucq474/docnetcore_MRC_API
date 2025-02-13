using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
  public  class SpiralFormStatisticalContext:DataContext
    {
        public async Task<DataTable> GetList(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Statistical.GetList]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetById(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Statistical.GetById]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetByQuestion(int AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[SpiralForm.Statistical.GetByQuestion]", AccountId, UserId, Json);
        }
    }
}
