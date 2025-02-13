using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class WorkingResultSOSContext : DataContext
    {
        public async Task<DataTable> Filter(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingResultSOS.Filter]", userId, jsonData);
        }

        public async Task<DataTable> Detail(string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingResultSOS.Detail]", jsonData);
        }

        public async Task<DataTable> Export(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingResultSOS.Rawdata]", userId, jsonData);
        }

        public async Task<DataTable> Export_Newest(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.WorkingResultSOS.Newest]", userId, jsonData);
        }
    }
}
