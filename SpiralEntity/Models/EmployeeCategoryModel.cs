using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SpiralEntity.Models
{
    public class EmployeeCategoryModel
    {
        public int employeeId { get; set; }
        public int categoryId { get; set; }
        public int fromDate { get; set; }
        public int? toDate { get; set; }
    }
}
