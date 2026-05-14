using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;
using Mayar.Api.Helpers;

namespace Mayar.Api.Services;

public class ContentPageService(AppDbContext context) : IContentPageService
{
    public async Task<List<ContentPageDto>> GetAllAsync()
    {
        var pages = await context.ContentPages
            .Include(p => p.Sections.OrderBy(s => s.DisplayOrder))
            .ToListAsync();

        return pages.Select(p => p.ToContentPageDto()).ToList();
    }

    public async Task<ContentPageDto?> GetByIdAsync(Guid id)
    {
        var page = await context.ContentPages
            .Include(p => p.Sections.OrderBy(s => s.DisplayOrder))
            .FirstOrDefaultAsync(p => p.Id == id);

        return page?.ToContentPageDto();
    }

    public async Task<ContentPageDto?> GetByPageTypeAsync(string pageType)
    {
        var page = await context.ContentPages
            .Include(p => p.Sections.OrderBy(s => s.DisplayOrder))
            .FirstOrDefaultAsync(p => p.PageType == pageType);

        return page?.ToContentPageDto();
    }

    public async Task<ContentPageDto> CreateAsync(ContentPageDto dto)
    {
        // Check if page type already exists
        var existingPage = await context.ContentPages
            .FirstOrDefaultAsync(p => p.PageType == dto.PageType);

        if (existingPage != null)
        {
            throw new InvalidOperationException($"A content page with type '{dto.PageType}' already exists.");
        }

        var entity = new ContentPage
        {
            Id = Guid.NewGuid(),
            PageType = dto.PageType,
            TitleEn = dto.TitleEn,
            TitleAr = dto.TitleAr,
            IntroEn = dto.IntroEn,
            IntroAr = dto.IntroAr,
            HeroBgColor = dto.HeroBgColor,
            ContactTitleEn = dto.ContactTitleEn,
            ContactTitleAr = dto.ContactTitleAr,
            ContactNoteEn = dto.ContactNoteEn,
            ContactNoteAr = dto.ContactNoteAr,
            ContactEmail = dto.ContactEmail,
            ContactPhone = dto.ContactPhone,
            MetaTitleEn = dto.MetaTitleEn,
            MetaTitleAr = dto.MetaTitleAr,
            MetaDescriptionEn = dto.MetaDescriptionEn,
            MetaDescriptionAr = dto.MetaDescriptionAr,
            EffectiveDate = dto.EffectiveDate,
            LastRevisedDate = dto.LastRevisedDate,
            Status = dto.Status ?? "published",
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime(),
            IsActive = true
        };

        context.ContentPages.Add(entity);

        // Add sections
        if (dto.Sections.Any())
        {
            var sections = dto.Sections.Select((s, index) => new ContentSection
            {
                Id = Guid.NewGuid(),
                ContentPageId = entity.Id,
                TitleEn = s.TitleEn,
                TitleAr = s.TitleAr,
                BodyEn = s.BodyEn,
                BodyAr = s.BodyAr,
                DisplayOrder = s.DisplayOrder > 0 ? s.DisplayOrder : index + 1,
                IsActive = s.IsActive,
                CreatedAt = DateTimeHelper.GetLocalTime()
            }).ToList();

            context.ContentSections.AddRange(sections);
        }

        await context.SaveChangesAsync();

        return await GetByIdAsync(entity.Id) ?? throw new InvalidOperationException("Failed to create content page.");
    }

    public async Task<ContentPageDto?> UpdateAsync(Guid id, ContentPageDto dto)
    {
        var entity = await context.ContentPages
            .Include(p => p.Sections)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
        {
            return null;
        }

        // Update page properties
        entity.PageType = dto.PageType;
        entity.TitleEn = dto.TitleEn;
        entity.TitleAr = dto.TitleAr;
        entity.IntroEn = dto.IntroEn;
        entity.IntroAr = dto.IntroAr;
        entity.HeroBgColor = dto.HeroBgColor;
        entity.ContactTitleEn = dto.ContactTitleEn;
        entity.ContactTitleAr = dto.ContactTitleAr;
        entity.ContactNoteEn = dto.ContactNoteEn;
        entity.ContactNoteAr = dto.ContactNoteAr;
        entity.ContactEmail = dto.ContactEmail;
        entity.ContactPhone = dto.ContactPhone;
        entity.MetaTitleEn = dto.MetaTitleEn;
        entity.MetaTitleAr = dto.MetaTitleAr;
        entity.MetaDescriptionEn = dto.MetaDescriptionEn;
        entity.MetaDescriptionAr = dto.MetaDescriptionAr;
        entity.EffectiveDate = dto.EffectiveDate;
        entity.LastRevisedDate = dto.LastRevisedDate;
        entity.Status = dto.Status ?? "published";
        entity.UpdatedAt = DateTimeHelper.GetLocalTime();
        entity.IsActive = dto.IsActive;

        // Remove existing sections
        context.ContentSections.RemoveRange(entity.Sections);

        // Add updated sections
        if (dto.Sections.Any())
        {
            var sections = dto.Sections.Select((s, index) => new ContentSection
            {
                Id = Guid.NewGuid(),
                ContentPageId = entity.Id,
                TitleEn = s.TitleEn,
                TitleAr = s.TitleAr,
                BodyEn = s.BodyEn,
                BodyAr = s.BodyAr,
                DisplayOrder = s.DisplayOrder > 0 ? s.DisplayOrder : index + 1,
                IsActive = s.IsActive,
                CreatedAt = DateTimeHelper.GetLocalTime()
            }).ToList();

            context.ContentSections.AddRange(sections);
        }

        await context.SaveChangesAsync();

        return await GetByIdAsync(id);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var entity = await context.ContentPages
            .Include(p => p.Sections)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (entity == null)
        {
            return false;
        }

        // Remove sections first
        if (entity.Sections.Any())
        {
            context.ContentSections.RemoveRange(entity.Sections);
        }

        // Remove the page
        context.ContentPages.Remove(entity);
        await context.SaveChangesAsync();

        return true;
    }
}