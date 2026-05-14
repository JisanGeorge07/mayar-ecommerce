using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Mayar.Api.Helpers;

namespace Mayar.Api.Entities;

public class Payment
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public Guid OrderId { get; set; }

    [ForeignKey(nameof(OrderId))]
    public Order Order { get; set; } = null!;

    // User ID - nullable for guest checkout
    public Guid? UserId { get; set; }

    // Session ID for guest payments
    [MaxLength(100)]
    public string? SessionId { get; set; }

    [Required]
    [MaxLength(50)]
    public string PaymentGateway { get; set; } = "MyFatoorah";

    [Required]
    [MaxLength(10)]
    public string GatewayEnvironment { get; set; } = "TEST"; // TEST or LIVE

    [MaxLength(50)]
    public string? PaymentMethodId { get; set; }

    [MaxLength(100)]
    public string? InvoiceId { get; set; }

    [MaxLength(100)]
    public string? PaymentId { get; set; }

    [MaxLength(100)]
    public string? TransactionReference { get; set; }

    [Column(TypeName = "decimal(18,3)")]
    public decimal InvoiceAmount { get; set; }

    [Required]
    [MaxLength(10)]
    public string CurrencyIso { get; set; } = "KWD";

    [Required]
    [MaxLength(50)]
    public string PaymentStatus { get; set; } = "PENDING"; // PENDING, PAID, FAILED, CANCELLED

    [Column(TypeName = "json")]
    public string? GatewayResponse { get; set; }

    [Column(TypeName = "json")]
    public string? CallbackResponse { get; set; }

    [Column(TypeName = "json")]
    public string? ErrorResponse { get; set; }

    public DateTime CreatedAt { get; set; } = DateTimeHelper.GetLocalTime();

    public DateTime UpdatedAt { get; set; } = DateTimeHelper.GetLocalTime();
}
