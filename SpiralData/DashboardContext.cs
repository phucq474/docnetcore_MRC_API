using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using SpiralEntity.Models;

namespace SpiralData
{
    public class DashboardContext : DataContext
    {
        public async Task<IList<DashboardModel>> SellOutSummary(int accountId, string data, int employeeId)
        {
            return await this.SqlRawAsync<DashboardModel>("dbo.[V2.Sellout.Summary]", accountId, data, employeeId);
        }

        public async Task<DataTable> Attendant_Byday(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.DashBoard.Attendant.Daily.KQCC]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_ByLeader(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Daily.Leader]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_ToanQuoc(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Daily.ToanQuoc]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Area(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Daily.Area.V2]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_ByLeaderV2(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Daily.Leader.V2]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Status_Area(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Status.Daily.Area.V2]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Status_Leader(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Status.Daily.Leader.V2]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Visit_ST(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Visit.Daily.ST]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Visit_CHTL(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Visit.Daily.CHTL]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Status_CHTL(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Status.Daily.CHTL]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Attendant_Status_ST(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.Attendant.Status.Daily.ST]", accountId, userId, jsonData);
        }

        public async Task<DataSet> OSA(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.OSA.MT]", accountId, userId, jsonData);
        }

        public async Task<DataSet> SOS(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.SOS.MT]", accountId, userId, jsonData);
        }

        public async Task<DataSet> SellOut_MT(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[VNM.DashBoard.SellOut.MT]", accountId, userId, jsonData);
        }

        public async Task<DataSet> AlphaSellArea(int accountId, object userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Alpla.Dashboard.SellArea]", accountId, userId, jsonData);
        }
    }
}
