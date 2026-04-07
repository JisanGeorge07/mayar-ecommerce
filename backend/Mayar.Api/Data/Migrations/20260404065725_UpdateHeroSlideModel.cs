using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateHeroSlideModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("55d51c3d-58e3-464e-a43d-7d80af0df91a"));

            migrationBuilder.RenameColumn(
                name: "SubtitleEnglish",
                table: "HeroSlides",
                newName: "Slug");

            migrationBuilder.RenameColumn(
                name: "SubtitleArabic",
                table: "HeroSlides",
                newName: "MobileImageUrl");

            migrationBuilder.RenameColumn(
                name: "OldPrice",
                table: "HeroSlides",
                newName: "OldPriceKWD");

            migrationBuilder.RenameColumn(
                name: "NewPrice",
                table: "HeroSlides",
                newName: "CurrentPriceKWD");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "HeroSlides",
                newName: "LinkType");

            migrationBuilder.RenameColumn(
                name: "ButtonTextEnglish",
                table: "HeroSlides",
                newName: "LabelEnglish");

            migrationBuilder.RenameColumn(
                name: "ButtonTextArabic",
                table: "HeroSlides",
                newName: "LabelArabic");

            migrationBuilder.RenameColumn(
                name: "ButtonLink",
                table: "HeroSlides",
                newName: "DesktopImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "AltText",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "BannerName",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "HeroSlides",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "HeroSlides",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "CtaTextArabic",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "CtaTextEnglish",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "CurrentPriceINR",
                table: "HeroSlides",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomUrl",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionArabic",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEnglish",
                table: "HeroSlides",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "HeroSlides",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "OldPriceINR",
                table: "HeroSlides",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "HeroSlides",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductTypeId",
                table: "HeroSlides",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "HeroSlides",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SubcategoryId",
                table: "HeroSlides",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "HeroSlides",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("8b743f6c-9ff2-4ec9-996a-2cfe8f9196de"), null, null, "admin@mayar.com", "Admin", "$2a$11$Li7Pwzs76RYVLGKoTjco4.lXez.0Qw7KzRgkEOWB7bReZtUcZ2efW", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("8b743f6c-9ff2-4ec9-996a-2cfe8f9196de"));

            migrationBuilder.DropColumn(
                name: "AltText",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "BannerName",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "CtaTextArabic",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "CtaTextEnglish",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "CurrentPriceINR",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "CustomUrl",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "DescriptionArabic",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "DescriptionEnglish",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "OldPriceINR",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "ProductTypeId",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "SubcategoryId",
                table: "HeroSlides");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "HeroSlides");

            migrationBuilder.RenameColumn(
                name: "Slug",
                table: "HeroSlides",
                newName: "SubtitleEnglish");

            migrationBuilder.RenameColumn(
                name: "OldPriceKWD",
                table: "HeroSlides",
                newName: "OldPrice");

            migrationBuilder.RenameColumn(
                name: "MobileImageUrl",
                table: "HeroSlides",
                newName: "SubtitleArabic");

            migrationBuilder.RenameColumn(
                name: "LinkType",
                table: "HeroSlides",
                newName: "ImageUrl");

            migrationBuilder.RenameColumn(
                name: "LabelEnglish",
                table: "HeroSlides",
                newName: "ButtonTextEnglish");

            migrationBuilder.RenameColumn(
                name: "LabelArabic",
                table: "HeroSlides",
                newName: "ButtonTextArabic");

            migrationBuilder.RenameColumn(
                name: "DesktopImageUrl",
                table: "HeroSlides",
                newName: "ButtonLink");

            migrationBuilder.RenameColumn(
                name: "CurrentPriceKWD",
                table: "HeroSlides",
                newName: "NewPrice");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("55d51c3d-58e3-464e-a43d-7d80af0df91a"), null, null, "admin@mayar.com", "Admin", "$2a$11$iuq5lg8Un7Ah2sFi/QB6.OOfQ.gupG5eUSxLijJhOEMLNFB5it/TC", null, null, null, null, "Admin" });
        }
    }
}
