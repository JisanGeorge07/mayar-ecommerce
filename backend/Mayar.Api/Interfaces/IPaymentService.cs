using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IPaymentService
{
    Task<PaymentResponseDto> InitiatePaymentAsync(InitiatePaymentDto dto);
    Task<PaymentVerificationDto> VerifyPaymentAsync(string paymentId);
}
