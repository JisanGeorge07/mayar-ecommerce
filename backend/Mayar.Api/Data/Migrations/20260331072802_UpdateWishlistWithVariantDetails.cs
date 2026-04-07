using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWishlistWithVariantDetails : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f674f78e-8428-43f6-907e-830c86747b9a"));

            migrationBuilder.AddColumn<string>(
                name: "ColorHex",
                table: "Wishlists",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ColorNameArabic",
                table: "Wishlists",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ColorNameEnglish",
                table: "Wishlists",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "Wishlists",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "PriceINR",
                table: "Wishlists",
                type: "decimal(18,0)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PriceKWD",
                table: "Wishlists",
                type: "decimal(18,3)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductVariantId",
                table: "Wishlists",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<string>(
                name: "SizeLabel",
                table: "Wishlists",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("a2247a15-38b5-431c-88af-b1597b871357"), null, null, "admin@mayar.com", "Admin", "$2a$11$XaUn0M3Eu/Xvn8SYXMbd3.dYv8JSpCeGUB0XbBR2o2TdeL9DSydLC", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_ProductVariantId",
                table: "Wishlists",
                column: "ProductVariantId");

            migrationBuilder.CreateIndex(
                name: "IX_Wishlists_UserId_ProductVariantId",
                table: "Wishlists",
                columns: new[] { "UserId", "ProductVariantId" },
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Wishlists_ProductVariants_ProductVariantId",
                table: "Wishlists",
                column: "ProductVariantId",
                principalTable: "ProductVariants",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wishlists_ProductVariants_ProductVariantId",
                table: "Wishlists");

            migrationBuilder.DropIndex(
                name: "IX_Wishlists_ProductVariantId",
                table: "Wishlists");

            migrationBuilder.DropIndex(
                name: "IX_Wishlists_UserId_ProductVariantId",
                table: "Wishlists");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("a2247a15-38b5-431c-88af-b1597b871357"));

            migrationBuilder.DropColumn(
                name: "ColorHex",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "ColorNameArabic",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "ColorNameEnglish",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "PriceINR",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "PriceKWD",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "ProductVariantId",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "SizeLabel",
                table: "Wishlists");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("f674f78e-8428-43f6-907e-830c86747b9a"), null, null, "admin@mayar.com", "Admin", "$2a$11$aN4rYpIlPx55oeAwrgSfX.X0YYdczBJZR5VAboqV4C50aQ3DDdttq", null, null, null, null, "Admin" });
        }
    }
}
