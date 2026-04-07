using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddISPrimaryOptionPrductImageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("e21fca12-43a5-4234-abe8-ce6ab03c7656"));

            migrationBuilder.AddColumn<bool>(
                name: "IsPrimary",
                table: "ProductImages",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("fb1ed42b-66ec-4be1-a394-fbb390888c13"), null, null, "admin@mayar.com", "Admin", "$2a$11$jNSNxhuGVOOjH7CUJ2QwF.lQrAwsNZ3bZZuisL.HRUs9WDusDS8b6", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("fb1ed42b-66ec-4be1-a394-fbb390888c13"));

            migrationBuilder.DropColumn(
                name: "IsPrimary",
                table: "ProductImages");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("e21fca12-43a5-4234-abe8-ce6ab03c7656"), null, null, "admin@mayar.com", "Admin", "$2a$11$PO.S6ORvuRjwMkuonxP5VeNstvwL46W9d16IV2XpPqu320kveLGAq", null, null, null, null, "Admin" });
        }
    }
}
