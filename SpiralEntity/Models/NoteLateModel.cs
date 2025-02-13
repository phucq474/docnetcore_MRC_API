using System;

namespace SpiralEntity.Models
{
    public class NoteLateModel
    {
        public int AccountId { set; get; }
        public int EmployeeId { set; get; }
        public int ParentId { set; get; }
        public string FullName { set; get; }
        public int ShopId { set; get; }
        public string ShopName { set; get; }
        public int WorkDate { set; get; }
        public string DayPlan { set; get; }
        public int TimeLate { set; get; }
        public string Note { set; get; }

        public string getContentNotify()
        {
            string mContent = "Nhân viên " + FullName + "\n"
                + "Cửa hàng " + ShopName + " ngày " + DayPlan + " \n"
                + "Xin phép đi trễ, về sớm (" + TimeLate + " phút )\nLí do: " + Note + "\n"
                + "Thời gian: " + DateTime.Now;
            return mContent;
        }

        public class ConfirmData
        {
            public int AccountId { set; get; }
            public int EmployeeId { set; get; }
            public int RefId { set; get; }
            public int ShopId { set; get; }
            public int WorkDate { set; get; }
        }

        public ConfirmData EncodeLinkConfirm()
        {
            ConfirmData data = new ConfirmData();
            data.AccountId = AccountId;
            data.EmployeeId = ParentId;
            data.RefId = EmployeeId;
            data.ShopId = ShopId;
            data.WorkDate = WorkDate;
            return data;
        }
    }
}