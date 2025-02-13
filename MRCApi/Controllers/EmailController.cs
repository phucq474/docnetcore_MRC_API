using MRCApi.Extentions;
using Microsoft.AspNetCore.Mvc;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class EmailController : SpiralBaseController
    {
        public readonly IEmailService _service;
        public EmailController(EmailContext _context)
        {
            _service = new EmailService(_context);
        }
        [HttpGet("sendmail")]
        public ActionResult Send([FromHeader]int Year, [FromHeader] int Month, [FromHeader]string mailType)
        {
            var list = Task.Run(() => _service.GetList(Year, Month, null, mailType, null, UserId)).Result;
            int results = 0;
            string successlist = "";
            if (list != null && list.Count > 0)
            {
                var send = from s in list
                           where s.Status == 0
                           select s;
                if (send != null)
                {
                    foreach (var item in send.ToList())
                    {
                        int sended = EmailExtends.SendMail(item.To, item.Cc, item.Subtitle, item.Body, null);
                        if (sended == 1)//gui thanh cong
                        {
                            successlist += item.Id + ";";
                            results += sended;
                        }
                    }
                }
                var updated = Task.Run(() => _service.Sended(Year, Month, successlist)).Result;
            }
            return Ok(results);
        }
        [HttpGet("createmail")]
        public ActionResult CreateEmail([FromHeader]int Year, [FromHeader] int Month, [FromHeader]string mailType)
        {
            var result = "0";
            if (mailType.Equals("1"))//AuditDone
            {
                result = _service.CreateAutomail(Year, Month, UserId).Result.ToString();
            }
            else
            {
                result = _service.CreateAutomailQC(Year, Month, UserId).Result.ToString();
            }
            return Ok(result);
        }
        [HttpGet("removeemail")]
        public ActionResult RemoveEmail([FromHeader]int id)
        {
            var result = Task.Run(() => _service.Removemail(id, UserId)).Result;
            return Ok(result);
        }
        [HttpGet("list")]
        public ActionResult EmailList([FromHeader]int Year, [FromHeader] int Month, [FromHeader]int? srId, [FromHeader]string mailType, int? sendStatus)
        {
            var list = Task.Run(() => _service.GetList(Year, Month, srId, mailType, sendStatus, UserId)).Result;
            return Ok(list);
        }

    }
}
