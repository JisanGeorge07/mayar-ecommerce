using System;
using System.Linq;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Helpers;

namespace Mayar.Api.Mappings;

public static class ContactMapper
{
    public static ContactCardDto ToContactCardDto(this ContactCard card)
    {
        return new ContactCardDto
        {
            Id = card.Id,
            Icon = card.Icon,
            LabelEn = card.LabelEn,
            LabelAr = card.LabelAr,
            ValueEn = card.ValueEn,
            ValueAr = card.ValueAr,
            SortOrder = card.SortOrder
        };
    }

    public static ContactCard ToContactCardEntity(this ContactCardDto dto, Guid contactId)
    {
        return new ContactCard
        {
            Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
            Icon = dto.Icon,
            LabelEn = dto.LabelEn,
            LabelAr = dto.LabelAr,
            ValueEn = dto.ValueEn,
            ValueAr = dto.ValueAr,
            SortOrder = dto.SortOrder,
            ContactId = contactId
        };
    }

    public static ContactDto ToContactDto(this Contact contact)
    {
        return new ContactDto
        {
            Id = contact.Id,
            HeroHeadingEn = contact.HeroHeadingEn,
            HeroHeadingAr = contact.HeroHeadingAr,
            HeroSubheadingEn = contact.HeroSubheadingEn,
            HeroSubheadingAr = contact.HeroSubheadingAr,
            HeroBgColor = contact.HeroBgColor,
            ContactCards = contact.ContactCards
                .OrderBy(c => c.SortOrder)
                .Select(c => c.ToContactCardDto())
                .ToList(),
            ShowMap = contact.ShowMap,
            MapHeight = contact.MapHeight,
            MapEmbedUrl = contact.MapEmbedUrl,
            MetaTitleEn = contact.MetaTitleEn,
            MetaTitleAr = contact.MetaTitleAr,
            MetaDescriptionEn = contact.MetaDescriptionEn,
            MetaDescriptionAr = contact.MetaDescriptionAr,
            Status = contact.Status,
            UpdatedAt = DateTime.SpecifyKind(contact.UpdatedAt, DateTimeKind.Utc)
        };
    }

    public static Contact ToContactEntity(this ContactDto dto)
    {
        var contact = new Contact
        {
            Id = dto.Id == Guid.Empty ? Guid.NewGuid() : dto.Id,
            HeroHeadingEn = dto.HeroHeadingEn,
            HeroHeadingAr = dto.HeroHeadingAr,
            HeroSubheadingEn = dto.HeroSubheadingEn,
            HeroSubheadingAr = dto.HeroSubheadingAr,
            HeroBgColor = dto.HeroBgColor,
            ShowMap = dto.ShowMap,
            MapHeight = dto.MapHeight,
            MapEmbedUrl = dto.MapEmbedUrl,
            MetaTitleEn = dto.MetaTitleEn,
            MetaTitleAr = dto.MetaTitleAr,
            MetaDescriptionEn = dto.MetaDescriptionEn,
            MetaDescriptionAr = dto.MetaDescriptionAr,
            Status = dto.Status,
            CreatedAt = DateTimeHelper.GetLocalTime(),
            UpdatedAt = DateTimeHelper.GetLocalTime()
        };

        return contact;
    }
}
