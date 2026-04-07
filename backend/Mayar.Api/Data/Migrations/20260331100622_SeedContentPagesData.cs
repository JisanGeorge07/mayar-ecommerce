using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class SeedContentPagesData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("975cdca4-6ae6-4615-847c-958f105c9fff"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("821f21d3-1bd6-4200-a4fa-292f40832d7d"), null, null, "admin@mayar.com", "Admin", "$2a$11$OY2uHeg7AHh.KbRPAqVv8u2ANOOZ5UTdXZSRwI9tmZGmrYJsS.S1K", null, null, null, null, "Admin" });

            // Seed ContentPages
            var privacyPageId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var termsPageId = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var shippingPageId = Guid.Parse("33333333-3333-3333-3333-333333333333");
            var returnsPageId = Guid.Parse("44444444-4444-4444-4444-444444444444");

            // Privacy Policy
            migrationBuilder.InsertData(
                table: "ContentPages",
                columns: new[] { "Id", "PageType", "TitleEn", "TitleAr", "IntroEn", "IntroAr", "ContactNoteEn", "ContactNoteAr", "CreatedAt", "UpdatedAt", "IsActive" },
                values: new object[] {
                    privacyPageId, "privacy-policy", "Privacy Policy", "سياسة الخصوصية",
                    "At Mayar International, we value the privacy and security of our users. This privacy policy outlines how we collect, use, and safeguard your personal information. We collect data such as your name, contact details, and delivery address to enhance your shopping experience. We do not share your personal information with third parties, except as required by law or for operational purposes. By using our services, you consent to the collection and use of your data as outlined in this policy.",
                    "في ميار الدولية، نقدر خصوصية وأمان مستخدمينا. توضح سياسة الخصوصية هذه كيف نجمع ونستخدم ونحمي معلوماتك الشخصية.",
                    "For questions regarding this Privacy Policy or how we handle your data, please contact us at mayaralmiya@gmail.com or call +965 50404099.",
                    "لأي أسئلة حول سياسة الخصوصية، تواصل معنا عبر mayaralmiya@gmail.com أو اتصل على 50404099 965+.",
                    DateTime.UtcNow, DateTime.UtcNow, true
                });

            // Terms & Conditions
            migrationBuilder.InsertData(
                table: "ContentPages",
                columns: new[] { "Id", "PageType", "TitleEn", "TitleAr", "IntroEn", "IntroAr", "ContactNoteEn", "ContactNoteAr", "CreatedAt", "UpdatedAt", "IsActive" },
                values: new object[] {
                    termsPageId, "terms-conditions", "Terms & Conditions", "الشروط والأحكام",
                    "By using Mayar International services, you agree to comply with and be bound by the following terms and conditions.",
                    "باستخدام خدمات ميار الدولية، فإنك توافق على الالتزام بالشروط والأحكام التالية.",
                    "For any questions or concerns regarding these Terms & Conditions, please contact us at mayaralmiya@gmail.com or call +965 50404099.",
                    "لأي أسئلة أو استفسارات حول الشروط والأحكام، تواصل معنا عبر mayaralmiya@gmail.com أو اتصل على 50404099 965+.",
                    DateTime.UtcNow, DateTime.UtcNow, true
                });

            // Shipping Information
            migrationBuilder.InsertData(
                table: "ContentPages",
                columns: new[] { "Id", "PageType", "TitleEn", "TitleAr", "IntroEn", "IntroAr", "ContactNoteEn", "ContactNoteAr", "CreatedAt", "UpdatedAt", "IsActive" },
                values: new object[] {
                    shippingPageId, "shipping-info", "Shipping Information", "معلومات الشحن",
                    "Mayar International provides comprehensive shipping and logistics solutions across Kuwait and internationally. We are committed to delivering your orders safely and on time.",
                    "توفر ميار الدولية حلول شحن وخدمات لوجستية شاملة عبر الكويت ودولياً.",
                    null, null,
                    DateTime.UtcNow, DateTime.UtcNow, true
                });

            // Returns & Exchange
            migrationBuilder.InsertData(
                table: "ContentPages",
                columns: new[] { "Id", "PageType", "TitleEn", "TitleAr", "IntroEn", "IntroAr", "ContactNoteEn", "ContactNoteAr", "CreatedAt", "UpdatedAt", "IsActive" },
                values: new object[] {
                    returnsPageId, "returns-exchange", "Returns & Exchange", "الإرجاع والاستبدال",
                    "At Mayar, we want you to be completely satisfied with your purchase. If you're not happy with your order, we offer a hassle-free returns and exchange process.",
                    "في ميار، نريدك أن تكون راضياً تماماً عن مشترياتك. نقدم عملية إرجاع واستبدال سهلة.",
                    null, null,
                    DateTime.UtcNow, DateTime.UtcNow, true
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("821f21d3-1bd6-4200-a4fa-292f40832d7d"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("975cdca4-6ae6-4615-847c-958f105c9fff"), null, null, "admin@mayar.com", "Admin", "$2a$11$3f3C17IItSsKBbdw0V2PNuHNBbk2NSNf5QID0.v20ehoXOevHz/I2", null, null, null, null, "Admin" });

            // Remove ContentPages
            migrationBuilder.DeleteData(
                table: "ContentPages",
                keyColumn: "Id",
                keyValue: new Guid("11111111-1111-1111-1111-111111111111"));

            migrationBuilder.DeleteData(
                table: "ContentPages",
                keyColumn: "Id",
                keyValue: new Guid("22222222-2222-2222-2222-222222222222"));

            migrationBuilder.DeleteData(
                table: "ContentPages",
                keyColumn: "Id",
                keyValue: new Guid("33333333-3333-3333-3333-333333333333"));

            migrationBuilder.DeleteData(
                table: "ContentPages",
                keyColumn: "Id",
                keyValue: new Guid("44444444-4444-4444-4444-444444444444"));
        }
    }
}
