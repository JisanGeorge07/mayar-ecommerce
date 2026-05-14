using System.Net;
using System.Net.Mail;
using System.Text;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Microsoft.Extensions.Options;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class EmailService : IEmailService
{
    private readonly EmailSettingsDto _settings;
    private readonly ILogger<EmailService> _logger;
    private readonly IConfiguration _configuration;
    private const string StoreName = "Mayar";
    private const string StoreEmail = "support@mayar.com";
    private const string StorePhone = "+965 1234 5678";

    public EmailService(
        IOptions<EmailSettingsDto> settings,
        IConfiguration configuration,
        ILogger<EmailService> logger)
    {
        _settings = settings.Value;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            using var message = new MailMessage
            {
                From = new MailAddress(_settings.Sender, StoreName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            message.To.Add(to);
            using var smtp = new SmtpClient(_settings.Host, _settings.Port)
            {
                Credentials = new NetworkCredential(_settings.Username, _settings.Password),
                EnableSsl = _settings.EnableSsl
            };

            await smtp.SendMailAsync(message);
            _logger.LogInformation("Email sent successfully to {Email}", to);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Email sending failed to {Email}", to);
            return false;
        }
    }

    public async Task<bool> SendPaymentReceiptAsync(Order order)
    {
        if (string.IsNullOrWhiteSpace(order.CustomerEmail))
        {
            _logger.LogWarning("Cannot send receipt - no customer email for order {OrderNumber}", order.OrderNumber);
            return false;
        }

        try
        {
            var subject = $"Payment Receipt - Order #{order.OrderNumber}";
            var body = BuildPaymentReceiptHtml(order);

            return await SendEmailAsync(order.CustomerEmail, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send payment receipt for order {OrderNumber}", order.OrderNumber);
            return false;
        }
    }

    public async Task<bool> SendOrderShippedEmailAsync(Order order, string trackingNumber)
    {
        if (string.IsNullOrWhiteSpace(order.CustomerEmail))
        {
            _logger.LogWarning("Cannot send shipping notification - no customer email for order {OrderNumber}", order.OrderNumber);
            return false;
        }

        try
        {
            var subject = $"Your Order #{order.OrderNumber} Has Been Shipped!";
            var body = BuildOrderShippedHtml(order, trackingNumber);

            return await SendEmailAsync(order.CustomerEmail, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send shipping notification for order {OrderNumber}", order.OrderNumber);
            return false;
        }
    }

    public async Task<bool> SendOrderDeliveredEmailAsync(Order order)
    {
        if (string.IsNullOrWhiteSpace(order.CustomerEmail))
        {
            _logger.LogWarning("Cannot send delivery notification - no customer email for order {OrderNumber}", order.OrderNumber);
            return false;
        }

        try
        {
            var subject = $"Your Order #{order.OrderNumber} Has Been Delivered!";
            var body = BuildOrderDeliveredHtml(order);

            return await SendEmailAsync(order.CustomerEmail, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send delivery notification for order {OrderNumber}", order.OrderNumber);
            return false;
        }
    }

    public async Task<bool> SendPasswordResetEmailAsync(string email, string token)
    {
        try
        {
            var frontendUrl = _configuration["AppSettings:FrontendUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={token}";
            var subject = "Reset Your Password - Mayar";
            var body = BuildPasswordResetHtml(resetLink);

            return await SendEmailAsync(email, subject, body);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send password reset email to {Email}", email);
            return false;
        }
    }
    

    private string BuildPaymentReceiptHtml(Order order)
    {
        var currencySymbol = order.Currency?.ToUpper() == "INR" ? "₹" : "KD";
        var customerName = $"{order.CustomerFirstName} {order.CustomerLastName}".Trim();
        if (string.IsNullOrWhiteSpace(customerName)) customerName = "Valued Customer";

        var itemsHtml = new StringBuilder();
        foreach (var item in order.OrderItems)
        {
            var itemName = item.ProductNameEnglish ?? "Product";
            var variant = BuildVariantText(item.ProductSize, item.ProductColor);
            var unitPrice = item.UnitPrice ?? 0;
            var qty = item.Quantity ?? 1;
            var total = item.TotalPrice ?? (unitPrice * qty);

            itemsHtml.Append($@"
                <tr>
                    <td style=""padding: 16px; border-bottom: 1px solid #e5e7eb;"">
                        <div style=""display: flex; align-items: center;"">
                            {(string.IsNullOrWhiteSpace(item.ProductImageUrl) ? "" : $@"<img src=""{item.ProductImageUrl}"" alt=""{itemName}"" style=""width: 60px; height: 60px; object-fit: cover; border-radius: 8px; margin-right: 12px;"" />")}
                            <div>
                                <p style=""margin: 0; font-weight: 500; color: #1f2937;"">{itemName}</p>
                                {(string.IsNullOrWhiteSpace(variant) ? "" : $@"<p style=""margin: 4px 0 0 0; font-size: 13px; color: #6b7280;"">{variant}</p>")}
                            </div>
                        </div>
                    </td>
                    <td style=""padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;"">{qty}</td>
                    <td style=""padding: 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #1f2937; font-weight: 500;"">{currencySymbol} {total:N3}</td>
                </tr>");
        }

        var shippingAddress = BuildShippingAddressText(order);

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Payment Receipt</title>
</head>
<body style=""margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;"">
    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
        <tr>
            <td>
                <!-- Header -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 16px 16px 0 0;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;"">{StoreName}</h1>
                            <p style=""margin: 8px 0 0 0; color: #9ca3af; font-size: 14px;"">Payment Receipt</p>
                        </td>
                    </tr>
                </table>

                <!-- Success Banner -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center; border-bottom: 1px solid #e5e7eb;"">
                            <!--[if mso]>
                            <v:roundrect xmlns:v=""urn:schemas-microsoft-com:vml"" style=""width:64px;height:64px;"" arcsize=""50%"" fillcolor=""#10b981"" stroke=""f"">
                            <v:textbox inset=""0,0,0,0"" style=""mso-fit-shape-to-text:true;"">
                            <![endif]-->
                            <table cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" style=""margin: 0 auto 16px auto;"">
                                <tr>
                                    <td width=""64"" height=""64"" bgcolor=""#10b981"" style=""width: 64px; height: 64px; background-color: #10b981; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 32px; color: #ffffff; font-family: Arial, sans-serif;"">
                                        ✓
                                    </td>
                                </tr>
                            </table>
                            <!--[if mso]>
                            </v:textbox>
                            </v:roundrect>
                            <![endif]-->
                            <h2 style=""margin: 0 0 8px 0; color: #1f2937; font-size: 22px; font-weight: 600;"">Payment Successful!</h2>
                            <p style=""margin: 0; color: #6b7280; font-size: 15px;"">Thank you for your purchase, {customerName}</p>
                        </td>
                    </tr>
                </table>

                <!-- Order Info -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff;"">
                    <tr>
                        <td style=""padding: 24px;"">
                            <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f9fafb; border-radius: 12px;"">
                                <tr>
                                    <td style=""padding: 20px;"">
                                        <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                            <tr>
                                                <td style=""width: 50%;"">
                                                    <p style=""margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;"">Order Number</p>
                                                    <p style=""margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;"">#{order.OrderNumber}</p>
                                                </td>
                                                <td style=""width: 50%; text-align: right;"">
                                                    <p style=""margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;"">Order Date</p>
                                                    <p style=""margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;"">{order.CreatedAt:MMM dd, yyyy}</p>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""width: 100%;"">
                                                    <p style=""margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;"">Tracking Number</p>
                                                    <p style=""margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;"">#{order.TrackingId}</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Items Table -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff;"">
                    <tr>
                        <td style=""padding: 0 24px 24px 24px;"">
                            <h3 style=""margin: 0 0 16px 0; color: #1f2937; font-size: 16px; font-weight: 600;"">Order Items</h3>
                            <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;"">
                                <thead>
                                    <tr style=""background-color: #f9fafb;"">
                                        <th style=""padding: 12px 16px; text-align: left; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;"">Product</th>
                                        <th style=""padding: 12px 16px; text-align: center; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;"">Qty</th>
                                        <th style=""padding: 12px 16px; text-align: right; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 500;"">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemsHtml}
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Order Summary -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff;"">
                    <tr>
                        <td style=""padding: 0 24px 24px 24px;"">
                            <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f9fafb; border-radius: 12px;"">
                                <tr>
                                    <td style=""padding: 20px;"">
                                        <table width=""100%"" cellspacing=""0"" cellpadding=""0"">
                                            <tr>
                                                <td style=""padding: 8px 0; color: #6b7280;"">Subtotal</td>
                                                <td style=""padding: 8px 0; text-align: right; color: #1f2937;"">{currencySymbol} {order.SubTotal ?? 0:N3}</td>
                                            </tr>
                                            {(order.DiscountAmount > 0 ? $@"
                                            <tr>
                                                <td style=""padding: 8px 0; color: #10b981;"">Discount {(string.IsNullOrWhiteSpace(order.PromoCode) ? "" : $"({order.PromoCode})")}</td>
                                                <td style=""padding: 8px 0; text-align: right; color: #10b981;"">-{currencySymbol} {order.DiscountAmount:N3}</td>
                                            </tr>" : "")}
                                            <tr>
                                                <td style=""padding: 8px 0; color: #6b7280;"">Shipping</td>
                                                <td style=""padding: 8px 0; text-align: right; color: #1f2937;"">{(order.ShippingCost > 0 ? $"{currencySymbol} {order.ShippingCost:N3}" : "Free")}</td>
                                            </tr>
                                            {(order.TaxAmount > 0 ? $@"
                                            <tr>
                                                <td style=""padding: 8px 0; color: #6b7280;"">Tax</td>
                                                <td style=""padding: 8px 0; text-align: right; color: #1f2937;"">{currencySymbol} {order.TaxAmount:N3}</td>
                                            </tr>" : "")}
                                            <tr>
                                                <td colspan=""2"" style=""padding: 12px 0 0 0;"">
                                                    <hr style=""border: none; border-top: 1px solid #e5e7eb; margin: 0;"" />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style=""padding: 12px 0 0 0; font-size: 18px; font-weight: 700; color: #1f2937;"">Total Paid</td>
                                                <td style=""padding: 12px 0 0 0; text-align: right; font-size: 18px; font-weight: 700; color: #1f2937;"">{currencySymbol} {order.TotalAmount ?? 0:N3}</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>

                <!-- Shipping Address -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff;"">
                    <tr>
                        <td style=""padding: 0 24px 24px 24px;"">
                            <h3 style=""margin: 0 0 12px 0; color: #1f2937; font-size: 16px; font-weight: 600;"">Shipping Address</h3>
                            <p style=""margin: 0; color: #4b5563; line-height: 1.6;"">{shippingAddress}</p>
                            {(string.IsNullOrWhiteSpace(order.ShippingMethodNameEn) ? "" : $@"<p style=""margin: 12px 0 0 0; color: #6b7280; font-size: 14px;""><strong>Shipping Method:</strong> {order.ShippingMethodNameEn} {(string.IsNullOrWhiteSpace(order.ShippingEstimateEn) ? "" : $"({order.ShippingEstimateEn})")}</p>")}
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #1f2937; border-radius: 0 0 16px 16px;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <p style=""margin: 0 0 8px 0; color: #ffffff; font-size: 16px; font-weight: 500;"">Questions about your order?</p>
                            <p style=""margin: 0 0 16px 0; color: #9ca3af; font-size: 14px;"">Contact us at <a href=""mailto:{StoreEmail}"" style=""color: #60a5fa; text-decoration: none;"">{StoreEmail}</a></p>
                            <p style=""margin: 0; color: #6b7280; font-size: 12px;"">© {DateTimeHelper.GetLocalTime().Year} {StoreName}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    private string BuildOrderShippedHtml(Order order, string trackingNumber)
    {
        var customerName = $"{order.CustomerFirstName} {order.CustomerLastName}".Trim();
        if (string.IsNullOrWhiteSpace(customerName)) customerName = "Valued Customer";

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
</head>
<body style=""margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;"">
    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
        <tr>
            <td>
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 16px 16px 0 0;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;"">{StoreName}</h1>
                        </td>
                    </tr>
                </table>

                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff; border-radius: 0 0 16px 16px;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <div style=""font-size: 48px; margin-bottom: 16px;"">📦</div>
                            <h2 style=""margin: 0 0 8px 0; color: #1f2937; font-size: 22px;"">Your Order is On Its Way!</h2>
                            <p style=""margin: 0 0 24px 0; color: #6b7280;"">Hi {customerName}, your order #{order.OrderNumber} has been shipped.</p>

                            <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #f9fafb; border-radius: 12px; margin-bottom: 24px;"">
                                <tr>
                                    <td style=""padding: 20px; text-align: center;"">
                                        <p style=""margin: 0 0 4px 0; font-size: 12px; color: #6b7280; text-transform: uppercase;"">Tracking Number</p>
                                        <p style=""margin: 0; font-size: 18px; color: #1f2937; font-weight: 600;"">{trackingNumber}</p>
                                    </td>
                                </tr>
                            </table>

                            <p style=""margin: 0; color: #6b7280; font-size: 14px;"">Estimated delivery: {order.ShippingEstimateEn ?? "3-5 business days"}</p>
                        </td>
                    </tr>
                </table>

                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""margin-top: 24px;"">
                    <tr>
                        <td style=""text-align: center;"">
                            <p style=""margin: 0; color: #6b7280; font-size: 12px;"">© {DateTimeHelper.GetLocalTime().Year} {StoreName}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    private string BuildOrderDeliveredHtml(Order order)
    {
        var customerName = $"{order.CustomerFirstName} {order.CustomerLastName}".Trim();
        if (string.IsNullOrWhiteSpace(customerName)) customerName = "Valued Customer";

        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
</head>
<body style=""margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;"">
    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
        <tr>
            <td>
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 16px 16px 0 0;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;"">{StoreName}</h1>
                        </td>
                    </tr>
                </table>

                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff; border-radius: 0 0 16px 16px;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <table cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" style=""margin: 0 auto 16px auto;"">
                                <tr>
                                    <td width=""64"" height=""64"" bgcolor=""#10b981"" style=""width: 64px; height: 64px; background-color: #10b981; border-radius: 50%; text-align: center; vertical-align: middle; font-size: 32px; color: #ffffff; font-family: Arial, sans-serif;"">
                                        ✓
                                    </td>
                                </tr>
                            </table>
                            <h2 style=""margin: 0 0 8px 0; color: #1f2937; font-size: 22px;"">Order Delivered!</h2>
                            <p style=""margin: 0 0 24px 0; color: #6b7280;"">Hi {customerName}, your order #{order.OrderNumber} has been delivered.</p>
                            <p style=""margin: 0; color: #6b7280; font-size: 14px;"">Thank you for shopping with us! We hope you love your purchase.</p>
                        </td>
                    </tr>
                </table>

                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""margin-top: 24px;"">
                    <tr>
                        <td style=""text-align: center;"">
                            <p style=""margin: 0; color: #6b7280; font-size: 12px;"">© {DateTimeHelper.GetLocalTime().Year} {StoreName}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }

    private static string BuildVariantText(string? size, string? color)
    {
        var parts = new List<string>();
        if (!string.IsNullOrWhiteSpace(size)) parts.Add($"Size: {size}");
        if (!string.IsNullOrWhiteSpace(color)) parts.Add($"Color: {color}");
        return string.Join(" | ", parts);
    }

    private static string BuildShippingAddressText(Order order)
    {
        var parts = new List<string>();

        if (!string.IsNullOrWhiteSpace(order.ShippingArea)) parts.Add(order.ShippingArea);
        if (!string.IsNullOrWhiteSpace(order.ShippingBlock)) parts.Add($"Block {order.ShippingBlock}");
        if (!string.IsNullOrWhiteSpace(order.ShippingStreet)) parts.Add($"Street {order.ShippingStreet}");
        if (!string.IsNullOrWhiteSpace(order.ShippingBuilding)) parts.Add($"Building {order.ShippingBuilding}");
        if (!string.IsNullOrWhiteSpace(order.ShippingFloor)) parts.Add($"Floor {order.ShippingFloor}");
        if (!string.IsNullOrWhiteSpace(order.ShippingFlatOffice)) parts.Add($"Flat/Office {order.ShippingFlatOffice}");

        return parts.Count > 0 ? string.Join("<br/>", parts) : "Address not provided";
    }

    private string BuildPasswordResetHtml(string resetLink)
    {
        return $@"
<!DOCTYPE html>
<html>
<head>
    <meta charset=""UTF-8"">
    <meta name=""viewport"" content=""width=device-width, initial-scale=1.0"">
    <title>Reset Your Password</title>
</head>
<body style=""margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;"">
    <table role=""presentation"" width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""max-width: 600px; margin: 0 auto; padding: 20px;"">
        <tr>
            <td>
                <!-- Header -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background: linear-gradient(135deg, #1f2937 0%, #374151 100%); border-radius: 16px 16px 0 0;"">
                    <tr>
                        <td style=""padding: 32px; text-align: center;"">
                            <h1 style=""margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;"">{StoreName}</h1>
                        </td>
                    </tr>
                </table>

                <!-- Content -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""background-color: #ffffff; border-radius: 0 0 16px 16px;"">
                    <tr>
                        <td style=""padding: 40px; text-align: center;"">
                            <div style=""font-size: 48px; margin-bottom: 24px;"">🔐</div>
                            <h2 style=""margin: 0 0 16px 0; color: #1f2937; font-size: 24px; font-weight: 700;"">Password Reset Request</h2>
                            <p style=""margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;"">
                                We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
                            </p>
                            
                            <table cellspacing=""0"" cellpadding=""0"" border=""0"" align=""center"" style=""margin: 0 auto;"">
                                <tr>
                                    <td align=""center"" bgcolor=""#1f2937"" style=""border-radius: 8px;"">
                                        <a href=""{resetLink}"" target=""_blank"" style=""display: inline-block; padding: 16px 32px; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: 600;"">Reset My Password</a>
                                    </td>
                                </tr>
                            </table>

                            <p style=""margin: 32px 0 0 0; color: #9ca3af; font-size: 14px;"">
                                This link will expire in 1 hour.
                            </p>
                            
                            <hr style=""margin: 32px 0; border: none; border-top: 1px solid #e5e7eb;"" />
                            
                            <p style=""margin: 0; color: #6b7280; font-size: 14px;"">
                                If the button above doesn't work, copy and paste this link into your browser:
                            </p>
                            <p style=""margin: 8px 0 0 0; color: #3b82f6; font-size: 13px; word-break: break-all;"">
                                {resetLink}
                            </p>
                        </td>
                    </tr>
                </table>

                <!-- Footer -->
                <table width=""100%"" cellspacing=""0"" cellpadding=""0"" style=""margin-top: 24px;"">
                    <tr>
                        <td style=""text-align: center;"">
                            <p style=""margin: 0; color: #6b7280; font-size: 12px;"">© {DateTimeHelper.GetLocalTime().Year} {StoreName}. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>";
    }
}
