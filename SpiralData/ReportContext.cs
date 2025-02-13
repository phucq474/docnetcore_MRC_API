using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;
using System.Linq;
namespace SpiralData
{
    public class ReportContext : DataContext
    {
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ReportListEntity>().HasKey("Id");
            modelBuilder.Entity<ReportListEntity>().ToTable("ReportList");
            base.OnModelCreating(modelBuilder);
        }

        public async Task<DataTable> GetList(int accountId, int userId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.GetList]", accountId, userId);
        }
        public async Task<DataTable> VNM_AddressSurvey_Export(int AccountId,int UserId)
        {
            return await this.ExcuteDataTableAsync("[dbo].[AddressSurvey.Export]", AccountId, UserId);
        }
        public async Task<DataTable> Report_OOS_Fonterra_Target(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.OOS.Target]", accountId, userId, jsonData);
        }
        public async Task<DataSet> Report_OOS_Fonterra_RAW(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.OOS.RAW]", accountId, userId,jsonData);
        }
        public async Task<DataTable> Report_OOS_Fonterra_DATA(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.OOS.DATA]", accountId, userId, jsonData);
        }
        public async Task<DataTable> Report_OOS_Fonterra_DATA_QC(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.OOS.DATA_QC]", accountId, userId, jsonData);
        }
        public async Task<DataTable> Report_OOS_Fonterra_ByKAS(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.OOS.ByKAS]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_New_Customer_Fonterra_RAW(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.NewCustomer.RawData]",accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_New_Customer_Fonterra_Total(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.NewCustomer.Total]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_Sales_Report_FTR(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.SellInByEmployees.Incentive]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_OOS_Fonterra_ByAcc(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.OOS.ByAccount]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_Store_Cover_Fonterra_RAW(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.StoreCoverage.Attendants.Raw]", accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_Store_Cover_Fonterra_LLV(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.StoreCoverage.WorkingPlan.LLV]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_Store_Cover_Fonterra_KAS(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.StoreCoverage.KAS]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_Store_Cover_Fonterra_CStore(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.StoreCoverage.CoverStore]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_OSA_Fonterra(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.OSA.RawData]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_PLANOGRAM_Fonterra_TK(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.POG.TK]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_OSA_MRC_TotalMT(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Report.OSA.Total.V2]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_OSAByCus(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.OSA.SummaryByCustomer.V2]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_StoreNon(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.OSA.Non]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataSet> Report_OSA_MRC_OSAByDate(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataSetAsync("[dbo].[Report.OSA.ByCustomer.V2]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_OSAByBrand(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.OSA.ByBrand.V2]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_OSAByCate(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.OSA.ByCat.V2]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_ATTENDANT_MRC_SumPG(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.Attendant.SummaryPG]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_ATTENDANT_MRC_ByCus(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.Attendant.ByCustomerPG]", accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_ATTENDANT_MRC_ByLoca(string fromdate, string todate)
        {
            return await this.ExcuteDataTableAsync("[dbo].[Report.Daily.PG.Attendant.WP]", fromdate, todate);
        }

        public async Task<DataTable> Promotion_Raw(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.Promotion.Raw]", accountId, userId, json);
        }
        public async Task<DataSet> Promotion_ByCustomer(int accountId, int userId, string json)
        {
            return await this.ExcuteDataSetAsync("[dbo].[V2.Report.Promotion.ByCustomer]", accountId, userId, json);
        }
        public async Task<DataTable> Promotion_Summary(int accountId, int userId, string json)
        {
            return await this.ExcuteDataTableAsync("[dbo].[V2.Report.Promotion.Summary]", accountId, userId, json);
        }
    }
    
}
