using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MRCApi.Extentions;

namespace MRCApi.Controllers
{
    public class SellOutController : SpiralBaseController
    {
        public readonly ISellOutService _service;
        private readonly IWebHostEnvironment _hostingEnvironment;
        public SellOutController(SellOutContext context, IWebHostEnvironment webHost)
        {
            _service = new SellOutService(context);
            this._hostingEnvironment = webHost;
        }

    }
}
