using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MRCApi.Controllers
{
    public class RegionController : SpiralBaseController
    {
        public readonly IRegionService _service;

        public RegionController(RegionContext _context)
        {
            _service = new RegionService(_context);
        }

        [HttpGet("list")]
        public ActionResult<List<RegionEntity>> GetList([FromHeader] int? accId)
        {
            accId = accId ?? AccountId;
            Task<List<RegionEntity>> data = Task.Run(() => _service.GetList(accId.Value));
            return data.Result;
        }
        [HttpGet("GetArea")]
        public ActionResult<DataTable> GetArea()
        {
            Task<DataTable> data = Task.Run(() => _service.GetArea(AccountId));
            return data.Result;
        }

        //public class RegionMasterModel
        //{
        //    public string ProvinceVN { get; set; }
        //    public string Province { get; set; }
        //    public int? ProvinceId { get; set; }
        //    public string DistrictVN { get; set; }
        //    public string District { get; set; }
        //    public int? DistrictId { get; set; }
        //    public string TownVN { get; set; }
        //    public string Town { get; set; }
        //    public int? TownId { get; set; }
        //    public string TownType { get; set; }
        //    public int AreaId { get; set; }
        //    public string AreaName { get; set; }
        //    public int? OrderBy { get; set; }
        //}
        //[HttpPost("ImportMaster")]
        //public async Task<ResultInfo> ImportMaster([FromForm] IFormFile fileUpload)
        //{
        //    try
        //    {
        //        var stream = fileUpload.OpenReadStream();
        //        ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
        //        using (var package = new ExcelPackage(stream))
        //        {
        //            ExcelWorkbook workBook = package.Workbook;
        //            var sheet = workBook.Worksheets["Data"];
        //            if (sheet != null)
        //            {
        //                List<RegionMasterModel> dtImport = new List<RegionMasterModel>();
        //                List<RegionEntity> listRegion = _service.GetList(AccountId);
        //                for (int r = 2; r <= sheet.Dimension.End.Row; r++)
        //                {
        //                    RegionMasterModel item = new RegionMasterModel();

        //                    if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, 7].Value)) && !string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, 6].Value)))
        //                    {

        //                        item.Province = sheet.Cells[r, 7].Value.ToString().Split("'").Length == 1 ? FileExtends.boDau(Convert.ToString(sheet.Cells[r, 7].Value)) : FileExtends.boDau(Convert.ToString(sheet.Cells[r, 7].Value.ToString().Replace("'", "''")));
        //                        item.ProvinceVN = sheet.Cells[r, 7].Value.ToString().Split("'").Length == 1 ? Convert.ToString(sheet.Cells[r, 7].Value) : Convert.ToString(sheet.Cells[r, 7].Value.ToString().Replace("'", "''"));
        //                        item.ProvinceId = Convert.ToInt32(sheet.Cells[r, 6].Value);

        //                        var tempArea = listRegion.Where(p => p.ProvinceId == item.ProvinceId).FirstOrDefault();
        //                        if (tempArea != null)
        //                        {
        //                            item.AreaId = tempArea.AreaId;
        //                            item.AreaName = tempArea.AreaName;
        //                            item.OrderBy = tempArea.OrderBy;
        //                        }
        //                    }

        //                    if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, 5].Value)) && !string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, 4].Value)))
        //                    {
        //                        item.District = sheet.Cells[r, 5].Value.ToString().Split("'").Length == 1 ? FileExtends.boDau(Convert.ToString(sheet.Cells[r, 5].Value)) : FileExtends.boDau(Convert.ToString(sheet.Cells[r, 5].Value.ToString().Replace("'", "''")));
        //                        item.DistrictVN = sheet.Cells[r, 5].Value.ToString().Split("'").Length == 1 ? Convert.ToString(sheet.Cells[r, 5].Value) : Convert.ToString(sheet.Cells[r, 5].Value.ToString().Replace("'", "''"));
        //                        item.DistrictId = Convert.ToInt32(sheet.Cells[r, 4].Value);
        //                    }

        //                    if (!string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, 3].Value)) && !string.IsNullOrEmpty(Convert.ToString(sheet.Cells[r, 2].Value)))
        //                    {
        //                        item.Town = sheet.Cells[r, 2].Value.ToString().Split("'").Length == 1 ? FileExtends.boDau(Convert.ToString(sheet.Cells[r, 2].Value)) : FileExtends.boDau(Convert.ToString(sheet.Cells[r, 2].Value.ToString().Replace("'", "''")));
        //                        item.TownVN = sheet.Cells[r, 2].Value.ToString().Split("'").Length == 1 ? Convert.ToString(sheet.Cells[r, 2].Value) : Convert.ToString(sheet.Cells[r, 2].Value.ToString().Replace("'", "''"));
        //                        item.TownId = Convert.ToInt32(sheet.Cells[r, 1].Value);
        //                        item.TownType = Convert.ToString(sheet.Cells[r, 3].Value);
        //                    }

        //                    dtImport.Add(item);
        //                }

        //                if (dtImport.Count > 0)
        //                {
        //                    string json = JsonConvert.SerializeObject(dtImport);
        //                    int result = await Task.Run(() => _service.ImportMaster(AccountId, UserId, json));
        //                    if (result > 0)
        //                    {
        //                        return new ResultInfo(200, "Import thành công " + dtImport.Count, "");
        //                    }
        //                    else
        //                    {
        //                        return new ResultInfo(500, "Failed", "");
        //                    }
        //                }
        //                else
        //                {
        //                    return new ResultInfo(500, "File rỗng", "");
        //                }
        //            }
        //            else
        //            {
        //                return new ResultInfo(500, "File rỗng", "");
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        return new ResultInfo(500, ex.Message, ex.StackTrace);
        //    }
        //}
    }
}