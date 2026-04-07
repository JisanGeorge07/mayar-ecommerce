namespace Mayar.Api.DTOs
{
    public class AddressDto
    {
        public Guid Id { get; set; }
        public string Label { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string Area { get; set; } = string.Empty;
        public string Block { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string Building { get; set; } = string.Empty;
        public string? Floor { get; set; }
        public string? FlatOffice { get; set; }
        public string? Notes { get; set; }
    }

    public class CreateAddressDto
    {
        public string Label { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string Area { get; set; } = string.Empty;
        public string Block { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string Building { get; set; } = string.Empty;
        public string? Floor { get; set; }
        public string? FlatOffice { get; set; }
        public string? Notes { get; set; }
    }

    public class UpdateAddressDto
    {
        public string Label { get; set; } = string.Empty;
        public bool IsDefault { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string Area { get; set; } = string.Empty;
        public string Block { get; set; } = string.Empty;
        public string Street { get; set; } = string.Empty;
        public string Building { get; set; } = string.Empty;
        public string? Floor { get; set; }
        public string? FlatOffice { get; set; }
        public string? Notes { get; set; }
    }
}
