using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductFeatureEnitity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.DropColumn(
                name: "IconName",
                table: "ProductFeatures");

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ProductFeatures");

            migrationBuilder.DropColumn(
                name: "LabelArabic",
                table: "ProductFeatures");

            migrationBuilder.DropColumn(
                name: "LabelEnglish",
                table: "ProductFeatures");

            migrationBuilder.AddColumn<Guid>(
                name: "TrustBadgeId",
                table: "ProductFeatures",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

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

            migrationBuilder.CreateIndex(
                name: "IX_ProductFeatures_TrustBadgeId",
                table: "ProductFeatures",
                column: "TrustBadgeId");

            migrationBuilder.AddForeignKey(
                name: "FK_ProductFeatures_TrustBadges_TrustBadgeId",
                table: "ProductFeatures",
                column: "TrustBadgeId",
                principalTable: "TrustBadges",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ProductFeatures_TrustBadges_TrustBadgeId",
                table: "ProductFeatures");

            migrationBuilder.DropIndex(
                name: "IX_ProductFeatures_TrustBadgeId",
                table: "ProductFeatures");

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

            migrationBuilder.DropColumn(
                name: "TrustBadgeId",
                table: "ProductFeatures");

            migrationBuilder.AddColumn<string>(
                name: "IconName",
                table: "ProductFeatures",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ProductFeatures",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LabelArabic",
                table: "ProductFeatures",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "LabelEnglish",
                table: "ProductFeatures",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

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
    }
}
