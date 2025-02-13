using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace SpiralEntity
{
    [Table(name: "Logs")]
    public class LogsEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public long ID { set; get; }
        public string Message { set; get; }
        public string Trace { set; get; }
        public DateTime? CreatedDate { set; get; }
        public string EmployeeCode { set; get; }
        public int? Type { set; get; }
        public LogsEntity() { }
        public LogsEntity(string _mes, string _trace, DateTime? _date, int _employeeId, int? _Type)
        {
            ID = 0;
            Message = _mes;
            Trace = _trace;
            CreatedDate = _date;
            EmployeeCode = _employeeId.ToString();
            Type = _Type;
        }
    }
}
