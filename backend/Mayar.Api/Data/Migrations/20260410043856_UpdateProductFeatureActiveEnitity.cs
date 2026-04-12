using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductFeatureActiveEnitity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("28723188-ecaa-4084-b21b-29a4edb7f6b2"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("41e234f9-b83d-42ed-87cd-4e38e1954466"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("539d45bb-eed8-4b3a-8681-d49b345cce8c"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("a3e2103d-f482-48d6-99af-61db4c7a1634"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("72d07b53-b362-4472-8b11-0faa859ae16e"));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductFeatures",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("85f3aaf4-10d6-4ab3-98f0-6a302fe7f557"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("cf61bcb8-f593-4516-a688-2948a94a5150"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("e9a56a8a-baef-4699-b9cb-6a3ef9c22815"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("ee77afc6-519a-47e5-898e-87238da51429"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("37f0dc8f-4c0a-4cc9-8d37-3af44f1e658a"), null, null, "admin@mayar.com", "Admin", "$2a$11$.sQGwOTrp.d/tyiFtwbm0.i.dqhLgidprz7TY.0QbQylXex/RNyB.", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("85f3aaf4-10d6-4ab3-98f0-6a302fe7f557"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("cf61bcb8-f593-4516-a688-2948a94a5150"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("e9a56a8a-baef-4699-b9cb-6a3ef9c22815"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("ee77afc6-519a-47e5-898e-87238da51429"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("37f0dc8f-4c0a-4cc9-8d37-3af44f1e658a"));

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductFeatures");

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("28723188-ecaa-4084-b21b-29a4edb7f6b2"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("41e234f9-b83d-42ed-87cd-4e38e1954466"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("539d45bb-eed8-4b3a-8681-d49b345cce8c"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("a3e2103d-f482-48d6-99af-61db4c7a1634"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("72d07b53-b362-4472-8b11-0faa859ae16e"), null, null, "admin@mayar.com", "Admin", "$2a$11$UDTfmRn8A9jwx8wZo9cywu1K1sarIR9LN5YrB5vlawLSMjGq2Z1fu", null, null, null, null, "Admin" });
        }
    }
}
