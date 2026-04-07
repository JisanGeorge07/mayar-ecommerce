using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdatePromoBannerEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("8b743f6c-9ff2-4ec9-996a-2cfe8f9196de"));

            migrationBuilder.RenameColumn(
                name: "SubtitleEnglish",
                table: "PromoBanners",
                newName: "MobileImageUrl");

            migrationBuilder.RenameColumn(
                name: "SubtitleArabic",
                table: "PromoBanners",
                newName: "LabelEnglish");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "PromoBanners",
                newName: "LabelArabic");

            migrationBuilder.RenameColumn(
                name: "ImageAlt",
                table: "PromoBanners",
                newName: "DesktopImageUrl");

            migrationBuilder.RenameColumn(
                name: "ButtonTextEnglish",
                table: "PromoBanners",
                newName: "CustomUrl");

            migrationBuilder.RenameColumn(
                name: "ButtonTextArabic",
                table: "PromoBanners",
                newName: "CtaTextEnglish");

            migrationBuilder.RenameColumn(
                name: "ButtonLink",
                table: "PromoBanners",
                newName: "CtaTextArabic");

            migrationBuilder.AddColumn<string>(
                name: "AltText",
                table: "PromoBanners",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "CategoryId",
                table: "PromoBanners",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "PromoBanners",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "InternalName",
                table: "PromoBanners",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "PromoBanners",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "LayoutType",
                table: "PromoBanners",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "LinkType",
                table: "PromoBanners",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductId",
                table: "PromoBanners",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<Guid>(
                name: "ProductTypeId",
                table: "PromoBanners",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<int>(
                name: "SortOrder",
                table: "PromoBanners",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<Guid>(
                name: "SubcategoryId",
                table: "PromoBanners",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "PromoBanners",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("2237d2b8-55e7-4f1e-b68c-140463afff05"), null, null, "admin@mayar.com", "Admin", "$2a$11$Pfxq.bVH/W/gQlfTn91y7.MErkBjzGpDrIYHK.L2Kbl0xRSbpPpHW", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_PromoBanners_CategoryId",
                table: "PromoBanners",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_PromoBanners_ProductId",
                table: "PromoBanners",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_PromoBanners_ProductTypeId",
                table: "PromoBanners",
                column: "ProductTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_PromoBanners_SubcategoryId",
                table: "PromoBanners",
                column: "SubcategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_CategoryId",
                table: "HeroSlides",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_ProductId",
                table: "HeroSlides",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_ProductTypeId",
                table: "HeroSlides",
                column: "ProductTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_HeroSlides_SubcategoryId",
                table: "HeroSlides",
                column: "SubcategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_HeroSlides_BottomCategories_ProductTypeId",
                table: "HeroSlides",
                column: "ProductTypeId",
                principalTable: "BottomCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HeroSlides_MiddleCategories_SubcategoryId",
                table: "HeroSlides",
                column: "SubcategoryId",
                principalTable: "MiddleCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HeroSlides_Products_ProductId",
                table: "HeroSlides",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HeroSlides_TopCategories_CategoryId",
                table: "HeroSlides",
                column: "CategoryId",
                principalTable: "TopCategories",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_PromoBanners_BottomCategories_ProductTypeId",
                table: "PromoBanners",
                column: "ProductTypeId",
                principalTable: "BottomCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PromoBanners_MiddleCategories_SubcategoryId",
                table: "PromoBanners",
                column: "SubcategoryId",
                principalTable: "MiddleCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PromoBanners_Products_ProductId",
                table: "PromoBanners",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);

            migrationBuilder.AddForeignKey(
                name: "FK_PromoBanners_TopCategories_CategoryId",
                table: "PromoBanners",
                column: "CategoryId",
                principalTable: "TopCategories",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HeroSlides_BottomCategories_ProductTypeId",
                table: "HeroSlides");

            migrationBuilder.DropForeignKey(
                name: "FK_HeroSlides_MiddleCategories_SubcategoryId",
                table: "HeroSlides");

            migrationBuilder.DropForeignKey(
                name: "FK_HeroSlides_Products_ProductId",
                table: "HeroSlides");

            migrationBuilder.DropForeignKey(
                name: "FK_HeroSlides_TopCategories_CategoryId",
                table: "HeroSlides");

            migrationBuilder.DropForeignKey(
                name: "FK_PromoBanners_BottomCategories_ProductTypeId",
                table: "PromoBanners");

            migrationBuilder.DropForeignKey(
                name: "FK_PromoBanners_MiddleCategories_SubcategoryId",
                table: "PromoBanners");

            migrationBuilder.DropForeignKey(
                name: "FK_PromoBanners_Products_ProductId",
                table: "PromoBanners");

            migrationBuilder.DropForeignKey(
                name: "FK_PromoBanners_TopCategories_CategoryId",
                table: "PromoBanners");

            migrationBuilder.DropIndex(
                name: "IX_PromoBanners_CategoryId",
                table: "PromoBanners");

            migrationBuilder.DropIndex(
                name: "IX_PromoBanners_ProductId",
                table: "PromoBanners");

            migrationBuilder.DropIndex(
                name: "IX_PromoBanners_ProductTypeId",
                table: "PromoBanners");

            migrationBuilder.DropIndex(
                name: "IX_PromoBanners_SubcategoryId",
                table: "PromoBanners");

            migrationBuilder.DropIndex(
                name: "IX_HeroSlides_CategoryId",
                table: "HeroSlides");

            migrationBuilder.DropIndex(
                name: "IX_HeroSlides_ProductId",
                table: "HeroSlides");

            migrationBuilder.DropIndex(
                name: "IX_HeroSlides_ProductTypeId",
                table: "HeroSlides");

            migrationBuilder.DropIndex(
                name: "IX_HeroSlides_SubcategoryId",
                table: "HeroSlides");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2237d2b8-55e7-4f1e-b68c-140463afff05"));

            migrationBuilder.DropColumn(
                name: "AltText",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "InternalName",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "LayoutType",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "LinkType",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "ProductTypeId",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "SortOrder",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "SubcategoryId",
                table: "PromoBanners");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "PromoBanners");

            migrationBuilder.RenameColumn(
                name: "MobileImageUrl",
                table: "PromoBanners",
                newName: "SubtitleEnglish");

            migrationBuilder.RenameColumn(
                name: "LabelEnglish",
                table: "PromoBanners",
                newName: "SubtitleArabic");

            migrationBuilder.RenameColumn(
                name: "LabelArabic",
                table: "PromoBanners",
                newName: "ImageUrl");

            migrationBuilder.RenameColumn(
                name: "DesktopImageUrl",
                table: "PromoBanners",
                newName: "ImageAlt");

            migrationBuilder.RenameColumn(
                name: "CustomUrl",
                table: "PromoBanners",
                newName: "ButtonTextEnglish");

            migrationBuilder.RenameColumn(
                name: "CtaTextEnglish",
                table: "PromoBanners",
                newName: "ButtonTextArabic");

            migrationBuilder.RenameColumn(
                name: "CtaTextArabic",
                table: "PromoBanners",
                newName: "ButtonLink");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("8b743f6c-9ff2-4ec9-996a-2cfe8f9196de"), null, null, "admin@mayar.com", "Admin", "$2a$11$Li7Pwzs76RYVLGKoTjco4.lXez.0Qw7KzRgkEOWB7bReZtUcZ2efW", null, null, null, null, "Admin" });
        }
    }
}
