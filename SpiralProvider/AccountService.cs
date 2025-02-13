using Microsoft.Extensions.Options;
using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IAccountService
    {
        AccountDomainsEntity GetByDomain(string DomainName);
        Task<DataTable> GetLang(int AccountId);
        Task<List<AccountsEntity>> GetListAccount(int accountId, int employeeId);

    }
    public class AccountService : IAccountService
    {
        private readonly AccountContext _context;
        //private readonly AppSettings _appSettings;
        public AccountService(AccountContext context)
        {
            _context = context;
            //_appSettings = appSettings.Value;
        }
        public AccountDomainsEntity GetByDomain(string DomainName)
        {
            return _context.GetByDomain(DomainName);
        }
        public async Task<DataTable> GetLang(int AccountId)
        {
            return await _context.GetLang(AccountId);
        }
        public async Task<List<AccountsEntity>> GetListAccount(int accountId, int employeeId)
        {
            var list = await _context.GetListAccount(accountId, employeeId);
            return list != null ? list.ToList() : null;

        }
    }
}
