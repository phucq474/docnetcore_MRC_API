using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class DocumentUserContext : DataContext
    {
        public async Task<DataTable> Filter(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.DocumentUser.Filter]", userId, jsonData);
        }

        public async Task<DataTable> Detail(string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.DocumentUser.Detail]", jsonData);
        }

        public async Task<DataTable> Insert(int userId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.DocumentUser.Insert]", userId, jsonData);
        }
        public async Task<int> Update(string jsonData)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.DocumentUser.Update]", jsonData);
        }

        public async Task<int> Delete(int employeeId, string listId)
        {
            return await this.ExcuteNonQueryAsync("[dbo].[VNM.DocumentUser.Delete]", employeeId, listId);
        }

        public async Task<DataTable> GetDocument(int accountId, string jsonData)
        {
            return await this.ExcuteDataTableAsync("[dbo].[VNM.Document.GetList]", accountId, jsonData);
        }
    }
}
