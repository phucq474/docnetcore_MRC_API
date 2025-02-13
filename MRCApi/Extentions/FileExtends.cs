using System.Drawing;
using System.IO;
using System.Collections.Generic;
using System;
using imageFile = System.Drawing;
using System.Text.RegularExpressions;

namespace MRCApi.Extentions
{
    public class ImageInfo
    {
        public ImageInfo(string _url, string _FileName = null, string _FileType = null, int? _Index = 0)
        {
            this.Url = _url;
            this.FileName = _FileName;
            this.FileType = _FileType;
            this.Index = _Index;
        }
        public string Url { set; get; }
        public string FileName { get; set; }
        public string FileType { get; set; }
        public int? Index { get; set; }
    }
    public class FileExtends
    {
        public static imageFile.Image Base64ToImage(string base64String)
        {
            // Convert base 64 string to byte[]
            base64String = base64String.Replace("data:image/jpeg;base64,", "");
            byte[] imageBytes = Convert.FromBase64String(base64String);
            // Convert byte[] to Image
            using (var ms = new MemoryStream(imageBytes, 0, imageBytes.Length))
            {
                imageFile.Image image = imageFile.Image.FromStream(ms, true);
                return image;
            }
        }
        public static byte[] Base64ToByte(string base64String)
        {
            // Convert base 64 string to byte[]
            base64String = base64String.Replace("data:image/jpeg;base64,", "");
            byte[] imageBytes = Convert.FromBase64String(base64String);
            return imageBytes;
        }
        public static string boDau(string accented)
        {
            Regex regex = new Regex(@"\p{IsCombiningDiacriticalMarks}+");
            string strFormD = accented.Normalize(System.Text.NormalizationForm.FormD);
            return regex.Replace(strFormD, String.Empty).Replace('\u0111', 'd').Replace('\u0110', 'D');
        }
        public static string boKhoangTrang(string r, string Value = " ", string Replace = "")
        {
            if (!string.IsNullOrEmpty(Convert.ToString(r)) && r.Contains(Value) == true)
            {
                string Code = r.ToString();
                Code = r.Replace(Value, Replace);
                return Code;
            }
            return r;
        }
    }
}
