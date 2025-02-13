using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.ClientModel
{
    public class EmployeeSaveModel
    {
        public string JsonData { get; set; }
        public IFormFile ImageProfile { get; set; }
        public IFormFile FileCMNDAfter { get; set; }
        public IFormFile FileCMNDBefore { get; set; }
        public string EmployeeCode { get; set; }
        public string Password { get; set; }
    }
}
