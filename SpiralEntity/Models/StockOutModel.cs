using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralEntity.Models
{
    public class StockOutModel
    {
        public int ShopId { get; set; }
        public int? EmployeeId { get; set; }
        public string WorkDate { get; set; }
        public int? ProductId { get; set; }
        public string Barcode { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
    }
}
