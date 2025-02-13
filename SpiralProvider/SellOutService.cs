using SpiralData;
using System;
using System.Collections.Generic;
using System.Data;
using System.Text;
using System.Threading.Tasks;

namespace SpiralService
{
    public interface ISellOutService
    {

    }
    public class SellOutService : ISellOutService
    {
        private readonly SellOutContext _context;
        public SellOutService(SellOutContext context)
        {
            _context = context;
        }

    }
}
