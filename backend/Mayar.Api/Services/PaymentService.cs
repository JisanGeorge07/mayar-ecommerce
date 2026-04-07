using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace Mayar.Api.Services;

public class PaymentService : IPaymentService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;
    private readonly ILogger<PaymentService> _logger;
    private readonly HttpClient _httpClient;

    private readonly string _defaultApiToken;
    private readonly string _baseUrl;
    private readonly bool _isTestMode;

    public PaymentService(
        AppDbContext context,
        IConfiguration configuration,
        ILogger<PaymentService> logger,
        IHttpClientFactory httpClientFactory)
    {
        _context = context;
        _configuration = configuration;
        _logger = logger;
        _httpClient = httpClientFactory.CreateClient("MyFatoorah");

        _defaultApiToken = _configuration["MyFatoorah:ApiToken"]
            ?? _configuration["MyFatoorah:ApiTokenKWT"]
            ?? string.Empty;
        _isTestMode = _configuration.GetValue<bool>("MyFatoorah:IsTestMode", true);
        _baseUrl = _isTestMode
            ? "https://apitest.myfatoorah.com"
            : "https://api.myfatoorah.com";

        if (string.IsNullOrWhiteSpace(_defaultApiToken))
        {
            _logger.LogError("MyFatoorah API token is not configured. Please add MyFatoorah:ApiToken in appsettings.json");
        }
        else
        {
            _logger.LogInformation("MyFatoorah configured with {Environment} environment. Token length: {TokenLength}",
                _isTestMode ? "TEST" : "LIVE", _defaultApiToken.Length);
        }

        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    }

    /// <summary>
    /// Gets the appropriate API token based on currency.
    /// MyFatoorah tokens are region-specific (KWT, IND, etc.)
    /// </summary>
    private string GetApiTokenForCurrency(string currency)
    {
        var currencyUpper = currency?.ToUpperInvariant() ?? "KWD";

        // Try to get currency-specific token first
        var tokenKey = currencyUpper switch
        {
            "INR" => "MyFatoorah:ApiTokenINR",
            "KWD" => "MyFatoorah:ApiTokenKWT",
            _ => null
        };

        if (tokenKey != null)
        {
            var specificToken = _configuration[tokenKey];
            if (!string.IsNullOrWhiteSpace(specificToken) && !specificToken.Contains("YOUR_"))
            {
                _logger.LogInformation("Using {Currency}-specific MyFatoorah token", currencyUpper);
                return specificToken;
            }
        }

        // Fallback to default token
        _logger.LogInformation("Using default MyFatoorah token for currency {Currency}", currencyUpper);
        return _defaultApiToken;
    }

    public async Task<PaymentResponseDto> InitiatePaymentAsync(InitiatePaymentDto dto)
    {
        _logger.LogInformation("Initiating payment for OrderId: {OrderId}", dto.OrderId);

        // Get the appropriate token for the currency
        var apiToken = GetApiTokenForCurrency(dto.Currency);

        if (string.IsNullOrWhiteSpace(apiToken))
        {
            throw new InvalidOperationException(
                $"MyFatoorah API token is not configured for currency {dto.Currency}. Please add the appropriate token in appsettings.json");
        }

        var order = await _context.Orders.FindAsync(dto.OrderId);
        if (order == null)
        {
            _logger.LogWarning("Order not found for payment. OrderId: {OrderId}", dto.OrderId);
            throw new ArgumentException($"Order {dto.OrderId} not found. Please ensure the order was created successfully before initiating payment.");
        }

        _logger.LogInformation("Order found: {OrderNumber}, Status: {Status}", order.OrderNumber, order.Status);

        // Determine country code: use provided value, or infer from currency
        string mobileCountryCode = dto.CountryCode?.Replace("+", "").Trim() ?? "";
        if (string.IsNullOrWhiteSpace(mobileCountryCode))
        {
            mobileCountryCode = dto.Currency?.ToUpperInvariant() switch
            {
                "INR" => "91",   // India
                "KWD" => "965",  // Kuwait
                _ => "965"       // Default to Kuwait
            };
        }

        // Validate and clean phone number - remove common prefixes
        string cleanedPhone = dto.CustomerPhone ?? "";
        cleanedPhone = cleanedPhone
            .Replace($"+{mobileCountryCode}", "")
            .Replace("+965", "")
            .Replace("+91", "")
            .Replace(" ", "")
            .Replace("-", "")
            .Trim();

        if (string.IsNullOrWhiteSpace(cleanedPhone) || cleanedPhone.Length < 8)
        {
            throw new ArgumentException("Invalid customer phone number. Phone number is required for MyFatoorah payments.");
        }

        // Create initial payment record
        var payment = new Payment
        {
            Id = Guid.NewGuid(),
            OrderId = dto.OrderId,
            UserId = order.UserId,
            PaymentGateway = "MyFatoorah",
            GatewayEnvironment = _isTestMode ? "TEST" : "LIVE",
            PaymentMethodId = "MyFatoorah", // Use enum name instead of number
            InvoiceAmount = dto.Amount,
            CurrencyIso = dto.Currency,
            PaymentStatus = "PENDING",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        // Build ExecutePayment request
        // PaymentMethodId 2 = VISA/MASTER (supports test cards)
        // Use 2 instead of 0 because 0 (all methods) is not supported by this account
        var request = new
        {
            PaymentMethodId = 2, // 2 = VISA/MASTER for card payments
            InvoiceValue = dto.Amount,
            CallBackUrl = dto.CallbackUrl,
            ErrorUrl = dto.ErrorUrl,
            CustomerName = dto.CustomerName,
            DisplayCurrencyIso = dto.Currency,
            MobileCountryCode = mobileCountryCode,
            CustomerMobile = cleanedPhone,
            CustomerEmail = dto.CustomerEmail,
            Language = "EN", // Changed from "en" to "EN" per documentation
            CustomerReference = order.OrderNumber,
            UserDefinedField = dto.OrderId.ToString()
            // Removed ExpiryDate as it's not in the standard API documentation
        };

        try
        {
            var json = JsonSerializer.Serialize(request, new JsonSerializerOptions { WriteIndented = true });
            _logger.LogInformation("Sending MyFatoorah ExecutePayment request: {Request}", json);
            _logger.LogInformation("Using BaseUrl: {BaseUrl}", _baseUrl);
            _logger.LogInformation("API Token (first 20 chars): {Token}...",
                apiToken.Length > 20 ? apiToken.Substring(0, 20) : apiToken);

            // Create request with currency-specific authorization
            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v2/ExecutePayment");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
            httpRequest.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(httpRequest);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("MyFatoorah ExecutePayment response status: {StatusCode}", response.StatusCode);
            _logger.LogInformation("MyFatoorah ExecutePayment response: {Response}", responseContent);

            if (!response.IsSuccessStatusCode)
            {
                string errorMessage;
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    errorMessage = "MyFatoorah API authentication failed. Please check: 1. API token validity 2. Token format 3. Environment settings (TEST/LIVE)";
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    errorMessage = "MyFatoorah API request format error. Common issues: 1. Invalid PaymentMethodId format 2. Missing required fields 3. Invalid phone number format 4. Invalid callback URLs";
                }
                else
                {
                    errorMessage = $"MyFatoorah payment initiation failed: {response.StatusCode}";
                }

                _logger.LogError("{ErrorMessage} - Response: {Content}", errorMessage, responseContent);

                // Store error response
                payment.PaymentStatus = "FAILED";
                payment.ErrorResponse = string.IsNullOrWhiteSpace(responseContent)
                    ? JsonSerializer.Serialize(new { error = errorMessage, statusCode = response.StatusCode })
                    : (IsValidJson(responseContent)
                        ? responseContent
                        : JsonSerializer.Serialize(new { error = responseContent, statusCode = response.StatusCode, suggestion = errorMessage }));
                payment.UpdatedAt = DateTime.UtcNow;
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                throw new Exception(errorMessage);
            }

            var result = JsonSerializer.Deserialize<MyFatoorahExecutePaymentResponse>(responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result?.Data == null)
            {
                payment.PaymentStatus = "FAILED";
                payment.ErrorResponse = JsonSerializer.Serialize(new { error = "Invalid response from MyFatoorah" });
                payment.UpdatedAt = DateTime.UtcNow;
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();

                throw new Exception("Invalid response from MyFatoorah");
            }

            // Update payment record with gateway response
            payment.InvoiceId = result.Data.InvoiceId.ToString();
            payment.GatewayResponse = responseContent;
            payment.UpdatedAt = DateTime.UtcNow;

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            _logger.LogInformation("Payment record created: {PaymentId}, InvoiceId: {InvoiceId}",
                payment.Id, payment.InvoiceId);

            return new PaymentResponseDto
            {
                PaymentUrl = result.Data.PaymentURL,
                InvoiceId = result.Data.InvoiceId.ToString(),
                InvoiceValue = dto.Amount
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to initiate MyFatoorah payment for order {OrderId}", dto.OrderId);

            // Store error if payment record wasn't saved yet
            if (payment.Id != Guid.Empty && !_context.Payments.Any(p => p.Id == payment.Id))
            {
                payment.PaymentStatus = "FAILED";
                payment.ErrorResponse = JsonSerializer.Serialize(new { error = ex.Message, stackTrace = ex.StackTrace });
                payment.UpdatedAt = DateTime.UtcNow;
                _context.Payments.Add(payment);
                await _context.SaveChangesAsync();
            }

            throw;
        }
    }

    private static bool IsValidJson(string jsonString)
    {
        if (string.IsNullOrWhiteSpace(jsonString))
            return false;

        try
        {
            JsonDocument.Parse(jsonString);
            return true;
        }
        catch (JsonException)
        {
            return false;
        }
    }

    public async Task<PaymentVerificationDto> VerifyPaymentAsync(string paymentId)
    {
        _logger.LogInformation("Verifying payment: {PaymentId}", paymentId);

        // Try to find payment record to get the currency for the correct token
        var existingPayment = await _context.Payments
            .FirstOrDefaultAsync(p => p.PaymentId == paymentId || p.InvoiceId == paymentId);

        var apiToken = existingPayment != null
            ? GetApiTokenForCurrency(existingPayment.CurrencyIso)
            : _defaultApiToken;

        var request = new
        {
            Key = paymentId,
            KeyType = "PaymentId"
        };

        try
        {
            var json = JsonSerializer.Serialize(request);

            using var httpRequest = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}/v2/GetPaymentStatus");
            httpRequest.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiToken);
            httpRequest.Content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.SendAsync(httpRequest);
            var responseContent = await response.Content.ReadAsStringAsync();

            _logger.LogInformation("MyFatoorah GetPaymentStatus response: {Response}", responseContent);

            if (!response.IsSuccessStatusCode)
            {
                _logger.LogError("MyFatoorah payment verification failed: {StatusCode} - {Content}",
                    response.StatusCode, responseContent);
                throw new Exception($"Payment verification failed: {response.StatusCode}");
            }

            var result = JsonSerializer.Deserialize<MyFatoorahPaymentStatusResponse>(responseContent,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (result?.Data == null)
            {
                throw new Exception("Invalid response from MyFatoorah");
            }

            var data = result.Data;
            var invoiceStatus = data.InvoiceStatus ?? "Unknown";
            var transactionStatus = "FAILED";
            string? errorMessage = null;
            string? errorCode = null;

            // Extract error details from InvoiceTransactions
            if (data.InvoiceTransactions?.Count > 0)
            {
                var lastTransaction = data.InvoiceTransactions
                    .OrderByDescending(t => t.TransactionDate ?? DateTime.MinValue)
                    .FirstOrDefault();

                if (lastTransaction != null)
                {
                    _logger.LogInformation("Transaction details: TransactionId={TransactionId}, Status={Status}, Error={Error}, ErrorCode={ErrorCode}, Gateway={Gateway}",
                        lastTransaction.TransactionId,
                        lastTransaction.TransactionStatus,
                        lastTransaction.Error,
                        lastTransaction.ErrorCode,
                        lastTransaction.PaymentGateway);

                    errorMessage = lastTransaction.Error;
                    errorCode = lastTransaction.ErrorCode;
                }
            }

            switch (invoiceStatus.ToUpper())
            {
                case "PAID":
                    transactionStatus = "SUCCESS";
                    break;
                case "PENDING":
                    transactionStatus = "INPROGRESS";
                    break;
                case "CANCELED":
                case "CANCELLED":
                    transactionStatus = "CANCELED";
                    break;
            }

            // Parse order ID from UserDefinedField
            Guid.TryParse(data.UserDefinedField, out var orderId);

            // Get order details
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == orderId);

            // Find existing payment record by InvoiceId
            var payment = await _context.Payments
                .FirstOrDefaultAsync(p => p.InvoiceId == data.InvoiceId.ToString());

            if (payment != null)
            {
                // Update payment record with verification response
                payment.PaymentId = paymentId;
                payment.PaymentStatus = invoiceStatus.ToUpper();
                payment.CallbackResponse = responseContent;
                payment.UpdatedAt = DateTime.UtcNow;

                // Store transaction reference if available
                if (!string.IsNullOrEmpty(data.CustomerReference))
                {
                    payment.TransactionReference = data.CustomerReference;
                }

                _context.Payments.Update(payment);
                await _context.SaveChangesAsync();

                _logger.LogInformation("Payment record updated: {PaymentId}, Status: {Status}",
                    payment.Id, payment.PaymentStatus);
            }
            else
            {
                _logger.LogWarning("Payment record not found for InvoiceId: {InvoiceId}", data.InvoiceId);
            }

            return new PaymentVerificationDto
            {
                PaymentId = paymentId,
                InvoiceStatus = invoiceStatus.ToUpper(),
                TransactionStatus = transactionStatus,
                OrderId = orderId,
                OrderNumber = order?.OrderNumber ?? data.CustomerReference ?? string.Empty,
                InvoiceId = data.InvoiceId.ToString(),
                PaidAmount = data.InvoiceValue ?? 0,
                PaidCurrency = data.InvoiceDisplayValue?.Split(' ').LastOrDefault() ?? "KWD",
                ErrorMessage = errorMessage,
                ErrorCode = errorCode
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to verify MyFatoorah payment {PaymentId}", paymentId);
            throw;
        }
    }
}

// MyFatoorah response models
public class MyFatoorahExecutePaymentResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public MyFatoorahExecutePaymentData? Data { get; set; }
}

public class MyFatoorahExecutePaymentData
{
    public long InvoiceId { get; set; }
    public string PaymentURL { get; set; } = string.Empty;
}

public class MyFatoorahPaymentStatusResponse
{
    public bool IsSuccess { get; set; }
    public string? Message { get; set; }
    public MyFatoorahPaymentStatusData? Data { get; set; }
}

public class MyFatoorahPaymentStatusData
{
    public long InvoiceId { get; set; }
    public string? InvoiceStatus { get; set; }
    public decimal? InvoiceValue { get; set; }
    public string? InvoiceDisplayValue { get; set; }
    public string? CustomerReference { get; set; }
    public string? UserDefinedField { get; set; }
    public List<MyFatoorahInvoiceTransaction>? InvoiceTransactions { get; set; }
}

public class MyFatoorahInvoiceTransaction
{
    public string? TransactionId { get; set; }
    public string? PaymentId { get; set; }
    public string? TransactionStatus { get; set; }
    public string? Error { get; set; }
    public string? ErrorCode { get; set; }
    public string? AuthorizationId { get; set; }
    public string? PaymentGateway { get; set; }
    public string? ReferenceId { get; set; }
    public string? TrackId { get; set; }
    public decimal? TransactionValue { get; set; }
    public DateTime? TransactionDate { get; set; }
}
