using Microsoft.Identity.Client;
using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IEmployeeCategoryService
    {
        Task<int> Delete(int accountId, int userId, int id);
        Task<DataTable> Filter(int accountId, int userId, string jsonData);
        Task<int> Import(int accountId, int userId, string jsonImport);
        Task<DataTable> Save(int accountId, int userId, string jsonData);
        Task<DataSet> Template(int accountId, int userId, string jsonData);
    }
    public class EmployeeCategoryService : IEmployeeCategoryService
    {
        public readonly EmployeeCategoryContext _context;
        public EmployeeCategoryService(EmployeeCategoryContext employeeCategoryContext)
        {
            _context = employeeCategoryContext;
        }
        public async Task<DataTable> Filter(int accountId, int userId, string jsonData)
        {
            return await _context.Filter(accountId, userId, jsonData);
        }
        public async Task<DataTable> Save(int accountId, int userId, string jsonData)
        {
            return await _context.Save(accountId, userId, jsonData);
        }
        public async Task<int> Delete(int accountId, int userId, int id)
        {
            return await _context.Delete(accountId, userId, id);
        }
        public async Task<DataSet> Template(int accountId, int userId, string jsonData)
        {
            return await _context.Template(accountId, userId, jsonData);
        }
        public async Task<int> Import(int accountId, int userId, string jsonImport)
        {
            return await _context.Import(accountId, userId, jsonImport);
        }
    }
}
