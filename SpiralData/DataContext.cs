using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Reflection;
using System.Data;
using System.Linq;
using System.Configuration;
using System.Data.Common;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using SpiralEntity.Models;
using Microsoft.Data.SqlClient;

namespace SpiralData
{
    public class DataContext : DbContext
    {

        protected DataContext()
        {

        }   
        public string ConnectionString = "Data Source=210.245.20.245,49718;Encrypt=False ;Initial Catalog=MaricoMT;User ID=MaricoWeb;Password=Marico2018@";
        //public string ConnectionString = "Data Source=WIN-JHN25128BVU\\SQL245SPI;Encrypt=False ;Initial Catalog=MaricoMT;User ID=MaricoWeb;Password=Marico2018@";

        public DataContext(string connectionString)
        {
            this.ConnectionString = connectionString;
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(ConnectionString);
            }
            base.OnConfiguring(optionsBuilder);
        }
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {

        }
        public virtual DbSet<LogsEntity> Logs { set; get; }
        public virtual DbSet<PhotoEntity> Photo { set; get; }
        public virtual DbSet<BankEntity> Banks { set; get; }
        public virtual DbSet<DocumentsEntity> Document { get; set; }
        public virtual DbSet<EmployeesEntity> Employees { get; set; }
        public virtual DbSet<UsersEntity> Users { get; set; }
        public virtual DbSet<EmployeeTypesEntity> EmployeeTypes { get; set; }
        public virtual DbSet<AccountsEntity> Accounts { get; set; }
        public virtual DbSet<AccountDomainsEntity> AccountDomains { get; set; }
        public virtual DbSet<ShopsEntity> Shops { get; set; }
        public virtual DbSet<RegionEntity> Region { get; set; }
        public virtual DbSet<CustomersEntity> Customers { get; set; }
        public virtual DbSet<MasterListDataEntity> MasterListDatas { get; set; }
        public virtual DbSet<MenuEntity> Menus { get; set; }
        public virtual DbSet<AccountMenuEntity> AccountMenus { get; set; }
        public virtual DbSet<ShiftListEntity> ShiftLists { get; set; }
        public virtual DbSet<ReportListEntity> ReportLists { get; set; }
        // public virtual DbSet<UserPageEntity> UserPages { get; set; }
        public virtual DbSet<ProductsEntity> Products { get; set; }
        public virtual DbSet<ProductCategoriesEntity> ProductCategories { get; set; }
        public virtual DbSet<CompetitorEntity> Competitors { get; set; }
        public virtual DbSet<MessengerEntity> Messengers { get; set; }
        public virtual DbSet<UserPermissionEntity> UserPermissions { get; set; }
        public virtual DbSet<CalendarEntity> Calendars { get; set; }
        public virtual DbSet<LanguageResourcesEntity> LanguageResources { get; set; }
        public virtual DbSet<UserPagesEntity> UserPages { get; set; }
        public virtual DbSet<PromotionEntity> Promotion { get; set; }
        public virtual DbSet<ShiftTimeEntity> ShiftTime { get; set; }
        public virtual DbSet<ChannelEntity> Channel { get; set; }
        public virtual DbSet<DepartmentEntity> Department { get; set; }
        public virtual DbSet<DocumentsEntity> Documents { get; set; }
        public virtual DbSet<EmailContentsEntity> EmailContents { get; set; }
        public virtual DbSet<EmployeeMarketsEntity> EmployeeMarkets { get; set; }
        public virtual DbSet<EmployeeShopsEntity> EmployeeShops { get; set; }
        public virtual DbSet<EmployeeTargetEntity> EmployeeTarget { get; set; }
        public virtual DbSet<EmployeeWorkingEntity> EmployeeWorking { get; set; }
        public virtual DbSet<ExtraPhotoEntity> ExtraPhoto { get; set; }
        public virtual DbSet<LanguagesEntity> Languages { get; set; }
        public virtual DbSet<NPDListsEntity> NPDLists { get; set; }
        public virtual DbSet<ProductPriceEntity> ProductPrices { get; set; }
        public virtual DbSet<SuppliersEntity> Suppliers { get; set; }
        public virtual DbSet<WorkingPlanDefaultEntity> WorkingPlanDefaults { get; set; }
        public virtual DbSet<OOLListsEntity> OOLLists { get; set; }
        public virtual DbSet<OOLTargetsEntity> OOLTargets { get; set; }
        public virtual DbSet<OSAResultsEntity> OSAResults { get; set; }
        public virtual DbSet<WorkingResultOOLEntity> WorkingResultOOL { get; set; }
        public virtual DbSet<WorkingPhotoEntity> WorkingPhoto { get; set; }
        public virtual DbSet<PromotionResultsEntity> PromotionResults { get; set; }
        public virtual DbSet<EmployeeAnnualLeaveEntity> EmployeeAnnualLeave { get; set; }
        public virtual DbSet<TaskListEntity> TaskLists { get; set; }
        #region DbComment
        public async Task<IList<TEntity>> SqlRawAsync<TEntity>(string ProcduceName, params object[] parameter) where TEntity : class
        {
            using (DbConnection dbConnection = this.Database.GetDbConnection())
            {
                if (dbConnection.ConnectionString == "")
                    dbConnection.ConnectionString = ConnectionString;
                if (dbConnection.State != ConnectionState.Open)
                    await dbConnection.OpenAsync();
                using (DbCommand db = dbConnection.CreateCommand())
                {
                    if (parameter != null)
                    {
                        var SqlPrameter = Helper.GetSqlParameters(dbConnection, ProcduceName, parameter);
                        if (SqlPrameter != null)
                            db.Parameters.AddRange(SqlPrameter);
                    }
                    db.CommandText = ProcduceName;
                    db.CommandType = CommandType.StoredProcedure;
                    DbDataReader reader = db.ExecuteReader();
                    var results = await Task.Run(() => Helper.MapToList<TEntity>(reader));
                    reader.Close();
                    return results;
                }
            }
        }
        public IList<TEntity> SqlRaw<TEntity>(string ProcduceName, params object[] parameter) where TEntity : class
        {
            using (DbConnection dbConnection = this.Database.GetDbConnection())
            {
                if (String.IsNullOrEmpty(dbConnection.ConnectionString) || String.IsNullOrWhiteSpace(dbConnection.ConnectionString))
                    dbConnection.ConnectionString = ConnectionString;
                if (dbConnection.State != ConnectionState.Open)
                    dbConnection.Open();
                using (DbCommand db = dbConnection.CreateCommand())
                {
                    if (parameter != null)
                    {
                        var SqlPrameter = Helper.GetSqlParameters(dbConnection, ProcduceName, parameter);
                        if (SqlPrameter != null)
                            db.Parameters.AddRange(SqlPrameter);
                    }
                    db.CommandText = ProcduceName;
                    db.CommandType = CommandType.StoredProcedure;
                    DbDataReader reader = db.ExecuteReader();
                    var results = Helper.MapToList<TEntity>(reader);
                    reader.Close();
                    return results;
                }
            }
        }
        public async Task<int> ExcuteNonQueryAsync(string ProcduceName, params object[] parameter)
        {
            using (DbConnection dbConnection = this.Database.GetDbConnection())
            {
                if (String.IsNullOrEmpty(dbConnection.ConnectionString) || String.IsNullOrWhiteSpace(dbConnection.ConnectionString))
                    dbConnection.ConnectionString = ConnectionString;
                if (dbConnection.State != ConnectionState.Open)
                    await dbConnection.OpenAsync();
                using (DbCommand db = dbConnection.CreateCommand())
                {
                    if (parameter != null)
                    {
                        var SqlPrameter = Helper.GetSqlParameters(dbConnection, ProcduceName, parameter);
                        if (SqlPrameter != null)
                            db.Parameters.AddRange(SqlPrameter);
                    }
                    db.CommandText = ProcduceName;
                    db.CommandType = CommandType.StoredProcedure;
                    var reader = await db.ExecuteNonQueryAsync();
                    await db.DisposeAsync();
                    await dbConnection.CloseAsync();
                    return reader;
                }
            }
        }
        public int ExcuteNonQuery(string ProcduceName, params object[] parameter)
        {
            using (DbConnection dbConnection = this.Database.GetDbConnection())
            {
                if (String.IsNullOrEmpty(dbConnection.ConnectionString) || String.IsNullOrWhiteSpace(dbConnection.ConnectionString))
                    dbConnection.ConnectionString = ConnectionString;
                if (dbConnection.State != ConnectionState.Open)
                    dbConnection.Open();
                using (DbCommand db = dbConnection.CreateCommand())
                {
                    if (parameter != null)
                    {
                        var SqlPrameter = Helper.GetSqlParameters(dbConnection, ProcduceName, parameter);
                        if (SqlPrameter != null)
                            db.Parameters.AddRange(SqlPrameter);
                    }
                    db.CommandText = ProcduceName;
                    db.CommandType = CommandType.StoredProcedure;
                    var reader = db.ExecuteNonQuery();
                    return reader;
                }
            }
        }
        public async Task<DataSet> ExcuteDataSetAsync(string ProcduceName, params object[] parameter)
        {
            try
            {
                DataSet dataSet = new DataSet("Results");
                using (SqlConnection conn = new SqlConnection(ConnectionString))
                {
                    if (conn.State != ConnectionState.Open)
                        await conn.OpenAsync();
                    SqlCommand cmd = new SqlCommand(ProcduceName, conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    if (parameter != null)
                    {
                        var sqlParameter = Helper.GetSqlParameters(conn, ProcduceName, parameter);
                        if (sqlParameter != null)
                            cmd.Parameters.AddRange(sqlParameter);
                    }
                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = cmd;
                    da.SelectCommand.CommandTimeout = 90;
                    await Task.Run(() => da.Fill(dataSet));
                    da.Dispose();
                    conn.Close();
                }
                return dataSet;
            }
            catch (Exception ex)
            {
                throw (new Exception(ex.Message));
            }
            finally
            {

            }
        }
        public DataSet ExcuteDataSet(string ProcduceName, params object[] parameter)
        {
            DataSet dataSet = new DataSet("Results");
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
                SqlCommand cmd = new SqlCommand(ProcduceName, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameter != null)
                {
                    var sqlParameter = Helper.GetSqlParameters(conn, ProcduceName, parameter);
                    if (sqlParameter != null)
                        cmd.Parameters.AddRange(sqlParameter);
                }
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = cmd;
                da.Fill(dataSet);
                da.Dispose();
                conn.Close();
            }
            return dataSet;
        }
        public DataTable ExcuteDataTable(string ProcduceName, params object[] parameter)
        {
            DataTable dataTable = new DataTable("tblResult");
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
                SqlCommand cmd = new SqlCommand(ProcduceName, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameter != null)
                {
                    var sqlParameter = Helper.GetSqlParameters(conn, ProcduceName, parameter);
                    if (sqlParameter != null)
                        cmd.Parameters.AddRange(sqlParameter);
                }
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = cmd;
                da.Fill(dataTable);
                da.Dispose();
                conn.Close();
            }
            return dataTable;
        }
        public async Task<DataTable> ExcuteDataTableAsync(string ProcduceName, params object[] parameter)
        {
            DataTable dataTable = new DataTable("tblResult");
            using (SqlConnection conn = new SqlConnection(ConnectionString))
            {
                if (conn.State != ConnectionState.Open)
                    conn.Open();
                SqlCommand cmd = new SqlCommand(ProcduceName, conn);
                cmd.CommandType = CommandType.StoredProcedure;
                if (parameter != null)
                {
                    var sqlParameter = Helper.GetSqlParameters(conn, ProcduceName, parameter);
                    if (sqlParameter != null)
                        cmd.Parameters.AddRange(sqlParameter);
                }
                SqlDataAdapter da = new SqlDataAdapter();
                da.SelectCommand = cmd;
                da.SelectCommand.CommandTimeout = 90;
                await Task.Run(() => da.Fill(dataTable));
                da.Dispose();
                await conn.CloseAsync();
            }
            return dataTable;
        }
        private void AddDbParameter(ref DbCommand db, int AccountId, string JsonData, int UserId)
        {
            IDbDataParameter pAccount = db.CreateParameter();
            IDbDataParameter pJsonParam = db.CreateParameter();
            IDbDataParameter pUser = db.CreateParameter();
            pAccount.ParameterName = "@AccountId";
            pAccount.Value = AccountId;
            pAccount.DbType = DbType.Int32;
            db.Parameters.Add(pAccount);
            //JsonParam
            pJsonParam.ParameterName = "@JsonParam";
            pJsonParam.Value = JsonData;
            pJsonParam.DbType = DbType.String;
            db.Parameters.Add(pJsonParam);
            //UserId
            pUser.ParameterName = "@UserId";
            pUser.Value = UserId;
            pUser.DbType = DbType.Int32;
            db.Parameters.Add(pUser);
        }

        //public async Task<DataTable> ExcuteDataTableAsync(string ProcduceName, int AccountId, string JsonParam, int UserId)
        //{
        //    DataTable dataTable = new DataTable("tblResult");
        //    using (DbConnection conn = this.Database.GetDbConnection())
        //    {
        //        if (conn.State != ConnectionState.Open)
        //            conn.Open();
        //        DbCommand db = null;
        //        using (db = conn.CreateCommand())
        //        {
        //            db.CommandType = CommandType.StoredProcedure;
        //            db.CommandText = ProcduceName;
        //            AddDbParameter(ref db, AccountId, JsonParam, UserId);
        //            var results = await db.ExecuteReaderAsync();
        //            dataTable.Load(results);
        //            await db.DisposeAsync();
        //        }
        //        await conn.CloseAsync();
        //    }
        //    return dataTable;
        //}

        #endregion
    }
}
