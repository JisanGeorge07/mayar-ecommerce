using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateActiveOfTopCategoryEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c524ffaf-b709-4765-994b-9cf1c7f26d3d"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("8dc09adf-f19a-4049-a69e-77d141ea7ad7"), null, null, "admin@mayar.com", "Admin", "$2a$11$cik5618IrMZtzAhATCisrOIMy5WVFZ/A5/rdx5hGG9khZR5dxjASa", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("8dc09adf-f19a-4049-a69e-77d141ea7ad7"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("c524ffaf-b709-4765-994b-9cf1c7f26d3d"), null, null, "admin@mayar.com", "Admin", "$2a$11$o2gAXj1NY2MIb9tecOx7e.wfNLQK/rclYaQIDH984/aa0dwasqgUq", null, null, null, null, "Admin" });
        }
    }
}
