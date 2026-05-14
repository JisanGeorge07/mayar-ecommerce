using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddNotificationsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    TitleEnglish = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TitleArabic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MessageEnglish = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    MessageArabic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Priority = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsRead = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ReferenceType = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ReferenceId = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsAdminNotification = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    Status = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id");
                })
                .Annotation("MySql:CharSet", "utf8mb4");

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

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");

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
    }
}
