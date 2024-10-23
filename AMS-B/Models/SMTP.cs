using System;
using System.Net;
using System.Net.Mail;

public class EmailDetails
{
    public required string SenderEmail { get; set; }
    public required string SenderPassword { get; set; }
    public required string RecipientEmail { get; set; }
    public required string EmailBody { get; set; }
    public required string EmailSubject { get; set; }
}
public class SMTP
{
    public static async Task<string> SendEmailAsync(string senderEmail, string senderPassword, string recipientEmail, string emailBody, string emailSubject)
    {
        var mailMessage = new MailMessage(senderEmail, recipientEmail)
        {
            From = new MailAddress(senderEmail),
            Subject = emailSubject,
            Body = emailBody
        };

        var smtpClient = new SmtpClient("smtp.gmail.com.")
        {
            Host = "smtp.gmail.com.",
            Port = 587,
            UseDefaultCredentials = false,
            Credentials = new NetworkCredential(senderEmail, senderPassword),
            EnableSsl = true
        };

        try
        {
            await smtpClient.SendMailAsync(mailMessage);
            return "Email Sent Successfully.";
        }
        catch (Exception ex)
        {
            return "Error: " + ex.Message;
        }
    }
}
