using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Presentation;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using MRCApi.Extentions;
using Newtonsoft.Json;
using OfficeOpenXml;
using SpiralData;
using SpiralEntity.Models;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.Drawing.Imaging;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using DocumentFormat.OpenXml.Office.Drawing;
using Drawing = DocumentFormat.OpenXml.Drawing;

namespace MRCApi.Controllers
{
    public class DisplayContestResultsController : SpiralBaseController
    {
        public readonly IDisplayContestResultsService _displayContestResultsService;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public DisplayContestResultsController(DisplayContestResultsContext displayContestResultsContext, IWebHostEnvironment _webhost)
        {
            _displayContestResultsService = new DisplayContestResultsService(displayContestResultsContext);
            this._webHostEnvironment = _webhost;
        }
        [HttpPost("GetList")]
        public async Task<DataTable> GetList([FromBody] string JsonData)
        {
            DataTable data = await _displayContestResultsService.GetList(AccountId, UserId, JsonData);
            return data;
        }
        [HttpPost("GetDetail")]
        public async Task<DataTable> GetDetail([FromBody] string JsonData)
        {
            DataTable data = await _displayContestResultsService.GetDetail(AccountId, UserId, JsonData);
            return data;
        }
        [HttpPost("GetPhotos")]
        public async Task<DataTable> GetPhotos([FromBody] string JsonData)
        {
            DataTable data = await _displayContestResultsService.GetPhotos(AccountId, UserId, JsonData);
            return data;
        }
        [HttpPost("Update")]
        public async Task<ResultInfo> Update([FromBody] string JsonData)
        {
            try
            {
                int result = await _displayContestResultsService.Update(AccountId, UserId, JsonData); ;
                if (result > 0)
                    return new ResultInfo(1, "Successful", null);
                else
                    return new ResultInfo(-1, "Fail", null);
            }
            catch (Exception ex)
            {
                return new ResultInfo(-1, ex.Message, null);
            }
        }
        [HttpPost("Export")]
        public async Task<ResultInfo> Export([FromBody] string JsonData)
        {
            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
                string folder = _webHostEnvironment.WebRootPath;
                string subfolder = "export/DisplayContest";
                if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
                {
                    System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
                }
                FileInfo file = null;
                string fileName = $"DisplayContest Result_{DateTime.Now.ToString("ddMMyyyy_HHmmss")}.xlsx";
                string fileExport = Path.Combine(folder, subfolder, fileName);
                file = new FileInfo(fileExport);
                ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
                using (DataTable dt = await Task.Run(() => _displayContestResultsService.Export(AccountId, UserId, JsonData)))
                {
                    using (var package = new ExcelPackage(file))
                    {
                        var sheet = package.Workbook.Worksheets.Add("RawData");
                        if (sheet != null)
                        {
                            if (dt.Rows.Count > 0)
                            {
                                //load data
                                sheet.Row(4).Height = 30;
                                sheet.Row(1).Height = 30;
                                sheet.Cells[4, 1].LoadFromDataTable(dt, true);
                                sheet.Cells[1, 1].Value = "DisplayContest REPORT";
                                sheet.Cells[1, 1, 1, dt.Columns.Count].Merge = true;
                                ExcelFormats.FormatCell(sheet.Cells[1, 1, 1, dt.Columns.Count], "#9BC2E6", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                sheet.Cells[2, 1].Value = "Từ ngày: ";
                                sheet.Cells[2, 2].Value = dataJson.fromdate;
                                sheet.Cells[2, 3].Value = "Tới ngày: ";
                                sheet.Cells[2, 4].Value = dataJson.todate;
                                ExcelFormats.FormatCell(sheet.Cells[4, 1, 4, dt.Columns.Count], "#5B9BD5", true, OfficeOpenXml.Style.ExcelHorizontalAlignment.Center);
                                ExcelFormats.Border(sheet, 4, 1, dt.Rows.Count + 4, dt.Columns.Count);
                                sheet.Cells.AutoFitColumns();
                            }
                            else
                                return new ResultInfo(0, "Không có dữ liệu", "");
                        }

                        package.Save();
                    }
                }
                return (new ResultInfo(1, "Xuất báo cáo thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName)));
            }
            catch (Exception err)
            {
                return (new ResultInfo(500, err.Message, null));
            }
        }
        #region Export PPTX
        public static void SwapPlaceholderText(SlidePart slidePart, string placeholder, string value)
        {
            List<Drawing.Text> textList = slidePart.Slide.Descendants<Drawing.Text>().Where(t => t.Text.Equals(placeholder)).ToList();
            foreach (Drawing.Text text in textList)
            {
                text.Text = value;
            }

        }
        public static SlidePart CloneSlidePart(PresentationPart presentationPart, SlidePart slideTemplate, int pos)
        {
            //Create a new slide part in the presentation.
            SlidePart newSlidePart = presentationPart.AddNewPart<SlidePart>("newSlide" + pos);
            var str = slideTemplate.GetStream(FileMode.Open);
            //Add the slide template content into the new slide.
            newSlidePart.FeedData(str);
            //Make sure the new slide references the proper slide layout.
            newSlidePart.AddPart(slideTemplate.SlideLayoutPart);
            //Get the list of slide ids.
            SlideIdList slideIdList = presentationPart.Presentation.SlideIdList;
            //Deternmine where to add the next slide (find max number of slides).
            uint maxSlideId = 2;
            SlideId prevSlideId = null;
            foreach (SlideId slideId in slideIdList.ChildElements)
            {
                if (slideId.Id > maxSlideId)
                {
                    maxSlideId = slideId.Id;
                    prevSlideId = slideId;
                }
            }
            maxSlideId++;
            //Add the new slide at the end of the deck.
            SlideId newSlideId = slideIdList.InsertAfter(new SlideId(), prevSlideId);
            //Make sure the id and relid are set appropriately.
            newSlideId.Id = maxSlideId;
            newSlideId.RelationshipId = presentationPart.GetIdOfPart(newSlidePart);
            str.Dispose();
            str.Close();
            return newSlidePart;
        }
        public static void SwapPhoto(SlidePart slidePart, List<string> imgId)
        {
            List<Drawing.Blip> blip = slidePart.Slide.Descendants<Drawing.Blip>().ToList();
            int k = 0;
            foreach (Drawing.Blip b in blip)
            {
                if (k < imgId.Count)
                {
                    b.Embed = imgId[k];
                    k++;
                }
            }
            slidePart.Slide.Save();
        }
        public static bool urlExists(string url)
        {
            HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
            req.AllowAutoRedirect = false;
            try
            {
                HttpWebResponse res = (HttpWebResponse)req.GetResponse();

                if (res.StatusCode == HttpStatusCode.OK)
                    return true;
                else
                    return false;
            }
            catch
            {
                return false;
            }
        }
        private static void DeleteTemplateSlide(PresentationPart presentationPart, SlidePart slideTemplate, SlideId sldid)
        {
            //Get the list of slide ids.
            SlideIdList slideIdList = presentationPart.Presentation.SlideIdList;
            //Delete the template slide reference.
            foreach (SlideId slideId in slideIdList.ChildElements)
            {
                if (slideId.RelationshipId.Value.Equals(sldid)) slideIdList.RemoveChild(slideId);
            }
            //Delete the template slide.
            slideIdList.RemoveChild(sldid);
            presentationPart.DeletePart(slideTemplate);
        }
        public static bool URLExists(string url)
        {
            System.Net.WebRequest webRequest = System.Net.WebRequest.Create(url);
            webRequest.Method = "HEAD";
            try
            {
                using (System.Net.HttpWebResponse response = (System.Net.HttpWebResponse)webRequest.GetResponse())
                {
                    if (response.StatusCode.ToString() == "OK")
                    {
                        return true;
                    }
                    return false;
                }
            }
            catch
            {
                return false;
            }
        }
        public static byte[] GetDataFromURL(string url, string noImageURL)
        {
            var imgURL = url;
            if (!URLExists(url)) imgURL = noImageURL;

            WebClient wc = new WebClient();
            byte[] originalData = wc.DownloadData(imgURL);
            var image = Image.FromStream(new MemoryStream(originalData), true);
            foreach (var prop in image.PropertyItems)
            {
                if (prop.Id == 0x0112) //value of EXIF
                {
                    var orientation = prop.Value[0];
                    switch (orientation)
                    {
                        case 6:
                            image.RotateFlip(RotateFlipType.Rotate90FlipNone);
                            break;

                        case 3:
                            image.RotateFlip(RotateFlipType.Rotate180FlipNone);
                            break;
                        default:
                            break;
                    }
                }
            }

            byte[] rotated;
            using (var ms = new MemoryStream())
            {
                image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);
                rotated = ms.ToArray();
            }
            byte[] finalData = PPTFormat.ResizeImage(rotated);

            return finalData;
        }
        #endregion Export PPTX

        [HttpPost("ExportPPT")]
        public async Task<ResultInfo> ExportPPT([FromBody] string JsonData)
        {
            string folder = _webHostEnvironment.WebRootPath;
            string subfolder = "export/" + AccountId.ToString();
            if (!System.IO.Directory.Exists(Path.Combine(folder, subfolder)))
            {
                System.IO.Directory.CreateDirectory(Path.Combine(folder, subfolder));
            }
            string tempImage = Path.Combine(folder, "images/no_photo.jpg");
            string fileName = "Display Contest Report_" + string.Format("{0:yyyyMMddHHmmss}", DateTime.Now) + ".pptx";
            string fileExport = Path.Combine(folder, subfolder, fileName);
            string slideTemp = Path.Combine(folder, "export/template_MRC/tmp_Report Display Contest.pptx");
            System.IO.File.Copy(slideTemp, fileExport, true);

            try
            {
                var dataJson = JsonConvert.DeserializeObject<SearchModel>(JsonData);
                var lst = await Task.Run(() => _displayContestResultsService.ExportPPT(AccountId, UserId, JsonData));
                if (lst.Count > 0)
                {
                    using (PresentationDocument presentationDocument = PresentationDocument.Open(fileExport, true))
                    {
                        PresentationPart presentationPart = presentationDocument.PresentationPart;
                        SlideIdList slideIdList = presentationPart.Presentation.SlideIdList;
                        SlideId slideFist = slideIdList.GetFirstChild<SlideId>();
                        SlidePart slideTemplate_Fist = (SlidePart)presentationPart.GetPartById(slideFist.RelationshipId);

                        SlideId slideData = slideFist.NextSibling<SlideId>();
                        SlidePart slideTemplate_Data = (SlidePart)presentationPart.GetPartById(slideData.RelationshipId);

                        SwapPlaceholderText(slideTemplate_Fist, "fromDate", dataJson.fromdate);
                        SwapPlaceholderText(slideTemplate_Fist, "toDate", dataJson.todate);

                        int slidesStart = 2;
                        foreach (var item in lst)
                        {

                            SlidePart newSlide = CloneSlidePart(presentationPart, slideTemplate_Data, slidesStart);

                            SwapPlaceholderText(newSlide, "accountName", item.CustomerName);
                            SwapPlaceholderText(newSlide, "provinceName", item.ProvinceName);
                            SwapPlaceholderText(newSlide, "storeCode", item.ShopCode);
                            SwapPlaceholderText(newSlide, "StoreName", item.ShopName);
                            SwapPlaceholderText(newSlide, "employeeName", item.EmployeeName);

                            SwapPlaceholderText(newSlide, "Week", item.WeekName);
                            SwapPlaceholderText(newSlide, "dateVisit", item.WorkDate);
                            SwapPlaceholderText(newSlide, "status", item.Status);
                            //slidesStart++;

                            //FileStream fileStream = null;
                            List<string> lstImgId = new List<string>();
                            string imgId = string.Empty;
                            string noImageURL = "https://mrc.spiral.com.vn/images/noimage.jpg";
                            //--- Data


                            imgId = "I_" + item.ShopCode + "_DisplayContest1_" + Convert.ToString(item.RowNum);
                            byte[] originalData = GetDataFromURL(item.Image1, noImageURL);
                            MemoryStream stream = new MemoryStream(originalData);
                            ImagePart imagePart1 = newSlide.AddImagePart(ImagePartType.Jpeg, imgId);
                            imagePart1.FeedData(stream);
                            lstImgId.Add(imgId);


                            imgId = "I_" + item.ShopCode + "_DisplayContest2_" + Convert.ToString(item.RowNum);
                            originalData = GetDataFromURL(item.Image2, noImageURL);
                            stream = new MemoryStream(originalData);
                            imagePart1 = newSlide.AddImagePart(ImagePartType.Jpeg, imgId);
                            imagePart1.FeedData(stream);
                            lstImgId.Add(imgId);


                            imgId = "I_" + item.ShopCode + "_DisplayContest3_" + Convert.ToString(item.RowNum);
                            originalData = GetDataFromURL(item.Image3, noImageURL);
                            stream = new MemoryStream(originalData);
                            imagePart1 = newSlide.AddImagePart(ImagePartType.Jpeg, imgId);
                            imagePart1.FeedData(stream);
                            lstImgId.Add(imgId);

                            imgId = "I_" + item.ShopCode + "_DisplayContest4_" + Convert.ToString(item.RowNum);
                            originalData = GetDataFromURL(item.Image4, noImageURL);
                            stream = new MemoryStream(originalData);
                            imagePart1 = newSlide.AddImagePart(ImagePartType.Jpeg, imgId);
                            imagePart1.FeedData(stream);
                            lstImgId.Add(imgId);

                            PPTFormat.SwapPhoto(newSlide, lstImgId);
                            newSlide.Slide.Save();
                            lstImgId.Clear();
                            slidesStart++;



                        }
                        DeleteTemplateSlide(presentationPart, slideTemplate_Data, slideData);

                    }
                    return new ResultInfo(1, "Thành công", string.Format("{0}://{1}/{2}/{3}", Request.Scheme, Request.Host, subfolder, fileName));

                }
                else
                {
                    return new ResultInfo(0, "No data", null);
                }
            }
            catch (Exception ex)
            {
                return new ResultInfo(500, ex.Message.ToString(), null);
            }
        }
    }
}
