using System;
using Mayar.Api.Enums;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class Transaction
{
    public Guid Id { get; set; }
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public string? TransactionNumber { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public decimal? Amount { get; set; }
    public string? GatewayResponse { get; set; }
    public DateTime TransactionDate { get; set; } = DateTimeHelper.GetLocalTime();
}
