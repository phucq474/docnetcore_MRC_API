using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using MRCApi.Extentions;


namespace MRCApi.Controllers
{
    public class TimeShiftController : SpiralBaseController
    {
        public readonly ITimeShiftService _service;
        public readonly IShopService _serviceShop;
        public readonly IWebHostEnvironment _webHostEnvironment;
        public TimeShiftController(ShopContext shopContext, TimeShiftContext _context, IWebHostEnvironment webHost)
        {
            _service = new TimeShiftService(_context);
            _serviceShop = new ShopService(shopContext);
            this._webHostEnvironment = webHost;
        }
    }
}
