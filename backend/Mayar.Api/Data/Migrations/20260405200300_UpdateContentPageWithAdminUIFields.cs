using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateContentPageWithAdminUIFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("3c8408c9-31a3-4dc3-8ffe-7eb0d8c253c6"));

            migrationBuilder.AddColumn<bool>(
                name: "IsActive",
                table: "ContentSections",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: true);

            migrationBuilder.AddColumn<string>(
                name: "ContactEmail",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ContactPhone",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ContactTitleAr",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ContactTitleEn",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "EffectiveDate",
                table: "ContentPages",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "LastRevisedDate",
                table: "ContentPages",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MetaDescriptionAr",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaDescriptionEn",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitleAr",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitleEn",
                table: "ContentPages",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "ContentPages",
                type: "varchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "published")
                .Annotation("MySql:CharSet", "utf8mb4");

            // Update existing ContentPages to have Status = "published"
            migrationBuilder.Sql("UPDATE ContentPages SET Status = 'published' WHERE Status IS NULL OR Status = ''");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("60e6627a-1b93-42ec-8354-b680e4a5e863"), null, null, "admin@mayar.com", "Admin", "$2a$11$2TffCCA64T5KEJqlpoYSnecHxHjt/eSlK6uECQWFTh5uDs5ZjfX2S", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("60e6627a-1b93-42ec-8354-b680e4a5e863"));

            migrationBuilder.DropColumn(
                name: "IsActive",
                table: "ContentSections");

            migrationBuilder.DropColumn(
                name: "ContactEmail",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "ContactPhone",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "ContactTitleAr",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "ContactTitleEn",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "EffectiveDate",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "LastRevisedDate",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "MetaDescriptionAr",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "MetaDescriptionEn",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "MetaTitleAr",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "MetaTitleEn",
                table: "ContentPages");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "ContentPages");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("3c8408c9-31a3-4dc3-8ffe-7eb0d8c253c6"), null, null, "admin@mayar.com", "Admin", "$2a$11$fkKecfsH2mwfGCX2vyUOYuZiWZtXTCJCI9QSvIUlv24iUm11LHnRe", null, null, null, null, "Admin" });
        }
    }
}
