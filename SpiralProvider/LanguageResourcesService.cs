using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore;
using SpiralData;
using SpiralEntity;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using SpiralEntity.Models;

namespace SpiralService
{
    public interface ILanguageResourceService
    {
        Task<DataTable> Filter(string resourceName, int accountId);
        Task<DataTable> Update(LanguageResourcesModel language);
        Task<DataTable> Insert(int accountId, LanguageResourcesModel language);
        int Delete(LanguageResourcesModel language, int accountId);
        Task<DataTable> data_report(int accountId);
        Task<int> Import(int accountId, DataTable dataImport);
    }
    public class LanguageResourcesService : ILanguageResourceService
    {
        private readonly LanguageResourcesContext _context;
        public LanguageResourcesService(LanguageResourcesContext context)
        {
            _context = context;
        }
        public async Task<DataTable> Filter(string resourceName, int accountId)
        {
            return await _context.Filter(resourceName, accountId);
        }
        public async Task<DataTable> Update(LanguageResourcesModel language)
        {
            int display;
            if(language.IdVn == null)
            {
                display = 1;
                return await _context.LanguageResources_InsertSingle(language.AccountId.Value, language.ResourceName, language.VietNam, display);
            }
            else if(language.IdEn == null)
            {
                display = 2;
                return await _context.LanguageResources_InsertSingle(language.AccountId.Value, language.ResourceName, language.English, display);
            }
            else
            {
                return await _context.LanguageResources_Update(language.IdVn, language.IdEn, language.VietNam, language.English);
            }
        }
        
        public async Task<DataTable> Insert(int accountId, LanguageResourcesModel language)
        {
            return await _context.LanguageResources_Insert(accountId, language.ResourceName, language.VietNam, language.English);
        }
        public int Delete(LanguageResourcesModel language, int accountId)
        {
            if (language.AccountId == accountId)
            {
                var data1 = _context.LanguageResources.Where(p => p.Id == language.IdEn).FirstOrDefault();
                var data2 = _context.LanguageResources.Where(p => p.Id == language.IdVn).FirstOrDefault();
                _context.LanguageResources.Remove(data1);
                _context.LanguageResources.Remove(data2);
                _context.SaveChanges();
                return 1;

            }
            else return -1;
        }
        public async Task<DataTable> data_report(int accountId)
        {
            return await _context.data_report(accountId);
        }
        public async Task<int> Import(int accountId, DataTable dataImport)
        {
            return await _context.Import(accountId, dataImport);
        }
    }
}
