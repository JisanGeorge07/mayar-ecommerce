using System;
using System.Linq;
using Mayar.Api.Data;
using Mayar.Api.DTOs;
using Mayar.Api.Entities;
using Mayar.Api.Interfaces;
using Mayar.Api.Mappings;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Services;

public class ContactService(AppDbContext context) : IContactService
{
    public async Task<ContactDto> GetContactAsync()
    {
        var contact = await context.Contact
            .Include(c => c.ContactCards)
            .FirstOrDefaultAsync();

        if (contact == null)
        {
            // Create default contact page with default cards
            contact = CreateDefaultContact();
            await context.Contact.AddAsync(contact);
            await context.SaveChangesAsync();
        }

        return contact.ToContactDto();
    }

    public async Task<ContactDto> UpdateContactAsync(ContactDto contactDto)
    {
        var contact = await context.Contact
            .Include(c => c.ContactCards)
            .FirstOrDefaultAsync();

        if (contact == null)
        {
            // Create new contact
            contact = contactDto.ToContactEntity();
            contact.Id = Guid.NewGuid();
            await context.Contact.AddAsync(contact);

            // Add contact cards
            foreach (var cardDto in contactDto.ContactCards)
            {
                var card = cardDto.ToContactCardEntity(contact.Id);
                await context.ContactCards.AddAsync(card);
            }
        }
        else
        {
            // Update existing contact fields
            contact.HeroHeadingEn = contactDto.HeroHeadingEn;
            contact.HeroHeadingAr = contactDto.HeroHeadingAr;
            contact.HeroSubheadingEn = contactDto.HeroSubheadingEn;
            contact.HeroSubheadingAr = contactDto.HeroSubheadingAr;
            contact.HeroBgColor = contactDto.HeroBgColor;
            contact.ShowMap = contactDto.ShowMap;
            contact.MapHeight = contactDto.MapHeight;
            contact.MapEmbedUrl = contactDto.MapEmbedUrl;
            contact.MetaTitleEn = contactDto.MetaTitleEn;
            contact.MetaTitleAr = contactDto.MetaTitleAr;
            contact.MetaDescriptionEn = contactDto.MetaDescriptionEn;
            contact.MetaDescriptionAr = contactDto.MetaDescriptionAr;
            contact.Status = contactDto.Status;
            contact.UpdatedAt = DateTime.UtcNow;

            // Handle contact cards - remove existing and add new ones
            var existingCards = contact.ContactCards.ToList();
            context.ContactCards.RemoveRange(existingCards);

            foreach (var cardDto in contactDto.ContactCards)
            {
                var card = cardDto.ToContactCardEntity(contact.Id);
                await context.ContactCards.AddAsync(card);
            }
        }

        await context.SaveChangesAsync();

        // Reload to get updated data
        var updatedContact = await context.Contact
            .Include(c => c.ContactCards)
            .FirstAsync(c => c.Id == contact.Id);

        return updatedContact.ToContactDto();
    }

    private static Contact CreateDefaultContact()
    {
        var contactId = Guid.NewGuid();

        return new Contact
        {
            Id = contactId,
            HeroHeadingEn = "Contact Us",
            HeroHeadingAr = "اتصل بنا",
            HeroSubheadingEn = "We're here to help. Reach out to us anytime.",
            HeroSubheadingAr = "نحن هنا للمساعدة. تواصل معنا في أي وقت.",
            HeroBgColor = "#0f172a",
            ShowMap = true,
            MapHeight = 400,
            MapEmbedUrl = "https://maps.google.com/maps?q=Shuwaikh+Port+Free+Trade+Zone+Kuwait&output=embed",
            MetaTitleEn = "Contact Us – Mayar",
            MetaTitleAr = "اتصل بنا – مايار",
            MetaDescriptionEn = "Get in touch with Mayar. Find our address, phone, email, WhatsApp, and working hours.",
            MetaDescriptionAr = "تواصل مع مايار. اعثر على عنواننا وهاتفنا وبريدنا الإلكتروني وواتساب وساعات العمل.",
            Status = "draft",
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            ContactCards = new List<ContactCard>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    ContactId = contactId,
                    Icon = "MapPin",
                    LabelEn = "Address",
                    LabelAr = "العنوان",
                    ValueEn = "Shuwaikh Port, Free Trade Zone, Kuwait City, Kuwait",
                    ValueAr = "ميناء الشويخ، المنطقة الحرة، مدينة الكويت، الكويت",
                    SortOrder = 1
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    ContactId = contactId,
                    Icon = "Phone",
                    LabelEn = "Phone",
                    LabelAr = "الهاتف",
                    ValueEn = "+965 50404099",
                    ValueAr = "\u200E+965 50404099",
                    SortOrder = 2
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    ContactId = contactId,
                    Icon = "Mail",
                    LabelEn = "Email",
                    LabelAr = "البريد الإلكتروني",
                    ValueEn = "mayaralmiya@gmail.com",
                    ValueAr = "mayaralmiya@gmail.com",
                    SortOrder = 3
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    ContactId = contactId,
                    Icon = "MessageCircle",
                    LabelEn = "WhatsApp",
                    LabelAr = "واتساب",
                    ValueEn = "+965 50404099",
                    ValueAr = "\u200E+965 50404099",
                    SortOrder = 4
                },
                new()
                {
                    Id = Guid.NewGuid(),
                    ContactId = contactId,
                    Icon = "Clock",
                    LabelEn = "Working Hours",
                    LabelAr = "ساعات العمل",
                    ValueEn = "9:00 AM to 5:00 PM",
                    ValueAr = "9:00 صباحاً حتى 5:00 مساءً",
                    SortOrder = 5
                }
            }
        };
    }
}
