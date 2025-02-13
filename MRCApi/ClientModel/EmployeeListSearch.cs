using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.ClientModel
{
    public class EmployeeListSearch
    {
        public string EmployeeCode { get; set; }
        public string EmployeeName { get; set; }
        public int? TypeId { get; set; }
        public int? SupId { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public int? Status { get; set; }
        public string CMND { get; set; }
    }
}
