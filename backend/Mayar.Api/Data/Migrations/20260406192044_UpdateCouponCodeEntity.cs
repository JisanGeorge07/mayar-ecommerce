using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCouponCodeEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c1e7d86f-ed2b-40b5-8037-3c5a6a7c7bfd"));

            migrationBuilder.DropColumn(
                name: "DiscountAmountINR",
                table: "CouponCodes");

            migrationBuilder.RenameColumn(
                name: "IsActive",
                table: "CouponCodes",
                newName: "ShowInCartSuggestions");

            migrationBuilder.RenameColumn(
                name: "ExpiryDate",
                table: "CouponCodes",
                newName: "UpdatedAt");

            migrationBuilder.RenameColumn(
                name: "DiscountAmountKWD",
                table: "CouponCodes",
                newName: "MinOrderAmount");

            migrationBuilder.UpdateData(
                table: "CouponCodes",
                keyColumn: "Code",
                keyValue: null,
                column: "Code",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "CouponCodes",
                type: "varchar(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(255)",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionArabic",
                table: "CouponCodes",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEnglish",
                table: "CouponCodes",
                type: "varchar(500)",
                maxLength: 500,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "DiscountType",
                table: "CouponCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountValue",
                table: "CouponCodes",
                type: "decimal(18,3)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "DisplayOrder",
                table: "CouponCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndDate",
                table: "CouponCodes",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "FirstOrderOnly",
                table: "CouponCodes",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "MaxDiscountCap",
                table: "CouponCodes",
                type: "decimal(18,3)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NameArabic",
                table: "CouponCodes",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "NameEnglish",
                table: "CouponCodes",
                type: "varchar(200)",
                maxLength: 200,
                nullable: false,
                defaultValue: "")
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<int>(
                name: "Scope",
                table: "CouponCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "ScopeCategories",
                table: "CouponCodes",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "ScopeProducts",
                table: "CouponCodes",
                type: "varchar(1000)",
                maxLength: 1000,
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "StartDate",
                table: "CouponCodes",
                type: "datetime(6)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Status",
                table: "CouponCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "UsageLimit",
                table: "CouponCodes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsageLimitPerCustomer",
                table: "CouponCodes",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "UsedCount",
                table: "CouponCodes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("77a8590f-94d2-4eff-aea2-4c9d4a12c34a"), null, null, "admin@mayar.com", "Admin", "$2a$11$z3Y6x8XLs5JNWko55l0zbecn/gaMvcfmSmvpaanf3Im0/lK3orrca", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("77a8590f-94d2-4eff-aea2-4c9d4a12c34a"));

            migrationBuilder.DropColumn(
                name: "DescriptionArabic",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "DescriptionEnglish",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "DiscountType",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "DiscountValue",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "EndDate",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "FirstOrderOnly",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "MaxDiscountCap",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "NameArabic",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "NameEnglish",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "Scope",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "ScopeCategories",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "ScopeProducts",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "StartDate",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "UsageLimit",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "UsageLimitPerCustomer",
                table: "CouponCodes");

            migrationBuilder.DropColumn(
                name: "UsedCount",
                table: "CouponCodes");

            migrationBuilder.RenameColumn(
                name: "UpdatedAt",
                table: "CouponCodes",
                newName: "ExpiryDate");

            migrationBuilder.RenameColumn(
                name: "ShowInCartSuggestions",
                table: "CouponCodes",
                newName: "IsActive");

            migrationBuilder.RenameColumn(
                name: "MinOrderAmount",
                table: "CouponCodes",
                newName: "DiscountAmountKWD");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "CouponCodes",
                type: "varchar(255)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "varchar(50)",
                oldMaxLength: 50)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<decimal>(
                name: "DiscountAmountINR",
                table: "CouponCodes",
                type: "decimal(18,0)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("c1e7d86f-ed2b-40b5-8037-3c5a6a7c7bfd"), null, null, "admin@mayar.com", "Admin", "$2a$11$gHFsAVQ77JE/ZiCUMZxjpu.PgnMeTeNca4o23RenoJsCQ6bpxJAzK", null, null, null, null, "Admin" });
        }
    }
}
