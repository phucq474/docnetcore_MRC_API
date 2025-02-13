using System;
using System.Collections.Generic;
using System.Text;

namespace SpiralEntity
{
    public class DepartmentEntity
    {
        public int Id { get; set; }
        public int? AccountId { get; set; }
        public int? ManagerId { get; set; }
        public int? DeptParentId { get; set; }
        public string DeptName { get; set; }
        public string DeptDescription { get; set; }
        public string Location { get; set; }

    }
}
