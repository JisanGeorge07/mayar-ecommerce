using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationConfirmationFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("0ae66c0a-600e-47f6-a4b9-fb654fe3ba32"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("0fcfdd43-0a62-4c86-88b2-94f80ed82ee7"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("d90b184f-95ce-447b-8c76-800cae4fe75d"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("dc7545fb-7aa1-416f-bf61-30ca33e66a31"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("4bd5229a-33f9-46c9-bf16-04068f56556a"));

            migrationBuilder.AddColumn<DateTime>(
                name: "ConfirmedAt",
                table: "Notifications",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ConfirmedBy",
                table: "Notifications",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsConfirmed",
                table: "Notifications",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("02e9071c-d1a2-43fc-a4f3-dab44084ea04"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("8150229a-919e-48f9-ac36-5087ce1991e5"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("dbaab5ed-1dc8-4df7-92fe-691543bf5982"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("de71732e-c0b9-4ca4-b58f-46d93a3844a9"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PasswordResetToken", "PasswordResetTokenExpiry", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("d9edc079-1fdc-4ed4-965f-6f7d8e52c72c"), null, null, "admin@mayar.com", "Admin", "$2a$11$nbhg.F82q9aAkRLW5YV2m.fZ4mhhHUcvTlvnNLLSIVkQZ25SLo5Su", null, null, null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("02e9071c-d1a2-43fc-a4f3-dab44084ea04"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("8150229a-919e-48f9-ac36-5087ce1991e5"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("dbaab5ed-1dc8-4df7-92fe-691543bf5982"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("de71732e-c0b9-4ca4-b58f-46d93a3844a9"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("d9edc079-1fdc-4ed4-965f-6f7d8e52c72c"));

            migrationBuilder.DropColumn(
                name: "ConfirmedAt",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ConfirmedBy",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "IsConfirmed",
                table: "Notifications");

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("0ae66c0a-600e-47f6-a4b9-fb654fe3ba32"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("0fcfdd43-0a62-4c86-88b2-94f80ed82ee7"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("d90b184f-95ce-447b-8c76-800cae4fe75d"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("dc7545fb-7aa1-416f-bf61-30ca33e66a31"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PasswordResetToken", "PasswordResetTokenExpiry", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("4bd5229a-33f9-46c9-bf16-04068f56556a"), null, null, "admin@mayar.com", "Admin", "$2a$11$gN4QSKNjXMPyXzu4FLuxb.twYUqG1cEfCXzTiCPjCX3obGxyNT0zO", null, null, null, null, null, null, "Admin" });
        }
    }
}
