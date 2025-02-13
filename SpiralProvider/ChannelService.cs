using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface IChannelService
    {
        List<ChannelEntity> GetList(int accountId);
        Task<DataTable> Filter(int accountId, int? id);
        Task<DataTable> Insert(int accountId, string jsonData);
        Task<DataTable> Update(int accountId, string jsonData);
    }
    public class ChannelService : IChannelService
    {
        private ChannelContext _context;
        public ChannelService(ChannelContext context)
        {
            _context = context;
        }
        public List<ChannelEntity> GetList(int accountId)
        {
            return _context.GetList(accountId);
        }
        public async Task<DataTable> Filter(int accountId, int? id)
        {
            return await _context.Filter(accountId, id);
        }
        public async Task<DataTable> Insert(int accountId, string jsonData)
        {
            return await _context.Insert(accountId, jsonData);
        }
        public async Task<DataTable> Update(int accountId, string jsonData)
        {
            return await _context.Update(accountId, jsonData);
        }
    }
}
