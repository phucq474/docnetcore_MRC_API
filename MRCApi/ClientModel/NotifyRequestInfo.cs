using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.ClientModel
{
    public class NotifyRequestInfo
    {
        public string sendType { set; get; }
        public string title { set; get; }
        public string hyperlinks { set; get; }
        public string content { set; get; }
        public string employees { set; get; }
        public string imageurl { get; set; }
    }
}
