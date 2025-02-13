using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.ClientModel
{
    public class NotifySearch
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public int? Status { get; set; }
        public string notifyType { get; set; }
        public string employeeId { get; set; }
        public int? Position { get; set; }
        public string SelectedNotify { get; set; }
        public string notifyTitle { get; set; }
    }
}
