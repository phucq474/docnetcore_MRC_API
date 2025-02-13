using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "Document")]
    public class DocumentsEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { set; get; }
        public int AccountId { get; set; }
        public string DocumentName { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public string FileExtension { get; set; }
        public string FilePath { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int? IsDelete { get; set; }
        public int? CreatedBy { get; set; }
        public int? isRule { get; set; }
        public int? DocumentType { get; set; }
        public int? OrderBy { get; set; }

    }
}
