using Mayar.Api.DTOs;
using Mayar.Api.Entities;

namespace Mayar.Api.Mappings
{
    public static class AddressMapper
    {
        public static AddressDto ToDto(this Address address)
        {
            return new AddressDto
            {
                Id = address.Id,
                Label = address.Label,
                IsDefault = address.IsDefault,
                FirstName = address.FirstName,
                LastName = address.LastName,
                Phone = address.Phone,
                Email = address.Email,
                Area = address.Area,
                Block = address.Block,
                Street = address.Street,
                Building = address.Building,
                Floor = address.Floor,
                FlatOffice = address.FlatOffice,
                Notes = address.Notes
            };
        }

        public static Address ToEntity(this CreateAddressDto dto, Guid userId)
        {
            return new Address
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Label = dto.Label,
                IsDefault = dto.IsDefault,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Phone = dto.Phone,
                Email = dto.Email,
                Area = dto.Area,
                Block = dto.Block,
                Street = dto.Street,
                Building = dto.Building,
                Floor = dto.Floor,
                FlatOffice = dto.FlatOffice,
                Notes = dto.Notes,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };
        }

        public static void UpdateFromDto(this Address address, UpdateAddressDto dto)
        {
            address.Label = dto.Label;
            address.IsDefault = dto.IsDefault;
            address.FirstName = dto.FirstName;
            address.LastName = dto.LastName;
            address.Phone = dto.Phone;
            address.Email = dto.Email;
            address.Area = dto.Area;
            address.Block = dto.Block;
            address.Street = dto.Street;
            address.Building = dto.Building;
            address.Floor = dto.Floor;
            address.FlatOffice = dto.FlatOffice;
            address.Notes = dto.Notes;
            address.UpdatedAt = DateTime.UtcNow;
        }
    }
}
