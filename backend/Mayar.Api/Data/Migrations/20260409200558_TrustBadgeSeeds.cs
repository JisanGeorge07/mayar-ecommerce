using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class TrustBadgeSeeds : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c31c9ae1-b842-418d-8862-20038e3eb671"));

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("bb16dc0f-0dd5-476f-9acb-532cab27260d"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("c574e060-3d51-4052-a9f0-acb8c6bbc1ad"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("d21c24a0-af82-447d-863d-ec67c4f71fa3"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("dd0dac9e-0b2f-4bc6-a95b-533a69876563"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("e058c32b-fe03-405e-af29-3c83c44175a5"), null, null, "admin@mayar.com", "Admin", "$2a$11$erDsCYM8h3p.uRLo0T8AgekxOfUmeiRf.d/VUHNcp96MEPy6sVq4m", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("bb16dc0f-0dd5-476f-9acb-532cab27260d"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("c574e060-3d51-4052-a9f0-acb8c6bbc1ad"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("d21c24a0-af82-447d-863d-ec67c4f71fa3"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("dd0dac9e-0b2f-4bc6-a95b-533a69876563"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("e058c32b-fe03-405e-af29-3c83c44175a5"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("c31c9ae1-b842-418d-8862-20038e3eb671"), null, null, "admin@mayar.com", "Admin", "$2a$11$oOoroKeWIZJkhWgR8GZPk.86FUczCbUrKNwTdbok3x82txlTOa6pK", null, null, null, null, "Admin" });
        }
    }
}
