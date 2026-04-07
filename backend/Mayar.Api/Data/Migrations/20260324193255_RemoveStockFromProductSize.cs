using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveStockFromProductSize : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("7fe923de-cd05-4460-9300-a27696f34d42"));

            migrationBuilder.DropColumn(
                name: "Stock",
                table: "ProductSizes");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("f674f78e-8428-43f6-907e-830c86747b9a"), null, null, "admin@mayar.com", "Admin", "$2a$11$aN4rYpIlPx55oeAwrgSfX.X0YYdczBJZR5VAboqV4C50aQ3DDdttq", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f674f78e-8428-43f6-907e-830c86747b9a"));

            migrationBuilder.AddColumn<int>(
                name: "Stock",
                table: "ProductSizes",
                type: "int",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("7fe923de-cd05-4460-9300-a27696f34d42"), null, null, "admin@mayar.com", "Admin", "$2a$11$iXKcoCu.dFeOlRed/.3AJ.8PXrAq5WGsxWpCU.EbAvPxmmFUixKXS", null, null, null, null, "Admin" });
        }
    }
}
