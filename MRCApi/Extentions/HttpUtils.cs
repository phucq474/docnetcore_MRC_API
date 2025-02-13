using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class HttpUtils
    {
        public class ApiResultInfo
        {
            public string code { get; set; }
            public string message { get; set; }
            public string data { get; set; }
        }
        public static string URL_SELLOUT = "https://gateways.aquavietnam.com.vn/Spiral/GetSellOut/";
        public static string URL_ATTENDANT = "https://gateways.aquavietnam.com.vn/Spiral/Attendance/";
        public async static Task<string> PostAction(string json)
        {
            try
            {
                string result;
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(URL_SELLOUT);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";
                httpWebRequest.Headers.Add("authorizedtoken", "admin 81ji=N4rO:-1ls07f0sjwOYi==:i7X69798ZeZ*27CqOCMu9kBsX*8CuCBj=pvY6hC8qYA3u34qu*kf2ue:5fj-=7O");
                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(json);
                }
                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    result = await streamReader.ReadToEndAsync();
                }
                return result;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }
        public async static Task<string> GetAttendant(string query)
        {
            HttpClient client = new HttpClient();
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(URL_ATTENDANT),
                Content = new StringContent(query, Encoding.UTF8, "application/json"),
            };
            request.Headers.Add("authorizedtoken", "admin 81ji=N4rO:-1ls07f0sjwOYi==:i7X69798ZeZ*27CqOCMu9kBsX*8CuCBj=pvY6hC8qYA3u34qu*kf2ue:5fj-=7O");
            var response = await client.SendAsync(request);
            var responseInfo = await response.Content.ReadAsStringAsync();
            return responseInfo;
        }
    }
}
