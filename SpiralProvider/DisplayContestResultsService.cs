using SpiralData;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IDisplayContestResultsService
    {
        Task<DataTable> GetList(int AccountId, int? UserId, string JsonData);
        Task<DataTable> GetDetail(int AccountId, int? UserId, string JsonData);
        Task<DataTable> GetPhotos(int AccountId, int? UserId, string JsonData);
        Task<int> Update(int AccountId, int? UserId, string JsonData);
        Task<DataTable> Export(int AccountId, int? UserId, string JsonData);
        Task<List<DisplayContestModel>> ExportPPT(int AccountId, int? UserId, string JsonData);
    }
    public class DisplayContestResultsService: IDisplayContestResultsService
    {

        private readonly DisplayContestResultsContext _context;
        public DisplayContestResultsService(DisplayContestResultsContext context)
        {
            _context = context;
        }
        public async Task<DataTable> GetList(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetList(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> GetDetail(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetDetail(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> GetPhotos(int AccountId, int? UserId, string JsonData)
        {
            return await _context.GetPhotos(AccountId, UserId, JsonData);
        }
        public async Task<int> Update(int AccountId, int? UserId, string JsonData)
        {
            return await _context.Update(AccountId, UserId, JsonData);
        }
        public async Task<DataTable> Export(int AccountId, int? UserId, string JsonData)
        {
            return await _context.Export(AccountId, UserId, JsonData);
        }
        public async Task<List<DisplayContestModel>> ExportPPT(int AccountId, int? UserId, string JsonData)
        {
            var data= await _context.ExportPPT(AccountId, UserId, JsonData);
            return (List<DisplayContestModel>)data;
        }
    }
}
