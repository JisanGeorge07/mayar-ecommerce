using Mayar.Api.Entities;

namespace Mayar.Api.Interfaces;

public interface IEmailService
{
    Task<bool> SendEmailAsync(string to, string subject, string body);

    Task<bool> SendPaymentReceiptAsync(Order order);

    Task<bool> SendOrderShippedEmailAsync(Order order, string trackingNumber);

    Task<bool> SendOrderDeliveredEmailAsync(Order order);
    Task<bool> SendPasswordResetEmailAsync(string email, string token);
}
