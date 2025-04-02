using System.Net;
using System.Net.Mail;

namespace API.Services
{
    public class MailService
    {
        public static bool MailSender( string emailAdress, string subject, string body) {
            var res = false;
            MailMessage mail = new MailMessage();
            SmtpClient smtpClient = new SmtpClient("smtp.gmail.com");
            if (!res)
            {
                mail.From = new MailAddress("jouinim38@gmail.com", "title");
                mail.To.Add(emailAdress);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                smtpClient.Port = 587;
                smtpClient.EnableSsl = true;
                smtpClient.Credentials = new NetworkCredential("jouinim38@gmail.com", "nmmf pzft qdzk dgyp");
                smtpClient.Send(mail);

                res = true;
            }
            return res;

        }
    }
}
