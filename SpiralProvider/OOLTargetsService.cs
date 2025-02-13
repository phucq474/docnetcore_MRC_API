using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IOOLTargetsService
    {
        Task<DataSet> OOLTargets_CreateTemplate(int AccountId, string Json);
        Task<DataTable> OOLTargets_Export(int AccountId, string JsonData);
        //Task<int> OOLTarget_Import(int UserId, int AccountId, string Json);
        Task<int> OOLTarget_Import(int AccountId, string Json);
        Task<DataTable> OOLTarget_Filter(int AccountId, string Json);
        Task<DataTable> Save(string Action, int AccountId, string JsonData);


    }
    public class OOLTargetsService : IOOLTargetsService
    {
        private readonly OOLTargetsContext _context;
        public OOLTargetsService(OOLTargetsContext context)
        {
            _context = context;
        }
        public async Task<DataSet> OOLTargets_CreateTemplate(int AccountId, string Json)
        {
            return await _context.OOLTarget_CreateTemplate(AccountId, Json);
        }
        public async Task<DataTable> OOLTargets_Export(int AccountId, string JsonData)
        {
            return await _context.OOLTargets_Export(AccountId, JsonData);
        }
        //public async Task<int> OOLTarget_Import(int UserId, int AccountId, string Json)
        //{
        //    return await _context.OOLTarget_Import(UserId, AccountId, Json);
        //}
        public async Task<int> OOLTarget_Import(int AccountId, string Json)
        {
            return await _context.OOLTarget_Import(AccountId, Json);
        }
        public async Task<DataTable> OOLTarget_Filter(int AccountId, string Json)
        {
            return await _context.OOLTarget_Filter(AccountId, Json);
        }

        public async Task<DataTable> Save(string Action, int AccountId, string JsonData)
        {
            return await _context.Save(Action, AccountId, JsonData);
        }
    }
}
