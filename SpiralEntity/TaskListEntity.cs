using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table("TaskList")]
    public class TaskListEntity
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public string Group { get; set; }
        public int? GroupPoint { get; set; }
        public int SubGroupId { get; set; }
        public string SubGroup { get; set; }
        public int? SubGroupPoint { get; set; }
        public int? ItemId { get; set; }
        public string ItemName { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string Frequency { get; set; }
        public bool Require { get; set; }
        public int? Point { get; set; }
        public int? Status { get; set; }
    }
}
