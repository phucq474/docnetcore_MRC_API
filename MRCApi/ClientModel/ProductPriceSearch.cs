using System;
namespace MRCApi.ClientModel
{
    public class ProductPriceSearch
    {
        public int? Year { set; get; }
        public int? Month { set; get; }
        public int? FromDate { set; get; }
        public int? ToDate { set; get; }
        public int? CategoryId { set; get; }
        public int? SubCategoryId { set; get; }
        public string ProductCode { set; get; }
    }
}
