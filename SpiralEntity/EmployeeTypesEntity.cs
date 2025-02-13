using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
   public class EmployeeTypesEntity
    {
        [Key]
        public int Id { set; get; }
        public int AccountId { set; get; }
        public string TypeName { get; set; }
        public string TypeDescription { get; set; }
        public int? Level { set; get; }
        public int Status { get; set; }
        public string Group { get; set; }
    }
}
