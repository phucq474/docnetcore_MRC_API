using System;

namespace SpiralEntity.Models
{
    public class EmployeeDeviceTokenModel
    {
        public int? AccountId { set; get; }
        public int? EmployeeId { set; get; }
        public int? DeviceType { set; get; }
        public long? RN { set; get; }
        public string Token { set; get; }
        public DateTime? CreateDate { set; get; }
    }
}