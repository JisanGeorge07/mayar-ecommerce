using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces
{
    public interface IAddressService
    {
        Task<IEnumerable<AddressDto>> GetUserAddressesAsync(Guid userId);
        Task<AddressDto?> GetAddressByIdAsync(Guid id, Guid userId);
        Task<AddressDto> CreateAddressAsync(Guid userId, CreateAddressDto dto);
        Task<AddressDto?> UpdateAddressAsync(Guid id, Guid userId, UpdateAddressDto dto);
        Task<bool> DeleteAddressAsync(Guid id, Guid userId);
        Task<bool> SetDefaultAddressAsync(Guid id, Guid userId);
    }
}
