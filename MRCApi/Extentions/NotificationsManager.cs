using Azure.Core;
using DocumentFormat.OpenXml.Spreadsheet;
//using Google.Apis.Auth.OAuth2;
using Newtonsoft.Json;
using SpiralService;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class NotificationsManager
    {
        private static readonly NotificationsManager instance = new NotificationsManager();

        //It's very important that you're using the correct values here, 
        //the image form this answer shows you where to get them https://stackoverflow.com/a/39019669/3695939
        //-------- MRC
        private static string SERVER_KEY = "AAAAqNAPNqM:APA91bEON4b7VRA_ivoTOqY8nseUJCm1N8p1r4gRCjL8HveJ5Ti2lR9pBOv-yZAjOZxiy4wz6MnvZsqY0YnyAVETJWV19kcyGSyR-V9xWXVCTpKLFOzG9_lHT__7QTNCn40goUEG4EsG";
        private static string SENDER_ID = "725045163683";

        private const string DEVICE_ENDPOINT = "https://android.googleapis.com/gcm/notification";
        private const string MSG_ENDPOINT = "https://fcm.googleapis.com/v1/projects/marico-mt-a612d/messages:send";

        private HttpClient httpClient;

        static NotificationsManager()
        {
        }

        private NotificationsManager()
        {
            httpClient = new HttpClient();
        }

        public static NotificationsManager Instance
        {
            get
            {
                return instance;
            }
        }
        private static void GetProjectKey(int AccountId)
        {
            switch (AccountId)
            {
                case 1:
                    //--------MRC
                    SERVER_KEY = "AAAAqNAPNqM:APA91bEON4b7VRA_ivoTOqY8nseUJCm1N8p1r4gRCjL8HveJ5Ti2lR9pBOv-yZAjOZxiy4wz6MnvZsqY0YnyAVETJWV19kcyGSyR-V9xWXVCTpKLFOzG9_lHT__7QTNCn40goUEG4EsG";
                    SENDER_ID = "725045163683";
                    break;
                case 3:
                    SERVER_KEY = "AAAANHrKO0k:APA91bEGVhDZ-BObWKLRqKMaKtLWxY82UBIimE50Cppv0B3aKspP7fN7oyVZ-5bAAFk9KoboqoTOD0e5dIgqxn3swPdNMMe0QaksSebekM9dA7CMbw9zstjSx_Vssdq8FpN2f2evkG8U";
                    SENDER_ID = "225398373193";
                    break;
                default:
                    break;
            }
        }

        public static string CreateDeviceGroup(string user, string registrationId)
        {
            DeviceGroupData deviceGroupData = new DeviceGroupData();
            deviceGroupData.Operation = "create";
            deviceGroupData.NotificationKeyName = user;
            deviceGroupData.RegistrationIds.Add(registrationId);

            return DeviceGroupPost(deviceGroupData);
        }

        public static void AddDeviceToGroup(string user, string notificationKey, string registrationId)
        {
            DeviceGroupData deviceGroupData = new DeviceGroupData();
            deviceGroupData.Operation = "add";
            deviceGroupData.NotificationKeyName = user; //although it says on the doc this line is optional without it it returns Bad Request
            deviceGroupData.NotificationKey = notificationKey;
            deviceGroupData.RegistrationIds.Add(registrationId);

            DeviceGroupPost(deviceGroupData);
        }

        public static void RemoveDeviceFromGroup(string user, string notificationKey, string registrationId)
        {
            DeviceGroupData deviceGroupData = new DeviceGroupData();
            deviceGroupData.Operation = "remove";
            deviceGroupData.NotificationKeyName = user; //although it says on the doc this line is optional without it it returns Bad Request
            deviceGroupData.NotificationKey = notificationKey;
            deviceGroupData.RegistrationIds.Add(registrationId);

            DeviceGroupPost(deviceGroupData);
        }
        private static string DeviceGroupPost(DeviceGroupData deviceGroupData)
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(DEVICE_ENDPOINT);

            byte[] data = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(deviceGroupData));

            request.ProtocolVersion = HttpVersion.Version11;
            request.Method = "POST";
            request.ContentType = "application/json";
            request.Headers.Add(HttpRequestHeader.Authorization, "key=" + SERVER_KEY);
            request.Headers.Add("project_id", SENDER_ID);
            request.ContentLength = data.Length;

            Stream stream = request.GetRequestStream();
            stream.Write(data, 0, data.Length);
            stream.Close();

            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            if (response.StatusCode != HttpStatusCode.OK)
                throw new ArgumentException("Error");

            stream = response.GetResponseStream();
            StreamReader readStream = new StreamReader(stream, Encoding.UTF8);
            string info = readStream.ReadToEnd();
            var jsondata = JsonConvert.DeserializeObject<DeviceGroupData>(info);

            response.Close();
            readStream.Close();

            return jsondata.NotificationKey;
        }
        public static string SendMessageMultiple(JsonMessage regDevices, int AccountId)
        {
            try
            {
                GetProjectKey(AccountId);
                var result = "-1";
                var webAddr = "POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send";
                var httpWebRequest = (HttpWebRequest)WebRequest.Create(webAddr);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Headers.Add("Authorization: Bearer " + SERVER_KEY);
                httpWebRequest.Headers.Add(string.Format("Sender: id={0}", SENDER_ID));
                httpWebRequest.Method = "POST";
                string jsonNotificationFormat = Newtonsoft.Json.JsonConvert.SerializeObject(regDevices);

                using (var streamWriter = new StreamWriter(httpWebRequest.GetRequestStream()))
                {
                    string json = jsonNotificationFormat;
                    //registration_ids, array of strings -  to, single recipient
                    streamWriter.Write(json);
                    streamWriter.Flush();
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
                return "err";
            }
        }
        public class root
        {
            public message message { get; set; }
        }
        public class message
        {
            public string token { get; set; }
            public NotificationNew notification { get; set; }
            public IDictionary<string, string> data { get; set; }

        }

        // Class representing the Notification part of the JSON
        public class NotificationNew
        {
            public string title { get; set; }
            public string body { get; set; }
            public string image { get; set; }
        }
        public static HttpStatusCode SendMessage(int AccountId, string accessToken, string notificationsId, string title, string body, string action, string icon, string user, string link, string imageurl, string query, string jsondata)
        {
            try
            {
                GetProjectKey(AccountId);


                MessageData message1 = CreateMessage(notificationsId, title, body, action, icon, user, link, imageurl, query, jsondata);
                //string jsonNotificationFormat = Newtonsoft.Json.JsonConvert.SerializeObject(message);

                root root = new root();
                root.message = new message()
                {
                    token = notificationsId,
                    notification = new NotificationNew()
                    {
                        title = title,
                        body = body,
                        image = imageurl,
                    },
                    data = new Dictionary<string, string>()
                    {
                         {"action", action },
                         {"query", query },
                         {"jsondata", jsondata },
                         {"sendFrom", user },
                         {"hyperLinks",link },
                         {"image",imageurl}
                    }
                };

                string jsonNotificationFormat = Newtonsoft.Json.JsonConvert.SerializeObject(root);


                WebRequest tRequest = WebRequest.Create(MSG_ENDPOINT);
                tRequest.Method = "POST";
                tRequest.ContentType = "application/json";
                tRequest.Headers.Add($"Authorization: Bearer {accessToken}");
                //tRequest.Headers.Add(string.Format("Sender: id={0}", SENDER_ID));

                Byte[] byteArray = Encoding.UTF8.GetBytes(jsonNotificationFormat);
                tRequest.ContentLength = byteArray.Length;

                using (Stream dataStream = tRequest.GetRequestStream())
                {
                    dataStream.Write(byteArray, 0, byteArray.Length);

                    using (HttpWebResponse tResponse = (HttpWebResponse)tRequest.GetResponse())
                    {
                        //if (tResponse.StatusCode != HttpStatusCode.OK)
                        //    throw new ArgumentException("Error sending notification");

                        return tResponse.StatusCode;
                    }
                }
            }
            catch (WebException ex)
            {
                using (var errorResponse = ex.Response as HttpWebResponse)
                {
                    using (var reader = new StreamReader(errorResponse.GetResponseStream()))
                    {
                        string responseText = reader.ReadToEnd();
                        // Inspect the responseText for error details
                        Console.WriteLine($"Error: {responseText}");
                        return 0;
                    }
                }
            }
        }

        private static MessageData CreateMessage(string notificationsId, string _title, string _body, string _action, string _icon, string _user, string _link, string _imageurl, string _query = null, string _jsonData = null)
        {
            return new MessageData()
            {
                To = notificationsId, //the one you get for your device group
                Notification = new Notification()
                {
                    Body = _body,
                    Title = _title,
                    Icon = _icon,
                    Sound = "default"
                },
                Data = new Dictionary<string, string>
                        {
                            { "action", _action },
                            { "query", _query },
                            { "jsondata", _jsonData },
                            { "sendFrom", _user },
                            {"hyperLinks",_link },
                            {"image",_imageurl}
                        }
            };

        }

        public static void SendNotification(int AccountId, int EmployeeId, string title, string body, IMessengerService _messengerService, IEmployeeService _employeeService, string HiddenLink = null, string TypeReport = null)
        {
            var idMessage = 0;
            // insert database
            DataTable dt = new DataTable();
            dt.Columns.Add("Title", typeof(string));
            dt.Columns.Add("Body", typeof(string));
            dt.Columns.Add("UserId", typeof(int));
            dt.Columns.Add("CreatedBy", typeof(int));
            dt.Columns.Add("CreatedDate", typeof(DateTime));
            dt.Columns.Add("RefId", typeof(int));
            dt.Columns.Add("ActiveDate", typeof(DateTime));
            dt.Columns.Add("DisableDate", typeof(DateTime));
            dt.Columns.Add("Remove", typeof(int));
            dt.Columns.Add("HyperLink", typeof(string));

            DataRow dr = dt.NewRow();
            dr["Title"] = title;
            dr["Body"] = body;
            dr["UserId"] = EmployeeId;
            dr["CreatedBy"] = EmployeeId;
            dr["CreatedDate"] = DateTime.Now;
            dr["RefId"] = DBNull.Value;
            dr["ActiveDate"] = DateTime.Now;
            dr["DisableDate"] = DBNull.Value;
            dr["Remove"] = 0;
            if (!string.IsNullOrEmpty(HiddenLink) && !string.IsNullOrWhiteSpace(HiddenLink))
                dr["HyperLink"] = HiddenLink.Trim();
            else
                dr["HyperLink"] = "";
            dt.Rows.Add(dr);

            // Send Notification
            var lstToken = _employeeService.GetToken(AccountId, EmployeeId.ToString());
            var result = lstToken.GroupBy(x => x.Token).Select(s => s.First()).ToList();
            if (result.Count > 0)
            {
                List<string> lst = new List<string>();
                if (result.Count > 0)
                {
                    foreach (var item in result)
                    {
                        lst.Add(item.Token);
                    }
                    JsonMessage mes = new JsonMessage
                    {
                        RegistrationIds = lst,
                        Notification = new Notification
                        {
                            Title = title,
                            Body = body,
                            MessengerId = idMessage
                        },
                        Data = new Dictionary<string, string>
                                {
                                    { "messengerId", ""+idMessage }
                                },
                        Android = new Dictionary<string, string>
                            {
                                { "priority", "normal" }
                            }
                    };
                    var re = SendMessageMultiple(mes, AccountId);
                }
            }
        }
    }

    /*This class corresponds to the body of the DTO, for example:
      {
         "operation": "add",
         "notification_key_name": "appUser-Chris",
         "notification_key": "APA91bGHXQBB...9QgnYOEURwm0I3lmyqzk2TXQ",
         "registration_ids": ["51"]
      }
    */
    public class JsonMessage
    {
        [JsonProperty(PropertyName = "registration_ids", NullValueHandling = NullValueHandling.Ignore)]
        public List<string> RegistrationIds { get; set; }

        [JsonProperty(PropertyName = "notification", NullValueHandling = NullValueHandling.Ignore)]
        public Notification Notification { get; set; }

        [JsonProperty(PropertyName = "priority", NullValueHandling = NullValueHandling.Ignore)]
        public string Priority { get; set; }

        [JsonProperty(PropertyName = "data", NullValueHandling = NullValueHandling.Ignore)]
        public IDictionary<string, string> Data { get; set; }

        [JsonProperty(PropertyName = "android", NullValueHandling = NullValueHandling.Ignore)]
        public IDictionary<string, string> Android { get; set; }

    }

    public class DeviceGroupData
    {
        [JsonProperty(PropertyName = "operation", NullValueHandling = NullValueHandling.Ignore)]
        public string Operation { get; set; }
        [JsonProperty(PropertyName = "notification_key", NullValueHandling = NullValueHandling.Ignore)]
        public string NotificationKey { get; set; }
        [JsonProperty(PropertyName = "notification_key_name", NullValueHandling = NullValueHandling.Ignore)]
        public string NotificationKeyName { get; set; }
        [JsonProperty(PropertyName = "registration_ids", NullValueHandling = NullValueHandling.Ignore)]
        public List<string> RegistrationIds { get; set; }

        public DeviceGroupData()
        {
            RegistrationIds = new List<string>();
        }
    }

    public class MessageData
    {
        [JsonProperty(PropertyName = "to", NullValueHandling = NullValueHandling.Ignore)]
        public string To { get; set; }
        [JsonProperty(PropertyName = "notification", NullValueHandling = NullValueHandling.Ignore)]
        public Notification Notification { get; set; }
        [JsonProperty(PropertyName = "data", NullValueHandling = NullValueHandling.Ignore)]
        public IDictionary<string, string> Data { get; set; }

        public MessageData() { }
    }

    public class Notification
    {
        [JsonProperty(PropertyName = "body", NullValueHandling = NullValueHandling.Ignore)]
        public string Body { get; set; }
        [JsonProperty(PropertyName = "title", NullValueHandling = NullValueHandling.Ignore)]
        public string Title { get; set; }
        [JsonProperty(PropertyName = "icon", NullValueHandling = NullValueHandling.Ignore)]
        public string Icon { get; set; }
        [JsonProperty(PropertyName = "messengerId", NullValueHandling = NullValueHandling.Ignore)]
        public string Sound { get; set; }
        [JsonProperty(PropertyName = "sound", NullValueHandling = NullValueHandling.Ignore)]
        public int MessengerId { get; set; }

        public Notification() { }

    }
}
