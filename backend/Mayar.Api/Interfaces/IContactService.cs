using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IContactService
{
    Task<ContactDto> GetContactAsync();
    Task<ContactDto> UpdateContactAsync(ContactDto contactDto);
}
