using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IReportService
    {
        Task<DataTable> GetList(int accountId, int userId);
        Task<DataTable> VNM_AddressSurvey_Export(int AccountId, int UserId);
        Task<DataTable> Report_OOS_Fonterra_Target(int accountId, int userId, string jsonData);
        Task<DataSet> Report_OOS_Fonterra_RAW(int accountId, int userId, string jsonData);
        Task<DataTable> Report_OOS_Fonterra_DATA(int accountId, int userId, string jsonData);
        Task<DataTable> Report_OOS_Fonterra_DATA_QC(int accountId, int userId, string jsonData);
        Task<DataTable> Report_OOS_Fonterra_ByKAS(int accountId, int userId, string jsonData);
        Task<DataTable> Report_New_Customer_Fonterra_RAW(int accountId, int userId, string jsonData);
        Task<DataTable> Report_New_Customer_Fonterra_Total(int accountId, int userId, string jsonData);
        Task<DataSet> Report_Sales_Report_FTR(int accountId, int userId, string jsonData);
        Task<DataTable> Report_OOS_Fonterra_ByAcc(int accountId, int userId, string jsonData);
        Task<DataTable> Report_Store_Cover_Fonterra_RAW(int accountId, int userId, string jsonData);
        Task<DataTable> Report_Store_Cover_Fonterra_LLV(int accountId, int userId, string jsonData);
        Task<DataSet> Report_Store_Cover_Fonterra_KAS(int accountId, int userId, string jsonData);
        Task<DataSet> Report_Store_Cover_Fonterra_CStore(int accountId, int userId, string jsonData);
        Task<DataSet> Report_OSA_Fonterra(int accountId, int userId, string jsonData);
        Task<DataSet> Report_PLANOGRAM_Fonterra_TK(int accountId, int userId, string jsonData);
        Task<DataSet> Report_OSA_MRC_TotalMT(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_OSA_MRC_OSAByCus(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_OSA_MRC_StoreNon(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataSet> Report_OSA_MRC_OSAByDate(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_OSA_MRC_OSAByBrand(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_OSA_MRC_OSAByCate(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_ATTENDANT_MRC_SumPG(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_ATTENDANT_MRC_ByCus(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate);
        Task<DataTable> Report_ATTENDANT_MRC_ByLoca(string fromdate, string todate);
        Task<DataTable> Promotion_Raw(int accountId, int userId, string jsonData);
        Task<DataSet> Promotion_ByCustomer(int accountId, int userId, string jsonData);
        Task<DataTable> Promotion_Summary(int accountId, int userId, string jsonData);
    }
    public class ReportService : IReportService
    {
        private readonly ReportContext _context;
        public ReportService(ReportContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int accountId, int userId)
        {
            return await _context.GetList(accountId, userId);
        }
        public async Task<DataTable> VNM_AddressSurvey_Export(int AccountId, int UserId)
        {
            return await _context.VNM_AddressSurvey_Export(AccountId, UserId);
        }
        public async Task<DataTable> Report_OOS_Fonterra_Target(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OOS_Fonterra_Target(accountId, userId, jsonData);
        }
        public async Task<DataSet> Report_OOS_Fonterra_RAW(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OOS_Fonterra_RAW(accountId, userId, jsonData);
        }
        public async Task<DataTable> Report_OOS_Fonterra_DATA(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OOS_Fonterra_DATA(accountId, userId, jsonData);
        }
        public async Task<DataTable> Report_OOS_Fonterra_DATA_QC(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OOS_Fonterra_DATA_QC(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_OOS_Fonterra_ByKAS(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OOS_Fonterra_ByKAS(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_New_Customer_Fonterra_RAW(int accountId, int userId, string jsonData)
        {
            return await _context.Report_New_Customer_Fonterra_RAW(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_New_Customer_Fonterra_Total(int accountId, int userId, string jsonData)
        {
            return await _context.Report_New_Customer_Fonterra_Total(accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_Sales_Report_FTR(int accountId, int userId, string jsonData)
        {
            return await _context.Report_Sales_Report_FTR(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_OOS_Fonterra_ByAcc(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OOS_Fonterra_ByAcc(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_Store_Cover_Fonterra_RAW(int accountId, int userId, string jsonData)
        {
            return await _context.Report_Store_Cover_Fonterra_RAW(accountId, userId, jsonData);
        }

        public async Task<DataTable> Report_Store_Cover_Fonterra_LLV(int accountId, int userId, string jsonData)
        {
            return await _context.Report_Store_Cover_Fonterra_LLV(accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_Store_Cover_Fonterra_KAS(int accountId, int userId, string jsonData)
        {
            return await _context.Report_Store_Cover_Fonterra_KAS(accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_Store_Cover_Fonterra_CStore(int accountId, int userId, string jsonData)
        {
            return await _context.Report_Store_Cover_Fonterra_CStore(accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_OSA_Fonterra(int accountId, int userId, string jsonData)
        {
            return await _context.Report_OSA_Fonterra(accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_PLANOGRAM_Fonterra_TK(int accountId, int userId, string jsonData)
        {
            return await _context.Report_PLANOGRAM_Fonterra_TK(accountId, userId, jsonData);
        }

        public async Task<DataSet> Report_OSA_MRC_TotalMT(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_OSA_MRC_TotalMT(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_OSAByCus(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_OSA_MRC_OSAByCus(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_StoreNon(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_OSA_MRC_StoreNon(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataSet> Report_OSA_MRC_OSAByDate(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_OSA_MRC_OSAByDate(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_OSAByBrand(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_OSA_MRC_OSAByBrand(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_OSA_MRC_OSAByCate(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_OSA_MRC_OSAByCate(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_ATTENDANT_MRC_SumPG(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_ATTENDANT_MRC_SumPG(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_ATTENDANT_MRC_ByCus(int accountId, int userId, string supId, string province, int? channelId, int? customerId, string shopCode, string employeeCode, int? position, string accountCode, string fromdate, string todate)
        {
            return await _context.Report_ATTENDANT_MRC_ByCus(accountId, userId, supId, province, channelId, customerId, shopCode, employeeCode, position, accountCode, fromdate, todate);
        }

        public async Task<DataTable> Report_ATTENDANT_MRC_ByLoca(string fromdate, string todate)
        {
            return await _context.Report_ATTENDANT_MRC_ByLoca(fromdate, todate);
        }

        public async Task<DataTable> Promotion_Raw(int accountId, int userId, string jsonData)
        {
            return await _context.Promotion_Raw(accountId, userId, jsonData);
        }
        public async Task<DataSet> Promotion_ByCustomer(int accountId, int userId, string jsonData)
        {
            return await _context.Promotion_ByCustomer(accountId, userId, jsonData);
        }
        public async Task<DataTable> Promotion_Summary(int accountId, int userId, string jsonData)
        {
            return await _context.Promotion_Summary(accountId, userId, jsonData);
        }
    }
}
