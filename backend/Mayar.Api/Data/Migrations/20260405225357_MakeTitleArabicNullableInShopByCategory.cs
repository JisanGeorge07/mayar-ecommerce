using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeTitleArabicNullableInShopByCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("39cb0229-3c80-421f-8c4e-485aa30b49b2"));

            migrationBuilder.AlterColumn<string>(
                name: "TitleArabic",
                table: "ShopByCategories",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("c1e7d86f-ed2b-40b5-8037-3c5a6a7c7bfd"), null, null, "admin@mayar.com", "Admin", "$2a$11$gHFsAVQ77JE/ZiCUMZxjpu.PgnMeTeNca4o23RenoJsCQ6bpxJAzK", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c1e7d86f-ed2b-40b5-8037-3c5a6a7c7bfd"));

            migrationBuilder.UpdateData(
                table: "ShopByCategories",
                keyColumn: "TitleArabic",
                keyValue: null,
                column: "TitleArabic",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "TitleArabic",
                table: "ShopByCategories",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("39cb0229-3c80-421f-8c4e-485aa30b49b2"), null, null, "admin@mayar.com", "Admin", "$2a$11$kO2cBqHCMCeEXkCeroqCOeFPoA3GImyW6Q3EP1qK6b61fY5GDUBzi", null, null, null, null, "Admin" });
        }
    }
}
