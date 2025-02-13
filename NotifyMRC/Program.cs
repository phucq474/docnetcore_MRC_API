using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace NotifyTSMRC
{
    class Program
    {
        private static string SERVER_KEY = "AAAAqNAPNqM:APA91bEON4b7VRA_ivoTOqY8nseUJCm1N8p1r4gRCjL8HveJ5Ti2lR9pBOv-yZAjOZxiy4wz6MnvZsqY0YnyAVETJWV19kcyGSyR-V9xWXVCTpKLFOzG9_lHT__7QTNCn40goUEG4EsG";
        private static string SENDER_ID = "725045163683";
        private const string DEVICE_ENDPOINT = "https://android.googleapis.com/gcm/notification";
        private const string MSG_ENDPOINT = "https://fcm.googleapis.com/fcm/send";
        static void Main(string[] args)
        {
            Console.WriteLine("Hello World!");
            Console.WriteLine(Send());

            System.Environment.Exit(0);
        }
        static private string GetConnectionString()
        {
            return "Data Source=210.245.20.245,49718;Initial Catalog=MaricoMT;User ID=MaricoWeb;Password=Marico2018@";
        }
        public static string Send()
        {
            var result = "";
            using (DataTable dt = Auto_SendNotification())
            {
                if (dt.Rows.Count > 0)
                {
                    if (Convert.ToString(dt.Rows[0]["TypeReport"].ToString()) == "Timesheets")
                    {
                        DataTable data_ntf = new DataTable();
                        data_ntf.Columns.Add("EmployeeId", typeof(int));
                        data_ntf.Columns.Add("NotifyDate", typeof(DateTime));
                        data_ntf.Columns.Add("Token", typeof(string));
                        data_ntf.Columns.Add("FromDate", typeof(DateTime));
                        data_ntf.Columns.Add("ToDate", typeof(DateTime));

                        foreach (DataRow item in dt.Rows)
                        {
                            List<string> lsttoken = new List<string>();
                            lsttoken.Add(item["Token"].ToString());
                            DataRow drNew = data_ntf.NewRow();
                            drNew["EmployeeId"] = item["EmployeeId"];
                            drNew["NotifyDate"] = item["NotifyDate"];
                            drNew["Token"] = item["Token"];
                            drNew["FromDate"] = item["FromDate"];
                            drNew["ToDate"] = item["ToDate"];
                            data_ntf.Rows.Add(drNew);

                            JsonMessage mes = new JsonMessage
                            {
                                RegistrationIds = lsttoken,
                                Notification = new Notification
                                {
                                    Sound = "default",
                                    Title = item["Title"].ToString(),
                                    Body = item["Body"].ToString()
                                },
                                Data = new Dictionary<string, string>
                                {
                                    { "bodyName", item["Body"].ToString() },
                                    { "sendFrom", "Admin" },
                                    {"hyperLinks",item["HyperLinks"].ToString() },
                                    {"image",""}

                                }
                            };
                            result = SendMessageMultiple(mes);
                        }
                        var value = Auto_Update(dt.Rows[0]["TypeReport"].ToString(), data_ntf);
                    }
                    else
                    {
                        DataRow[] drResult;
                        DataView view = new DataView(dt);

                        DataTable distinctValues = view.ToTable(true, "NotifyId");

                        foreach (DataRow dr in distinctValues.Rows)
                        {
                            int count = 0;
                            drResult = dt.Select("NotifyId='" + dr["NotifyId"] + "'");
                            if (drResult.Length > 0)
                            {
                                DataTable dtWeekly = new DataTable();
                                dtWeekly.Columns.Add("EmployeeId", typeof(int));
                                dtWeekly.Columns.Add("NotifyDate", typeof(DateTime));
                                dtWeekly.Columns.Add("Token", typeof(string));

                                List<string> lstWeekly = new List<string>();
                                foreach (DataRow item in drResult)
                                {
                                    lstWeekly.Add(item["Token"].ToString());
                                    DataRow drNew = dtWeekly.NewRow();
                                    drNew["EmployeeId"] = item["EmployeeId"];
                                    drNew["NotifyDate"] = item["NotifyDate"];
                                    drNew["Token"] = item["Token"];
                                    dtWeekly.Rows.Add(drNew);
                                    count++;
                                    if (count == 990)
                                    {
                                        JsonMessage mesWeekly = new JsonMessage
                                        {
                                            RegistrationIds = lstWeekly,
                                            Notification = new Notification
                                            {
                                                Sound = "default",
                                                Title = item["Title"].ToString(),
                                                Body = item["Body"].ToString()
                                            },
                                            Data = new Dictionary<string, string>
                                        {
                                            { "bodyName", item["Body"].ToString() },
                                            { "sendFrom", "Admin" },
                                            {"hyperLinks",item["HyperLinks"].ToString() },
                                            {"image",""}

                                        }
                                        };

                                        result = SendMessageMultiple(mesWeekly);
                                        count = 0;
                                        lstWeekly.Clear();
                                    }
                                }
                                JsonMessage mesWeekly1 = new JsonMessage
                                {
                                    RegistrationIds = lstWeekly,
                                    Notification = new Notification
                                    {
                                        Sound = "default",
                                        Title = drResult[0]["Title"].ToString(),
                                        Body = drResult[0]["Body"].ToString()
                                    },
                                    Data = new Dictionary<string, string>
                                        {
                                            { "bodyName", drResult[0]["Body"].ToString() },
                                            { "sendFrom", "Admin" },
                                            {"hyperLinks",drResult[0]["HyperLinks"].ToString() },
                                            {"image",""}

                                        }
                                };

                                result = SendMessageMultiple(mesWeekly1);
                                var value = Auto_Update(drResult[0]["TypeReport"].ToString(), dtWeekly);
                            }
                        }

                    }

                    return result;
                }
                else return "nodata";
            }

        }
        // FCM
        #region FCM
        public class Notification
        {
            [JsonProperty(PropertyName = "body", NullValueHandling = NullValueHandling.Ignore)]
            public string Body { get; set; }
            [JsonProperty(PropertyName = "title", NullValueHandling = NullValueHandling.Ignore)]
            public string Title { get; set; }
            [JsonProperty(PropertyName = "icon", NullValueHandling = NullValueHandling.Ignore)]
            public string Sound { get; set; }
            [JsonProperty(PropertyName = "sound", NullValueHandling = NullValueHandling.Ignore)]
            public string Icon { get; set; }

            public Notification() { }

        }

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
        }

        public static string SendMessageMultiple(JsonMessage regDevices)
        {
            try
            {
                var result = "-1";
                var webAddr = "https://fcm.googleapis.com/fcm/send";

                var httpWebRequest = (HttpWebRequest)WebRequest.Create(webAddr);
                httpWebRequest.ContentType = "application/json";
                httpWebRequest.Headers.Add("Authorization:key=" + SERVER_KEY);
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
        #endregion
        public static DataTable Auto_SendNotification()
        {
            string connectionString = GetConnectionString();
            using (SqlConnection conn = new SqlConnection())
            {
                conn.ConnectionString = connectionString;
                try
                {
                    conn.Open();
                    DataTable dt = new DataTable();

                    SqlCommand command = new SqlCommand("[dbo].[Messenger.Auto.SendNotification]", conn);
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "[dbo].[Messenger.Auto.SendNotification]";
                    //command.ExecuteNonQuery();

                    SqlDataAdapter da = new SqlDataAdapter();
                    da.SelectCommand = command;

                    da.Fill(dt);
                    return dt;
                }
                catch (Exception ex)
                {

                    throw ex;
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }

            }

        }
        public static int Auto_Update(string Type, DataTable tb)
        {
            string connectionString = GetConnectionString();
            using (SqlConnection conn = new SqlConnection())
            {
                conn.ConnectionString = connectionString;
                try
                {
                    conn.Open();
                    SqlCommand command = new SqlCommand("[dbo].[Messenger.Auto.Update]", conn);
                    command.CommandType = CommandType.StoredProcedure;
                    command.CommandText = "[dbo].[Messenger.Auto.Update]";
                    command.Parameters.Add(new SqlParameter("@Type", Type));
                    command.Parameters.Add(new SqlParameter("@tb", tb));
                    command.ExecuteNonQuery();
                    conn.Close();
                    conn.Dispose();
                    return 1;
                }
                catch (Exception ex)
                {

                    throw ex;
                }
                finally
                {
                    conn.Close();
                    conn.Dispose();
                }
            }
        }


    }
}
