using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services
{
    public class AddressService(AppDbContext context) : IAddressService
    {
        public async Task<IEnumerable<AddressDto>> GetUserAddressesAsync(Guid userId)
        {
            var addresses = await context.Addresses
                .Where(a => a.UserId == userId)
                .OrderByDescending(a => a.IsDefault)
                .ThenByDescending(a => a.UpdatedAt)
                .ToListAsync();

            return addresses.Select(a => a.ToDto());
        }

        public async Task<AddressDto?> GetAddressByIdAsync(Guid id, Guid userId)
        {
            var address = await context.Addresses
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            return address?.ToDto();
        }

        public async Task<AddressDto> CreateAddressAsync(Guid userId, CreateAddressDto dto)
        {
            // If this is set as default, unset all other defaults
            if (dto.IsDefault)
            {
                var existingAddresses = await context.Addresses
                    .Where(a => a.UserId == userId && a.IsDefault)
                    .ToListAsync();

                foreach (var addr in existingAddresses)
                {
                    addr.IsDefault = false;
                    addr.UpdatedAt = DateTimeHelper.GetLocalTime();
                }
            }

            var address = dto.ToEntity(userId);
            context.Addresses.Add(address);
            await context.SaveChangesAsync();

            return address.ToDto();
        }

        public async Task<AddressDto?> UpdateAddressAsync(Guid id, Guid userId, UpdateAddressDto dto)
        {
            var address = await context.Addresses
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
                return null;

            // If setting this as default, unset all other defaults
            if (dto.IsDefault && !address.IsDefault)
            {
                var otherDefaults = await context.Addresses
                    .Where(a => a.UserId == userId && a.IsDefault && a.Id != id)
                    .ToListAsync();

                foreach (var addr in otherDefaults)
                {
                    addr.IsDefault = false;
                    addr.UpdatedAt = DateTimeHelper.GetLocalTime();
                }
            }

            address.UpdateFromDto(dto);
            await context.SaveChangesAsync();

            return address.ToDto();
        }

        public async Task<bool> DeleteAddressAsync(Guid id, Guid userId)
        {
            var address = await context.Addresses
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
                return false;

            context.Addresses.Remove(address);
            await context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> SetDefaultAddressAsync(Guid id, Guid userId)
        {
            var address = await context.Addresses
                .FirstOrDefaultAsync(a => a.Id == id && a.UserId == userId);

            if (address == null)
                return false;

            // Unset all other defaults
            var otherDefaults = await context.Addresses
                .Where(a => a.UserId == userId && a.IsDefault && a.Id != id)
                .ToListAsync();

            foreach (var addr in otherDefaults)
            {
                addr.IsDefault = false;
                addr.UpdatedAt = DateTimeHelper.GetLocalTime();
            }

            address.IsDefault = true;
            address.UpdatedAt = DateTimeHelper.GetLocalTime();
            await context.SaveChangesAsync();

            return true;
        }
    }
}
