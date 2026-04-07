using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMiddleCategoryDisplayOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("da46b1fb-7692-4ca3-88de-0df649cb84e2"));

            migrationBuilder.AddColumn<long>(
                name: "DisplayOrder",
                table: "MiddleCategories",
                type: "bigint",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("332b025d-bdeb-44c0-a5a4-3552fc03d360"), null, null, "admin@mayar.com", "Admin", "$2a$11$h0dfo6Gk59mfOGdQQCrQM.MuXLCy2aPpmJxFSkYgCL/XcjCGTE9Me", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("332b025d-bdeb-44c0-a5a4-3552fc03d360"));

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "MiddleCategories");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("da46b1fb-7692-4ca3-88de-0df649cb84e2"), null, null, "admin@mayar.com", "Admin", "$2a$11$zSoJM2c055nLKcFKQOY60ujaJTmS1rxg5DB5PTwsob7AjGKzEA6ti", null, null, null, null, "Admin" });
        }
    }
}
