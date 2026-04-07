using System;
using Mayar.Api.DTOs;

namespace Mayar.Api.Interfaces;

public interface IAboutService
{
    Task<AboutDto?> GetAboutAsync();
    Task<bool> UpdateAboutAsync(AboutDto aboutDto);
}
