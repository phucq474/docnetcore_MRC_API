using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class GetAddressFromLatLong
    {
        public static string GetAddress(string latLong)
        {
            try
            {
                var result = "-1";
                var webAddr = "https://casper-api.sucbat.com.vn/public/geolatlng";

                ServicePointManager.Expect100Continue = true;
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(webAddr);

                ServicePointManager.ServerCertificateValidationCallback = delegate (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) { return true; };

                // httpWebRequest.Headers.Add("Authorization", token);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Method = "POST";
                httpWebRequest.Accept = "application/json";
                httpWebRequest.ContentLength = latLong.Length;
                httpWebRequest.AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate;

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    streamWriter.Write(latLong);
                    streamWriter.Flush();
                    streamWriter.Close();
                }

                var httpResponse = (HttpWebResponse)httpWebRequest.GetResponse();
                using (var streamReader = new StreamReader(httpResponse.GetResponseStream()))
                {
                    result = streamReader.ReadToEnd();
                }

                return result;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return ex.ToString();
            }
        }

        public static async Task<string> GetAddress1(string latLong)
        {
            HttpClient client = new HttpClient();
            //string Url = "https://casper-api.sucbat.com.vn/public/geolatlng";
           string Url = String.Format("https://rsapi.goong.io/geocode?latlng={0}&api_key=4PxqBvFXIWyclLvdPV9YkTK0HxmciR3AuNS0peNS", latLong);
            var request = new HttpRequestMessage
            {
                RequestUri = new Uri(Url),
                Method = HttpMethod.Get,
                //Headers = {
                //     { "X-Version", "1" }, // HERE IS HOW TO ADD HEADERS
                //   // { HttpRequestHeader.Authorization.ToString(),""},
                //    { HttpRequestHeader.Accept.ToString(), "application/json" } ,
                //    { HttpRequestHeader.ContentType.ToString(), "application/json" } ,
                //},
                Content = new StringContent(latLong, Encoding.UTF8, "application/json"),
            };
            var response = await client.SendAsync(request);
            var responseInfo = await response.Content.ReadAsStringAsync();
            return responseInfo;
        }
    }
}