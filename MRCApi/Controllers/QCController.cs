using System;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SpiralService;
using MRCApi.ClientModel;
using MRCApi.Extentions;
using SpiralData;

namespace MRCApi.Controllers
{
    public class QCController : SpiralBaseController
    {
        public readonly IQCService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IReportService _reportService;
        public QCController(QCContext context, IWebHostEnvironment webHost, ReportContext reportContext)
        {
            _service = new QCService(context);
            _reportService = new ReportService(reportContext);
            this._hostingEnvironment = webHost;
        }

        [HttpGet("Filter")]
        public ActionResult<DataTable> Filter([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDynamic(AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }

        [HttpGet("Detail")]
        public ActionResult<DataTable> Detail([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetDetail(AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }
        [HttpGet("GetByKPI")]
        public ActionResult<DataTable> GetByKPI([FromHeader] string JsonData)
        {
            try
            {
                Task<DataTable> data = Task.Run(() => _service.GetByKPI(AccountId, UserId, JsonData));
                return data.Result;
            }
            catch (Exception ex)
            {
                return BadRequest(ex.StackTrace.ToString());
            }
        }
        [HttpPost("QCDetail/Update")]
        public ActionResult<ResultInfo> KPI_Update([FromBody] string JsonData)
        {
            int result = 0;
            try
            {
                Task<int> data = Task.Run(() => _service.Detail_Update(AccountId, UserId, JsonData));
                result = data.Result;
                if (result > 0)
                    return new ResultInfo(1, "Successful", null);
                else
                    return new ResultInfo(-1, "Fail", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(-1, "Fail", ex.Message);
            }
        }
        [HttpGet("Rawdata")]
        public async Task<ResultInfo> Export([FromHeader] string JsonData)
        {
            try
            {
                return await Task.Run(() => QCExcel.Report_QC_RawData(AccountId, UserId, JsonData, _service, _hostingEnvironment, Request.Host, Request.Scheme));
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message, ex.StackTrace);
            }
        }
    }
}
