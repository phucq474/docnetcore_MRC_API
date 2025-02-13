using System;
namespace MRCApi.ClientModel
{
    public class QCDetailsModel
    {
        public long qcId { set; get; }
        public int statusId { set; get; }
        public string comment { set; get; }
        public string kpiCode { set; get; }
        public string kpiData { set; get; }
    }
}
