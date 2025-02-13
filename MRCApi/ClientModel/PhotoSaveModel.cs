using Microsoft.AspNetCore.Http;

namespace MRCApi.ClientModel
{
    public class PhotoSaveModel
    {
        public IFormFile Ifile { get; set; }
        public string JsonData { get; set; }
        public int? ShopId { get; set; }
        public int? EmployeeId { get; set; }
        public int? ReportId { get; set; }
        public string WorkDate { get; set; }
        public string PhotoType { get; set; }
        public string PhotoMore { get; set; }
        public string Photo { get; set; }
    }
}
