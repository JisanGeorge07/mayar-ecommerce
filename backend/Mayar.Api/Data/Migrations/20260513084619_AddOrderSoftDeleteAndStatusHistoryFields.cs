using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderSoftDeleteAndStatusHistoryFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("39e42faa-6306-4a6d-b868-8957d3cff5de"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("3d038490-31c7-43a5-b05c-d32d17170f47"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("6d649038-1bca-4436-8880-0d27ef1aa473"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("8b9f534f-91de-4f16-bc41-1e6117300eef"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c3d49b7d-0df8-4e92-8de6-41cd66ca8a5f"));

            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "OrderStatusHistory",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "UpdatedByName",
                table: "OrderStatusHistory",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AdminNote",
                table: "Orders",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "DeletedAt",
                table: "Orders",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsDeleted",
                table: "Orders",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("0d15a5f8-05c0-4d52-a85e-58fcca2499f3"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("1a15bf2d-5e93-4280-821e-b6bbd688a220"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("47aea8f7-483d-4441-b6b4-3f5765c4e0cd"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("5961ee64-56f7-4ed7-968d-ede1cb8c3779"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PasswordResetToken", "PasswordResetTokenExpiry", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("a7f42c05-6a21-43ce-82e3-92a9785ec088"), null, null, "admin@mayar.com", "Admin", "$2a$11$wk2ftHJJEcX8xK2rjBVyDeqM.BDMc.MKk2xAwV1ul6CFdqkbYriLK", null, null, null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("0d15a5f8-05c0-4d52-a85e-58fcca2499f3"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("1a15bf2d-5e93-4280-821e-b6bbd688a220"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("47aea8f7-483d-4441-b6b4-3f5765c4e0cd"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("5961ee64-56f7-4ed7-968d-ede1cb8c3779"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("a7f42c05-6a21-43ce-82e3-92a9785ec088"));

            migrationBuilder.DropColumn(
                name: "Source",
                table: "OrderStatusHistory");

            migrationBuilder.DropColumn(
                name: "UpdatedByName",
                table: "OrderStatusHistory");

            migrationBuilder.DropColumn(
                name: "AdminNote",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "DeletedAt",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "IsDeleted",
                table: "Orders");

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("39e42faa-6306-4a6d-b868-8957d3cff5de"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("3d038490-31c7-43a5-b05c-d32d17170f47"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("6d649038-1bca-4436-8880-0d27ef1aa473"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("8b9f534f-91de-4f16-bc41-1e6117300eef"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PasswordResetToken", "PasswordResetTokenExpiry", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("c3d49b7d-0df8-4e92-8de6-41cd66ca8a5f"), null, null, "admin@mayar.com", "Admin", "$2a$11$UdmF5VmbDM.Ev.mbpzloTOCbvzEgQRsuq1uR6TUglWZYcfnXr.s1a", null, null, null, null, null, null, "Admin" });
        }
    }
}
