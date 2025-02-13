using SpiralData;
using SpiralEntity;
using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralService
{
    public interface IOOLListsService
    {
        List<OOLListsEntity> GetList(int AccountId);
    }
    public class OOLListsService : IOOLListsService
    {
        private readonly OOLListsContext _context;
        public OOLListsService(OOLListsContext context)
        {
            _context = context;
        }
        public List<OOLListsEntity> GetList(int AccountId)
        {
            return _context.GetList(AccountId);
        }
    }
}
