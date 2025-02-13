using SpiralData;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IEmailService
    {
        Task<int> CreateAutomail(int? year, int? month,int userId);
        Task<int> CreateAutomailQC(int? year, int? month, int userId);
        Task<List<EmailModel>> GetList(int year, int month, int? srId, string mailType, int? sendStatus, int userId);
        Task<int> Sended(int year, int month, string successlist);
        Task<int> Removemail(int id, int userId);
    }
    public class EmailService : IEmailService
    {
        private readonly EmailContext _context;
        public EmailService(EmailContext context)
        {
            _context = context;
        }
        public Task<int> CreateAutomail(int? year, int? month, int userId)
        {
            return _context.CreateAutomail(year, month, userId);
        }

        public Task<int> CreateAutomailQC(int? year, int? month, int userId)
        {
            return _context.CreateAutomailQC(year, month, userId);
        }

        public async Task<List<EmailModel>> GetList(int year, int month, int? srId, string mailType, int? sendStatus, int userId)
        {
            var data = await _context.GetList(year, month, srId, mailType, sendStatus, userId);
            if (data != null)
                return data.ToList();
            return null;
        }

        public Task<int> Removemail(int id, int userId)
        {
            return _context.Removemail(id, userId);
        }

        public Task<int> Sended(int year, int month, string successlist)
        {
            return _context.Sended(year, month, successlist);
        }
    }
}
