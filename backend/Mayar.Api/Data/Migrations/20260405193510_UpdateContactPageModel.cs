using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContactPageModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2f7e371d-e74a-4c56-a886-45d2ae9dbf13"));

            migrationBuilder.DropColumn(
                name: "AddressArabic",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "AddressEnglish",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "Email",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "LocationUrl",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "PhoneNumber",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "SectionSubtitleArabic",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "SectionSubtitleEnglish",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "SectionTitleArabic",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "SectionTitleEnglish",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "WhatsAppNumber",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "WorkingHoursArabic",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "WorkingHoursEnglish",
                table: "Contact");

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedAt",
                table: "Contact",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "HeroBgColor",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroHeadingAr",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroHeadingEn",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroSubheadingAr",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroSubheadingEn",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MapEmbedUrl",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "MapHeight",
                table: "Contact",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "MetaDescriptionAr",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaDescriptionEn",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitleAr",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitleEn",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "ShowMap",
                table: "Contact",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Contact",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Contact",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "ContactCards",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Icon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LabelEn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LabelAr = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ValueEn = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ValueAr = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    ContactId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ContactCards", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ContactCards_Contact_ContactId",
                        column: x => x.ContactId,
                        principalTable: "Contact",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("3c8408c9-31a3-4dc3-8ffe-7eb0d8c253c6"), null, null, "admin@mayar.com", "Admin", "$2a$11$fkKecfsH2mwfGCX2vyUOYuZiWZtXTCJCI9QSvIUlv24iUm11LHnRe", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_ContactCards_ContactId",
                table: "ContactCards",
                column: "ContactId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ContactCards");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3c8408c9-31a3-4dc3-8ffe-7eb0d8c253c6"));

            migrationBuilder.DropColumn(
                name: "CreatedAt",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "HeroBgColor",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "HeroHeadingAr",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "HeroHeadingEn",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "HeroSubheadingAr",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "HeroSubheadingEn",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "MapEmbedUrl",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "MapHeight",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "MetaDescriptionAr",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "MetaDescriptionEn",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "MetaTitleAr",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "MetaTitleEn",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "ShowMap",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Contact");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Contact");

            migrationBuilder.AddColumn<string>(
                name: "AddressArabic",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AddressEnglish",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Email",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "LocationUrl",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "PhoneNumber",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionSubtitleArabic",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionSubtitleEnglish",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionTitleArabic",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionTitleEnglish",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "WhatsAppNumber",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "WorkingHoursArabic",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "WorkingHoursEnglish",
                table: "Contact",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("2f7e371d-e74a-4c56-a886-45d2ae9dbf13"), null, null, "admin@mayar.com", "Admin", "$2a$11$uQWL38qWg21lcPsTAtqasOWRaptnF5o4TAh9S/A6Ha4Gmsj.7lVIq", null, null, null, null, "Admin" });
        }
    }
}
