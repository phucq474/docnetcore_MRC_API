using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IEmployeeAnnualLeaveService
    {
        Task<DataSet> EmployeeAnnualLeave_Filter(int AccountId, int UserId, string Json);
        Task<int> EmployeeAnnualLeave_Save(int AccountId, int UserId, string Json);
        Task<int> EmployeeAnnualLeave_Import(int AccountId, int UserId, string Json, string nBJson);
        Task<DataTable> EmployeeAnnualLeave_Export(int AccountId, int UserId, string Json);
        Task<DataSet> EmployeeAnnualLeave_Template(int AccountId, int UserId, string Json);
        Task<int> EmployeeAnnualLeave_Update(int accountId, int userId, string jsonData);
    }
    public class EmployeeAnnualLeaveService : IEmployeeAnnualLeaveService
    {
        private readonly EmployeeAnnualLeaveContext _context;
        public EmployeeAnnualLeaveService(EmployeeAnnualLeaveContext context)
        {
            _context = context;
        }
        public async Task<DataSet> EmployeeAnnualLeave_Filter(int AccountId, int UserId, string Json)
        {
            return await _context.EmployeeAnnualLeave_Filter(AccountId, UserId, Json);
        }
        public async Task<int> EmployeeAnnualLeave_Save(int AccountId, int UserId, string Json)
        {
            return await _context.EmployeeAnnualLeave_Save(AccountId, UserId, Json);
        }
        public async Task<int> EmployeeAnnualLeave_Import(int AccountId, int UserId, string Json, string nBJson)
        {
            return await _context.EmployeeAnnualLeave_Import(AccountId, UserId, Json, nBJson);
        }
        public async Task<DataTable> EmployeeAnnualLeave_Export(int AccountId, int UserId, string Json)
        {
            return await _context.EmployeeAnnualLeave_Export(AccountId, UserId, Json);
        }
        public async Task<DataSet> EmployeeAnnualLeave_Template(int AccountId, int UserId, string Json)
        {
            return await _context.EmployeeAnnualLeave_Template(AccountId, UserId, Json);
        }

        public async Task<int> EmployeeAnnualLeave_Update(int accountId, int userId, string jsonData)
        {
            return await _context.EmployeeAnnualLeave_Update(accountId, userId, jsonData);
        }
    }
}
