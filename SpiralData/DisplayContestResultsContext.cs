
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class DisplayContestResultsContext:DataContext
    {
        public async Task<DataTable> GetList(int? AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[DisplayContest.GetList]", AccountId,UserId,Json);
        }
        public async Task<DataTable> GetDetail(int? AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[DisplayContest.GetDetail]", AccountId, UserId, Json);
        }
        public async Task<DataTable> GetPhotos(int? AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[DisplayContest.GetPhotos]", AccountId, UserId, Json);
        }
        public async Task<int> Update(int? AccountId, int? UserId, string Json)
        {
            return await this.ExcuteNonQueryAsync("[DisplayContest.Update]", AccountId, UserId, Json);
        }
        public async Task<DataTable> Export(int? AccountId, int? UserId, string Json)
        {
            return await this.ExcuteDataTableAsync("[DisplayContest.Export]", AccountId, UserId, Json);
        }
        public async Task<IList<DisplayContestModel>> ExportPPT(int? AccountId, int? UserId, string Json)
        {
            return await this.SqlRawAsync<DisplayContestModel>("[DisplayContest.ExportPPT]", AccountId, UserId, Json);
        }
    }
}
