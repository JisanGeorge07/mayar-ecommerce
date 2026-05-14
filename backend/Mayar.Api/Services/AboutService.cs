using System;
using System.Linq;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class AboutService(AppDbContext context) : IAboutService
{
    public async Task<AboutDto?> GetAboutAsync()
    {
        var about = await context.About
            .Include(a => a.Paragraphs.OrderBy(p => p.SortOrder))
            .Include(a => a.ContactItems.OrderBy(c => c.SortOrder))
            .FirstOrDefaultAsync();

        if (about == null)
        {
            return null;
        }

        return about.ToAboutDto();
    }

    public async Task<bool> UpdateAboutAsync(AboutDto aboutDto)
    {
        var about = await context.About
            .Include(a => a.Paragraphs)
            .Include(a => a.ContactItems)
            .FirstOrDefaultAsync();

        if (about == null)
        {
            // Create new About with related entities
            about = aboutDto.ToAboutEntity();
            about.Id = Guid.NewGuid();
            about.UpdatedAt = DateTimeHelper.GetLocalTime();

            // Add paragraphs
            if (aboutDto.Paragraphs != null)
            {
                var sortOrder = 0;
                foreach (var paragraphDto in aboutDto.Paragraphs)
                {
                    var paragraph = paragraphDto.ToEntity(about.Id);
                    paragraph.SortOrder = sortOrder++;
                    about.Paragraphs.Add(paragraph);
                }
            }

            // Add contact items
            if (aboutDto.ContactItems != null)
            {
                foreach (var contactDto in aboutDto.ContactItems)
                {
                    var contact = contactDto.ToEntity(about.Id);
                    about.ContactItems.Add(contact);
                }
            }

            await context.About.AddAsync(about);
        }
        else
        {
            // Update About fields
            about.HeroTitleEnglish = aboutDto.HeroTitleEnglish ?? string.Empty;
            about.HeroTitleArabic = aboutDto.HeroTitleArabic ?? string.Empty;
            about.HeroSubtitleEnglish = aboutDto.HeroSubtitleEnglish ?? string.Empty;
            about.HeroSubtitleArabic = aboutDto.HeroSubtitleArabic ?? string.Empty;
            about.HeroBgColor = aboutDto.HeroBgColor ?? "#1B2A4A";

            about.WhoWeAreTitleEnglish = aboutDto.WhoWeAreTitleEnglish ?? string.Empty;
            about.WhoWeAreTitleArabic = aboutDto.WhoWeAreTitleArabic ?? string.Empty;

            about.VisionTitleEnglish = aboutDto.VisionTitleEnglish ?? string.Empty;
            about.VisionTitleArabic = aboutDto.VisionTitleArabic ?? string.Empty;
            about.VisionDescriptionEnglish = aboutDto.VisionDescriptionEnglish ?? string.Empty;
            about.VisionDescriptionArabic = aboutDto.VisionDescriptionArabic ?? string.Empty;
            about.VisionIcon = aboutDto.VisionIcon ?? "Eye";

            about.MissionTitleEnglish = aboutDto.MissionTitleEnglish ?? string.Empty;
            about.MissionTitleArabic = aboutDto.MissionTitleArabic ?? string.Empty;
            about.MissionDescriptionEnglish = aboutDto.MissionDescriptionEnglish ?? string.Empty;
            about.MissionDescriptionArabic = aboutDto.MissionDescriptionArabic ?? string.Empty;
            about.MissionIcon = aboutDto.MissionIcon ?? "Target";

            about.MetaTitleEnglish = aboutDto.MetaTitleEnglish ?? string.Empty;
            about.MetaTitleArabic = aboutDto.MetaTitleArabic ?? string.Empty;
            about.MetaDescriptionEnglish = aboutDto.MetaDescriptionEnglish ?? string.Empty;
            about.MetaDescriptionArabic = aboutDto.MetaDescriptionArabic ?? string.Empty;

            about.Status = aboutDto.Status ?? "draft";
            about.UpdatedAt = DateTimeHelper.GetLocalTime();

            // Update paragraphs - remove ALL existing paragraphs for this About and add new ones
            await context.AboutParagraphs.Where(p => p.AboutId == about.Id).ExecuteDeleteAsync();
            if (aboutDto.Paragraphs != null)
            {
                var sortOrder = 0;
                foreach (var paragraphDto in aboutDto.Paragraphs)
                {
                    var paragraph = paragraphDto.ToEntity(about.Id);
                    paragraph.Id = Guid.NewGuid(); // Always create new
                    paragraph.SortOrder = sortOrder++;
                    context.AboutParagraphs.Add(paragraph);
                }
            }

            // Update contact items - remove ALL existing contact items for this About and add new ones
            await context.AboutContactItems.Where(c => c.AboutId == about.Id).ExecuteDeleteAsync();
            if (aboutDto.ContactItems != null)
            {
                foreach (var contactDto in aboutDto.ContactItems)
                {
                    var contact = contactDto.ToEntity(about.Id);
                    contact.Id = Guid.NewGuid(); // Always create new
                    context.AboutContactItems.Add(contact);
                }
            }
        }

        await context.SaveChangesAsync();
        return true;
    }
}
