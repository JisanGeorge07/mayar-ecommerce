using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAddressEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("071e0d1f-7442-4a7e-98e9-2fb7b9f19ba6"));

            migrationBuilder.DropColumn(
                name: "LabelAr",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "LabelEn",
                table: "Addresses",
                newName: "Label");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Addresses",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "FirstName",
                table: "Addresses",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "LastName",
                table: "Addresses",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Phone",
                table: "Addresses",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("054578b4-2bef-48f4-8cc8-d1e54e3318a4"), null, null, "admin@mayar.com", "Admin", "$2a$11$KUWyMQyZn27eJ/4R4d7p8OirpbnVLBA7MsnqAn6tQ4Pb7ioDGt9Jm", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("054578b4-2bef-48f4-8cc8-d1e54e3318a4"));

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "FirstName",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "LastName",
                table: "Addresses");

            migrationBuilder.DropColumn(
                name: "Phone",
                table: "Addresses");

            migrationBuilder.RenameColumn(
                name: "Label",
                table: "Addresses",
                newName: "LabelEn");

            migrationBuilder.AddColumn<string>(
                name: "LabelAr",
                table: "Addresses",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("071e0d1f-7442-4a7e-98e9-2fb7b9f19ba6"), null, null, "admin@mayar.com", "Admin", "$2a$11$gbwQ8PQyUm3YeIHMZt6Xpucvfd8D4LzIROa/J6eR/8aL/7x74i1ay", null, null, null, null, "Admin" });
        }
    }
}
