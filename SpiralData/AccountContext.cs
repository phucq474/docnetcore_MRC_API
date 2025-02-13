using Microsoft.EntityFrameworkCore;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralData
{
    public class AccountContext : DataContext
    {
        public AccountDomainsEntity GetByDomain(string DomainName)
        {
            var Account = AccountDomains
                .Select(a => a)
                .Where(a => a.Domain == DomainName).FirstOrDefault();
            return Account;
        }
        public async Task<DataTable> GetLang(int accountId)
        {
            return await Task.Run(() => this.ExcuteDataTableAsync("dbo.[Language.Get]", accountId));
        }
        public async Task<IList<AccountsEntity>> GetListAccount(int accountId, int employeeId)
        {
            return await this.SqlRawAsync<AccountsEntity>("dbo.[Account.GetList]", accountId, employeeId);
        }
    }
}
