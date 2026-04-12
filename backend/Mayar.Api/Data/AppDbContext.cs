using Mayar.Api.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Mayar.Api.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users { get; set; }
        public DbSet<HeroSlide> HeroSlides { get; set; }

        public DbSet<TopCategory> TopCategories { get; set; }
        public DbSet<MiddleCategory> MiddleCategories { get; set; }
        public DbSet<BottomCategory> BottomCategories { get; set; }

        public DbSet<Product> Products { get; set; }
        public DbSet<ProductImage> ProductImages { get; set; }
        public DbSet<ProductColor> ProductColors { get; set; }
        public DbSet<ProductSize> ProductSizes { get; set; }
        public DbSet<ProductVariant> ProductVariants { get; set; }
        public DbSet<ProductCareInstruction> ProductCareInstructions { get; set; }
        public DbSet<ProductFeature> ProductFeatures { get; set; }
        public DbSet<ProductSpecification> ProductSpecifications { get; set; }

        public DbSet<Wishlist> Wishlists { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
        public DbSet<RecentlyViewed> RecentlyViewedProducts { get; set; }

        public DbSet<NewsLetter> NewsLetters { get; set; }

        public DbSet<PromoBanner> PromoBanners { get; set; }
        public DbSet<ShopByCategory> ShopByCategories { get; set; }

        public DbSet<Address> Addresses { get; set; }
        public DbSet<Contact> Contact { get; set; }
        public DbSet<ContactCard> ContactCards { get; set; }

        public DbSet<ContentPage> ContentPages { get; set; }
        public DbSet<ContentSection> ContentSections { get; set; }
        public DbSet<About> About { get; set; }
        public DbSet<AboutParagraph> AboutParagraphs { get; set; }
        public DbSet<AboutContactItem> AboutContactItems { get; set; }

        // Order-related entities
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<OrderStatusHistory> OrderStatusHistory { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<CouponCode> CouponCodes { get; set; }

        // Settings-related entities
        public DbSet<FeatureSettings> FeatureSettings { get; set; }
        public DbSet<CheckoutCountry> CheckoutCountries { get; set; }
        public DbSet<CheckoutAddressField> CheckoutAddressFields { get; set; }

        public DbSet<TrustBadge> TrustBadges { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ProductVariant relationships and constraints
            modelBuilder.Entity<ProductVariant>()
                .HasOne(v => v.Product)
                .WithMany(p => p.Variants)
                .HasForeignKey(v => v.ProductId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductVariant>()
                .HasOne(v => v.ProductColor)
                .WithMany()
                .HasForeignKey(v => v.ProductColorId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ProductVariant>()
                .HasOne(v => v.ProductSize)
                .WithMany()
                .HasForeignKey(v => v.ProductSizeId)
                .OnDelete(DeleteBehavior.Restrict);

            // Unique index: prevent duplicate color+size combinations per product
            modelBuilder.Entity<ProductVariant>()
                .HasIndex(v => new { v.ProductId, v.ProductColorId, v.ProductSizeId })
                .IsUnique();

            // Configure Wishlist relationships
            modelBuilder.Entity<Wishlist>()
                .HasOne(w => w.ProductVariant)
                .WithMany()
                .HasForeignKey(w => w.ProductVariantId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique index: prevent duplicate variant in wishlist per user
            modelBuilder.Entity<Wishlist>()
                .HasIndex(w => new { w.UserId, w.ProductVariantId })
                .IsUnique();

            // Configure ContentPage relationships
            modelBuilder.Entity<ContentSection>()
                .HasOne(s => s.ContentPage)
                .WithMany(p => p.Sections)
                .HasForeignKey(s => s.ContentPageId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique index: prevent duplicate page types
            modelBuilder.Entity<ContentPage>()
                .HasIndex(p => p.PageType)
                .IsUnique();

            // Configure About relationships
            modelBuilder.Entity<AboutParagraph>()
                .HasOne(ap => ap.About)
                .WithMany(a => a.Paragraphs)
                .HasForeignKey(ap => ap.AboutId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<AboutContactItem>()
                .HasOne(aci => aci.About)
                .WithMany(a => a.ContactItems)
                .HasForeignKey(aci => aci.AboutId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Contact relationships
            modelBuilder.Entity<ContactCard>()
                .HasOne(cc => cc.Contact)
                .WithMany(c => c.ContactCards)
                .HasForeignKey(cc => cc.ContactId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Order relationships
            modelBuilder.Entity<Order>()
                .HasOne(o => o.User)
                .WithMany()
                .HasForeignKey(o => o.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.ShippingAddress)
                .WithMany()
                .HasForeignKey(o => o.ShippingAddressId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Order>()
                .HasOne(o => o.CouponCode)
                .WithMany()
                .HasForeignKey(o => o.CouponCodeId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure OrderItem relationships
            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.OrderItems)
                .HasForeignKey(oi => oi.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.Product)
                .WithMany()
                .HasForeignKey(oi => oi.ProductId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<OrderItem>()
                .HasOne(oi => oi.ProductVariant)
                .WithMany()
                .HasForeignKey(oi => oi.ProductVariantId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure OrderStatusHistory relationships
            modelBuilder.Entity<OrderStatusHistory>()
                .HasOne(osh => osh.Order)
                .WithMany(o => o.StatusHistory)
                .HasForeignKey(osh => osh.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<OrderStatusHistory>()
                .HasOne(osh => osh.User)
                .WithMany()
                .HasForeignKey(osh => osh.ChangedBy)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure Transaction relationships
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.Order)
                .WithMany(o => o.Transactions)
                .HasForeignKey(t => t.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Payment relationships
            modelBuilder.Entity<Payment>()
                .HasOne(p => p.Order)
                .WithMany(o => o.Payments)
                .HasForeignKey(p => p.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique index for invoice ID to prevent duplicate payment records
            modelBuilder.Entity<Payment>()
                .HasIndex(p => p.InvoiceId)
                .IsUnique();

            // Unique index for order number
            modelBuilder.Entity<Order>()
                .HasIndex(o => o.OrderNumber)
                .IsUnique();

            // Unique index for coupon code
            modelBuilder.Entity<CouponCode>()
                .HasIndex(cc => cc.Code)
                .IsUnique();

            // Configure PromoBanner relationships
            modelBuilder.Entity<PromoBanner>()
                .HasOne(pb => pb.Category)
                .WithMany()
                .HasForeignKey(pb => pb.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PromoBanner>()
                .HasOne(pb => pb.Subcategory)
                .WithMany()
                .HasForeignKey(pb => pb.SubcategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PromoBanner>()
                .HasOne(pb => pb.ProductType)
                .WithMany()
                .HasForeignKey(pb => pb.ProductTypeId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PromoBanner>()
                .HasOne(pb => pb.Product)
                .WithMany()
                .HasForeignKey(pb => pb.ProductId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure ShopByCategory relationships
            modelBuilder.Entity<ShopByCategory>()
                .HasOne(sbc => sbc.Category)
                .WithMany()
                .HasForeignKey(sbc => sbc.CategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ShopByCategory>()
                .HasOne(sbc => sbc.Subcategory)
                .WithMany()
                .HasForeignKey(sbc => sbc.SubcategoryId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ShopByCategory>()
                .HasOne(sbc => sbc.ProductType)
                .WithMany()
                .HasForeignKey(sbc => sbc.ProductTypeId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<ShopByCategory>()
                .HasOne(sbc => sbc.Product)
                .WithMany()
                .HasForeignKey(sbc => sbc.ProductId)
                .OnDelete(DeleteBehavior.SetNull);

            // Configure CheckoutAddressField relationships
            modelBuilder.Entity<CheckoutAddressField>()
                .HasOne(f => f.Country)
                .WithMany(c => c.AddressFields)
                .HasForeignKey(f => f.CountryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Unique index for country code
            modelBuilder.Entity<CheckoutCountry>()
                .HasIndex(c => c.CountryCode)
                .IsUnique();

            modelBuilder.Entity<User>().HasData(
                new User

                {
                    Id = Guid.NewGuid(),
                    Name = "Admin",
                    Email = "admin@mayar.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123"),
                    Role = "Admin",
                }
            );

            modelBuilder.Entity<TrustBadge>().HasData(
                new TrustBadge
                {
                    Id = Guid.NewGuid(),
                    Key = "free_delivery",
                    LabelEnglish = "Free Delivery",
                    LabelArabic = "توصيل مجاني",
                    DescriptionEnglish = "On orders over 10 KWD",
                    DescriptionArabic = "على الطلبات التي تزيد عن 10 دنانير كويتية",
                    IconName = "Truck"
                },
                new TrustBadge
                {
                    Id = Guid.NewGuid(),
                    Key = "easy_returns",
                    LabelEnglish = "Easy Returns",
                    LabelArabic = "إرجاع سهل",
                    DescriptionEnglish = "14 day return policy",
                    DescriptionArabic = "سياسة إرجاع لمدة 14 يومًا",
                    IconName = "RotateCcw"
                },
                new TrustBadge
                {
                    Id = Guid.NewGuid(),
                    Key = "secure_payment",
                    LabelEnglish = "Secure Payment",
                    LabelArabic = "دفع آمن",
                    DescriptionEnglish = "Encrypted checkout",
                    DescriptionArabic = "الدفع المشفر",
                    IconName = "Shield"
                },
                new TrustBadge
                {
                    Id = Guid.NewGuid(),
                    Key = "authentic",
                    LabelEnglish = "Authentic Products",
                    LabelArabic = "منتجات أصلية",
                    DescriptionEnglish = "100% genuine",
                    DescriptionArabic = "100% أصلي",
                    IconName = "CheckCircle"
                }
            );
        }
    }
}
