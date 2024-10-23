using System;
using System.IO;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

public class SMTP
{
    public static async Task<string> SendEmailAsync(string recipientEmail, string emailSubject, string emailBody)
    {
        
        var builder = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
            .AddUserSecrets<Program>();

        var configuration = builder.Build();

       
        string? senderEmail = configuration["SMTPSettings:SenderEmail"];
        string? senderPassword = configuration["SMTPSettings:SenderPassword"];

        if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPassword))
        {
            throw new InvalidOperationException("Sender email or password is not configured properly.");
        }


        var mailMessage = new MailMessage(senderEmail, recipientEmail)
        {
            From = new MailAddress(senderEmail),
            Subject = emailSubject,
            Body = emailBody
        };

        var smtpClient = new SmtpClient("outlook.office365.com")
        {
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


