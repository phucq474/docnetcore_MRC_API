using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.ClientModel
{
    public class WorkingPlanSearch
    {
        public int EmployeeId { get; set; }
        public int? PlanDate { get; set; }
        public string Area { get; set; }
        public string ProvinceId { get; set; }
        public string ShopCode { get; set; }
        public int? CustomerId { get; set; }
        public string ShopSave { get; set; }
    }
}
