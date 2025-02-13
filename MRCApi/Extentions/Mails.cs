using SpiralService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace MRCApi.Extentions
{
    public class Mails
    {
        public const String HostMail = "mail.spiral.com.vn";
        public const String Sender = "service@spiral.com.vn";
        public const String Pass = "Supspi@0201";
        public async static Task<bool> SendMail(string mailto, string mailcc, string subject, string body, List<string> file_Attach_url, int UserId, string ReplyTo, DateTime SendDate, string Signature)
        {
            SmtpClient client = new SmtpClient();
            MailMessage mail = new MailMessage(Sender, mailto);
            if (!string.IsNullOrEmpty(mailcc))
                mail.CC.Add(mailcc);
            if (!string.IsNullOrEmpty(ReplyTo))
                mail.ReplyToList.Add(ReplyTo);
            try
            {
                mail.IsBodyHtml = true;
                mail.BodyEncoding = System.Text.UTF8Encoding.UTF8;
                mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;
                client.Port = 25;
                client.DeliveryMethod = SmtpDeliveryMethod.Network;
                client.UseDefaultCredentials = false;
                client.Host = HostMail;
                client.Credentials = new System.Net.NetworkCredential(Sender, Pass);
                mail.Subject = subject;
                //file_Attach_url.Add("D:\\backup_month8.xlsx");
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
                if (!string.IsNullOrEmpty(Signature))
                    body += Signature;
                mail.Body = body;
                client.Send(mail);
                client.Dispose();
                mail.Dispose();
                return true;
            }
            catch (Exception ex)
            {
                return false;
                //int RunResult = await Task.Run(() => _employeeService.EmailContents_Insert(UserId, ReplyTo, mailto, mailcc, subject, body, Signature, SendDate, 0));
            }
            finally
            {
                client.Dispose();
                mail.Dispose();
            }
        }
    }
}
