using System;

namespace Mayar.Api.Entities;

public class ContactCard
{
    public Guid Id { get; set; }

    // Icon: MapPin, Phone, Mail, MessageCircle, Clock
    public string Icon { get; set; } = string.Empty;

    // Labels
    public string LabelEn { get; set; } = string.Empty;
    public string LabelAr { get; set; } = string.Empty;

    // Values
    public string ValueEn { get; set; } = string.Empty;
    public string ValueAr { get; set; } = string.Empty;

    // Sort order for drag-and-drop reordering
    public int SortOrder { get; set; }

    // Foreign key
    public Guid ContactId { get; set; }

    // Navigation property
    public Contact Contact { get; set; } = null!;
}
