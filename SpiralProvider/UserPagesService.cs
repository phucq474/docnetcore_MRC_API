using System;
using System.Collections.Generic;
using System.Text;
using System.Linq;
using System.Data;
using SpiralEntity;
using System.Threading.Tasks;
using SpiralEntity.Models;
using SpiralData;

namespace SpiralService
{
    public interface IUserPagesService
    {
        Task<int> SetPermission(int accountId, string jsonData, int? employeeId, int? position);
    }
    public class UserPagesService : IUserPagesService
    {
        private readonly UserPagesContext _userPagesContext;
        public UserPagesService(UserPagesContext userPagesContext)
        {
            this._userPagesContext = userPagesContext;
        }

        public async Task<int> SetPermission(int accountId, string jsonData, int? employeeId, int? position)
        {
            return await _userPagesContext.setPermission( accountId, jsonData, employeeId, position);
        }
    }
}
