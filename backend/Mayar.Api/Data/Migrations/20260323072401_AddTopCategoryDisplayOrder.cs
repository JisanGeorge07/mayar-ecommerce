using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddTopCategoryDisplayOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("90440b76-da46-4445-9797-1193a14035e3"));

            migrationBuilder.AddColumn<long>(
                name: "DisplayOrder",
                table: "TopCategories",
                type: "bigint",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("da46b1fb-7692-4ca3-88de-0df649cb84e2"), null, null, "admin@mayar.com", "Admin", "$2a$11$zSoJM2c055nLKcFKQOY60ujaJTmS1rxg5DB5PTwsob7AjGKzEA6ti", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("da46b1fb-7692-4ca3-88de-0df649cb84e2"));

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "TopCategories");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("90440b76-da46-4445-9797-1193a14035e3"), null, null, "admin@mayar.com", "Admin", "$2a$11$nop3EZNu.BjNSpPu2pIq9ugYlWzVqBah1rDAV3P7u6X6ciBIdIX42", null, null, null, null, "Admin" });
        }
    }
}
