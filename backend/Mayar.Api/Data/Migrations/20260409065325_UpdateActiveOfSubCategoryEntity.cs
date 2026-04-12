using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateActiveOfSubCategoryEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("8dc09adf-f19a-4049-a69e-77d141ea7ad7"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("dd5da29b-9d6a-46bd-a5dd-475d7831e814"), null, null, "admin@mayar.com", "Admin", "$2a$11$y8InAKf2eGg73lftdo3Fren4Ov1pbkaeCJaItlRVLr9BjIzUFUjgy", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("dd5da29b-9d6a-46bd-a5dd-475d7831e814"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("8dc09adf-f19a-4049-a69e-77d141ea7ad7"), null, null, "admin@mayar.com", "Admin", "$2a$11$cik5618IrMZtzAhATCisrOIMy5WVFZ/A5/rdx5hGG9khZR5dxjASa", null, null, null, null, "Admin" });
        }
    }
}
