namespace SpiralEntity.Models
{
    public class DocumentModel : DocumentsEntity
    {
        public string TypeName { set; get; }
        public int? Total { get; set; }
        public int? RowNum { get; set; }
    }
}