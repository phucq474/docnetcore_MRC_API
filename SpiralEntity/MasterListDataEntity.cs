using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "MasterList")]
    public class MasterListDataEntity
    {

        public string ListCode { get; set; }

        public string Code { get; set; }

        public int Id { get; set; }
        public string Name { get; set; }
        [Column("Name.vi-VN")]
        public string NameVN { get; set; }
        public int? Ref_Id { get; set; }
        public string Ref_Code { get; set; }
        public int? IsLock { get; set; }
        public int? Order { get; set; }
        public int AccountId { get; set; }

    }
}
