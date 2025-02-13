using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Reflection;
using System.Data;
using System.Linq;
//using System.Data.SqlClient;
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
    public static class AuditAndMappingExtensions
    {
        public static bool IsPrimitiveType(this Type t)
        {
            var isPrimitive = t.IsPrimitive || t.IsValueType || t == typeof(string) || t == typeof(decimal);
            return isPrimitive;
        }
        public static bool IsNullablePrimitive(this Type t)
        {
            var isNullable = t.IsGenericType && t.GetGenericTypeDefinition() == typeof(Nullable<>);
            if (isNullable)
            {
                var underlyingType = Nullable.GetUnderlyingType(t);
                return IsPrimitiveType(underlyingType);
            }
            return isNullable;
        }
        public static bool IsNullableEnum(Type t)
        {
            Type u = Nullable.GetUnderlyingType(t);
            return (u != null) && u.IsEnum;
        }
    }
    public static class Helper
    {
        public static SqlParameter[] GetSqlParameters(DbConnection connection, string ProcedureName, params object[] parameter)
        {
            List<SqlParameter> sqlParameters = null;
            if (connection.State != ConnectionState.Open)
                connection.Open();
            using (DbCommand db = connection.CreateCommand())
            {
                db.CommandText = "dbo.[Procedures.GetParameter]";
                db.CommandType = CommandType.StoredProcedure;
                db.Parameters.Add(new SqlParameter("@ProcedureName", ProcedureName));
                using (DbDataReader reader = db.ExecuteReader())
                {
                    int index = 0;
                    sqlParameters = new List<SqlParameter>();

                    while (reader.Read())
                    {
                        if (index > parameter.Length - 1)
                            sqlParameters.Add(new SqlParameter(reader["ParameterName"].ToString(), null));
                        else
                            sqlParameters.Add(new SqlParameter(reader["ParameterName"].ToString(), parameter[index]));
                        index++;
                    }
                }
            }
            if (sqlParameters != null && sqlParameters.Count > 0)
                return sqlParameters.ToArray();
            else
                return null;
        }
        public static SqlParameter[] GetSqlParameters(SqlConnection connection, string ProcedureName, params object[] parameter)
        {
            List<SqlParameter> sqlParameters = null;
            if (connection.State != ConnectionState.Open)
                connection.Open();
            using (SqlCommand db = connection.CreateCommand())
            {
                db.CommandText = "dbo.[Procedures.GetParameter]";
                db.CommandType = CommandType.StoredProcedure;
                db.Parameters.Add(new SqlParameter("@ProcedureName", ProcedureName));
                using (DbDataReader reader = db.ExecuteReader())
                {
                    int index = 0;
                    sqlParameters = new List<SqlParameter>();
                    while (reader.Read())
                    {
                        if (index > parameter.Length - 1)
                            sqlParameters.Add(new SqlParameter(reader["ParameterName"].ToString(), null));
                        else
                            sqlParameters.Add(new SqlParameter(reader["ParameterName"].ToString(), parameter[index]));
                        index++;
                    }
                }
            }
            if (sqlParameters != null && sqlParameters.Count > 0)
                return sqlParameters.ToArray();
            else
                return null;
        }
        public static string GetStringSqlParameters(DbConnection connection, string ProcedureName, params object[] parameter)
        {
            string sqlParameters = ProcedureName + " ";
            if (connection.State != ConnectionState.Open)
                connection.Open();
            using (DbCommand db = connection.CreateCommand())
            {
                db.CommandText = "dbo.[Procedures.GetParameter]";
                db.CommandType = CommandType.StoredProcedure;
                db.Parameters.Add(new SqlParameter("@ProcedureName", ProcedureName));
                using (DbDataReader reader = db.ExecuteReader())
                {
                    int index = 0;
                    while (reader.Read())
                    {
                        sqlParameters += reader["ParameterName"].ToString() + "={" + index + "},";
                        index++;
                    }
                }
            }
            if (sqlParameters != null && sqlParameters.Length > 0)
            {
                sqlParameters = sqlParameters.Substring(0, sqlParameters.Length - 1);
                return string.Format(sqlParameters, parameter);
            }
            else
                return null;
        }

        public static IList<T> MapToList<T>(this DbDataReader dr)
        {
            var objList = new List<T>();
            var props = typeof(T).GetRuntimeProperties();
            var colMapping = dr.GetColumnSchema()
                .Where(x => props.Any(y => y.Name.ToLower() == x.ColumnName.ToLower()))
                .ToDictionary(key => key.ColumnName.ToLower());

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    T obj = Activator.CreateInstance<T>();
                    foreach (var prop in props)
                    {
                        if (!colMapping.ContainsKey(prop.Name.ToLower()))
                            continue;
                        var val = dr.GetValue(colMapping[prop.Name.ToLower()].ColumnOrdinal.Value);
                        prop.SetValue(obj, val == DBNull.Value ? null : val);
                    }
                    objList.Add(obj);
                }
                
            }
            return objList;
        }
}
}
