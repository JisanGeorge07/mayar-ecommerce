using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddMetadataAndNewPricingProductModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaee4f41-bfd0-47c7-82e6-56108cdafb7f"));

            migrationBuilder.RenameColumn(
                name: "CompareAtPrice",
                table: "Products",
                newName: "CompareAtPriceKWD");

            migrationBuilder.RenameColumn(
                name: "BasePrice",
                table: "Products",
                newName: "BasePriceKWD");

            migrationBuilder.AddColumn<decimal>(
                name: "BasePriceINR",
                table: "Products",
                type: "decimal(18,0)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CanonicalUrl",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "CompareAtPriceINR",
                table: "Products",
                type: "decimal(18,0)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaDescription",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaKeywords",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitle",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "OGDescription",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "OGImageUrl",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "OGTitle",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TwitterDescription",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TwitterTitle",
                table: "Products",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("e21fca12-43a5-4234-abe8-ce6ab03c7656"), null, null, "admin@mayar.com", "Admin", "$2a$11$PO.S6ORvuRjwMkuonxP5VeNstvwL46W9d16IV2XpPqu320kveLGAq", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("e21fca12-43a5-4234-abe8-ce6ab03c7656"));

            migrationBuilder.DropColumn(
                name: "BasePriceINR",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CanonicalUrl",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "CompareAtPriceINR",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MetaDescription",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MetaKeywords",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MetaTitle",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OGDescription",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OGImageUrl",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "OGTitle",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TwitterDescription",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "TwitterTitle",
                table: "Products");

            migrationBuilder.RenameColumn(
                name: "CompareAtPriceKWD",
                table: "Products",
                newName: "CompareAtPrice");

            migrationBuilder.RenameColumn(
                name: "BasePriceKWD",
                table: "Products",
                newName: "BasePrice");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("aaee4f41-bfd0-47c7-82e6-56108cdafb7f"), null, null, "admin@mayar.com", "Admin", "$2a$11$FesHaNgI9a0Dde8Jg0fLVOvc11vHN7iCLjOhpmQbCumtyHl99HLsS", null, null, null, null, "Admin" });
        }
    }
}
