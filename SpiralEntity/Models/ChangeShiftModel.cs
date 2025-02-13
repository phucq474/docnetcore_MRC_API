using System;

namespace SpiralEntity.Models
{
    public class ChangeShiftModel
    {
        public int AccountId { set; get; }
        public int EmployeeId { set; get; }
        public int ParentId { set; get; }
        public string FullName { set; get; }
        public int ShopId { set; get; }
        public string ShopName { set; get; }
        public int WorkDate { set; get; }
        public string DayPlan { set; get; }
        public string ShiftNow { set; get; }
        public string ShiftCode { set; get; }
        public string NoteChange { set; get; }

        public string getContentNotify()
        {
            string mContent = "Nhân viên " + FullName + "\n"
                + "Cửa hàng " + ShopName + " ngày " + DayPlan + " \n"
                + "Xin chuyển ca hiện tại " + ShiftNow + " sang ca " + ShiftCode + "\n"
                + "Lí do: " + NoteChange + "\n"
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