using SpiralEntity;
using SpiralEntity.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;
using MRCApi.Extentions;
namespace MRCApi.Extentions
{
    public class EmailExtends
    {
        static string mailfrom = "system@spiral.com.vn";
        static string passfrom = "77SpiralDev22$";
        static string host = "mail.spiral.com.vn";
        static int Port = 25;
        public static int SendMail(string mailto, string mailcc, string subject, string body, List<string> file_Attach_url)
        {
            int status = 1;
            Boolean IsBodyHtml = true;
            SmtpClient client = new SmtpClient();
            mailto = mailto.Replace(" ", "").Replace(";", ",");
            MailMessage mail = new MailMessage(mailfrom, mailto);
            if (!string.IsNullOrEmpty(mailcc))
            {
                string[] addresses = mailcc.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var address in addresses)
                {
                    mail.CC.Add(address);
                }
            }
            try
            {
                mail.IsBodyHtml = IsBodyHtml;
                mail.BodyEncoding = System.Text.UTF8Encoding.UTF8;
                mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
                client.Port = Port;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.Host = host;
                client.Credentials = new System.Net.NetworkCredential(mailfrom, passfrom);
                mail.Subject = subject;
                if (file_Attach_url != null && file_Attach_url.Count() > 0)
                {
                    foreach (string item in file_Attach_url)
                    {
                        Attachment data = new Attachment(item, System.Net.Mime.MediaTypeNames.Application.Octet);
                        // Add time stamp information for the file.
                        System.Net.Mime.ContentDisposition disposition = data.ContentDisposition;
                        disposition.CreationDate = System.IO.File.GetCreationTime(item);
                        disposition.ModificationDate = System.IO.File.GetLastWriteTime(item);
                        disposition.ReadDate = System.IO.File.GetLastAccessTime(item);
                        mail.Attachments.Add(data);
                    }
                }
                mail.Body = body;
                client.Send(mail);
                status = 1;
            }
            catch (Exception ex)
            {
                status = 2;
                #region log
                try
                {
                    LogsEntity logInfo = new LogsEntity();
                    logInfo.Message = "SendMail";
                    logInfo.Type = 1;
                    logInfo.Trace = ex.Message + ": " + ex.StackTrace;
                }
                catch { }
                #endregion
            }
            finally
            {
                client.Dispose();
                mail.Dispose();
            }
            return status;
        }
        public static int SendMailFeedback(string mailto, string mailcc, string subject, DataTable dt)
        {
            int status = 1;
            var itemSend = dt.AsEnumerable().FirstOrDefault();
            string body = "<div style=\"width: 100 %; \">Dear Anh/Chị</div>" +
                          "<div style=\"width: 100 %; \">Spiral đã thực hiện audit chương trình EOE cho SR: " + itemSend + " tháng: " + string.Format("{0:MM/yyyy}", itemSend) + " </div>" +
                          "<div style=\"width: 100 %; \">Thông tin Outlet : " + itemSend + " - " + itemSend + " </div>" +
                          "<div style=\"width: 100 %; \">Địa chỉ: " + itemSend + " </div><br>";
            string htmlBody = body;
            Boolean IsBodyHtml = true;
            SmtpClient client = new SmtpClient();
            mailto = mailto.Replace(" ", "").Replace(";", ",");
            MailMessage mail = new MailMessage(mailfrom, mailto);
            if (!string.IsNullOrEmpty(mailcc))
            {
                string[] addresses = mailcc.Split(new[] { ";" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var address in addresses)
                {
                    mail.CC.Add(address);
                }
            }
            try
            {
                mail.IsBodyHtml = IsBodyHtml;
                mail.BodyEncoding = System.Text.UTF8Encoding.UTF8;
                mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
                client.Port = Port;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.Host = host;
                client.Credentials = new System.Net.NetworkCredential(mailfrom, passfrom);
                mail.Subject = subject;
                if (dt != null && dt.Rows.Count > 0)
                {
                    //foreach (var item in dt.Rows)
                    //{
                    //    htmlBody = htmlBody + "<div><b>" + item["EmployeeName"] + "</b>" + "<i> (" + string.Format("{0:yyyy-MM-dd HH:mm:ss}", item.CreatedDate) + ") </i>" + item.KPICode + " </div>" +
                    //                  "<div>" + item["Comment"] + "</div>";
                    //    if (!string.IsNullOrEmpty(Convert.ToString(item["ImagePath"])))
                    //    {


                    //        htmlBody = htmlBody + "<div style=\"height:50px\"> <img style=\"height:200px\" src='" + item.ImagePath + "'/> </div>";

                    //    }
                    //    htmlBody = htmlBody + "<br>";
                    //}
                }

                htmlBody = htmlBody + "<div>Đây là feedback từ SR và Spiral,  Anh/chị vui lòng xem báo cáo và phản hồi thông tin trên website https://eoe.spiral.com.vn/login</div>" +
                    "<div>Đây là email tự động, Vui lòng không phản hồi lại email này</div>";

                mail.Body = htmlBody;
                client.Send(mail);
                status = 1;
            }
            catch (Exception ex)
            {
                status = 2;
                throw ex;
            }
            finally
            {
                client.Dispose();
                mail.Dispose();
            }
            return status;
        }
        public static int SendMailResetPass(string HostAddress, string email, ref string password)
        {
            password = Utility.RandomPassword();
            var body = @"<body lang = EN - US link = ""#0563C1"" vlink = ""#954F72"" ><p class=MsoNormal>Dear Anh/ Chị<o:p></o:p></p><p class=MsoNormal>Anh / Chị vừa reset lại password tài khoản trên website của Spiral: " + HostAddress + "/login <o:p></o:p></p><p class=MsoNormal>Password reset của anh chị là: " + password + @"<o:p></o:p></p><p class=MsoNormal>Anh/ chị vui coAnh chị có thể thay đổi mật khẩu mới sau khi đăng nhập bằng mật khẩu vừa được cấp lại.<o:p></o:p></p><p class=MsoNormal>Cám ơn anh/ chị.<o:p>&nbsp;</o:p></p><p class=MsoNormal>Đây là email tự động, Vui lòng không phản hồi lại email này.<o:p></o:p></p></div></body>";
            return SendMail(email, null, "Mật khẩu mới", body, null);
        }
        public static int SendEmail_SpiralForm(int AccountId, EmailModel JsonData)
        {
            try
            {
                int result = 0;
                string date = DateTime.Now.ToString("dd/MM/yyyy");


                string subject = JsonData.Subtitle;
                string body = "<div style = \"color: #305496; font-family: 'Times New Roman', Times, serif; font-size: 14;\" >" +
                                "<p style = \"font-size: 14;\" > Dear anh / Chị </ p>" +
                                "<p style = \"font-size: 14; margin-left:20px \" >" + JsonData.Body + "</p>" +
                                "</br>" +
                                "<a href='" + JsonData.Link + "' target='_blank' >Link khảo sát</a>" +
                                "<p style = \"color: #F05454; \" > Đây là email tự động, Anh/ Chị vui lòng không phản hồi vào email này.</p>" +
                                "<p> Thank & Best Regard,</ p >" +
                                "</br>" +
                                "</div>";


                result = Task.Run(() => EmailExtends.SendMail(JsonData.To.TrimEnd(','), JsonData.Cc.TrimEnd(','), subject, body, null)).Result;

                return result;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

    }
}
