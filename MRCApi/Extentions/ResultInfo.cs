using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class ResultInfo
    {
        public ResultInfo(int status,string imsg,string iPath = null,DataTable data = null)
        {
            this.Status = status;
            this.Message = imsg;
            this.FileUrl = iPath;
            this.Data = data;
        }
        public int Status { set; get; }
        public string Message { set; get; }
        public string FileUrl { set; get; }
        public DataTable Data { get; set; }
    }
    public class ResultTableInfo
    {
        public ResultTableInfo(int status, string imsg, DataTable data)
        {
            this.Status = status;
            this.Message = imsg;
            this.Data = data;
        }
        public int Status { set; get; }
        public string Message { set; get; }
        public DataTable Data { set; get; }
    }
    public class ResultDataSetInfo
    {
        public ResultDataSetInfo(int status, string imsg, DataSet data)
        {
            this.Status = status;
            this.Message = imsg;
            this.Data = data;
        }
        public int Status { set; get; }
        public string Message { set; get; }
        public DataSet Data { set; get; }
    }
    public class ResultListInfo<T>
    {
        public ResultListInfo(int status, string imsg, List<T> data)
        {
            this.Status = status;
            this.Message = imsg;
            this.Data = data;
        }
        public int Status { set; get; }
        public string Message { set; get; }
        public List<T> Data { set; get; }
    }
}
