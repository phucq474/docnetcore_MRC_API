using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class EmployeeCategoryContext : DataContext
    {
        public async Task<int> Delete(int accountId, int userId, int id)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[EmployeeCategory.Delete]", accountId, userId, id);
        }

        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[EmployeeCategory.Filter]", accountId, userId, jsonData);
        }

        public async Task<int> Import(int accountId, int userId, string jsonImport)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[EmployeeCategory.Import]", accountId, userId, jsonImport);
        }

        public async Task<DataTable> Save(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[EmployeeCategory.Save]", accountId, userId, jsonData);
        }

        public async Task<DataSet> Template(int accountId, int userId, string jsonData)
        {
            return await this.ExcuteDataSetAsync("[dbo].[EmployeeCategory.Template]", accountId, userId, jsonData);
        }
    }
}
