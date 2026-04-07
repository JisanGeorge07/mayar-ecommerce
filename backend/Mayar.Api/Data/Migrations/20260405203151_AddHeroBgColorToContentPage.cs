using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddHeroBgColorToContentPage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("60e6627a-1b93-42ec-8354-b680e4a5e863"));

            migrationBuilder.AddColumn<string>(
                name: "HeroBgColor",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("250d8861-ab70-47b8-b916-d1ff82c61c41"), null, null, "admin@mayar.com", "Admin", "$2a$11$TlVTzoceis6pxV/pKAa02efM.6HT6mlZ/M/lm6wduQuI4fOsQaJum", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("250d8861-ab70-47b8-b916-d1ff82c61c41"));

            migrationBuilder.DropColumn(
                name: "HeroBgColor",
                table: "ContentPages");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("60e6627a-1b93-42ec-8354-b680e4a5e863"), null, null, "admin@mayar.com", "Admin", "$2a$11$2TffCCA64T5KEJqlpoYSnecHxHjt/eSlK6uECQWFTh5uDs5ZjfX2S", null, null, null, null, "Admin" });
        }
    }
}
