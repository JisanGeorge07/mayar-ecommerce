using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductDetailsToWishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Clean up any leftover columns from previous failed migration attempt
            migrationBuilder.Sql(@"
                SET @exist_brand := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Wishlists' AND COLUMN_NAME = 'Brand');
                SET @sql_brand := IF(@exist_brand > 0, 'SELECT 1', 'ALTER TABLE Wishlists ADD COLUMN Brand LONGTEXT NULL');
                PREPARE stmt_brand FROM @sql_brand;
                EXECUTE stmt_brand;
                DEALLOCATE PREPARE stmt_brand;
            ");

            migrationBuilder.Sql(@"
                SET @exist_cpi := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Wishlists' AND COLUMN_NAME = 'CompareAtPriceINR');
                SET @sql_cpi := IF(@exist_cpi > 0, 'SELECT 1', 'ALTER TABLE Wishlists ADD COLUMN CompareAtPriceINR DECIMAL(18,0) NULL');
                PREPARE stmt_cpi FROM @sql_cpi;
                EXECUTE stmt_cpi;
                DEALLOCATE PREPARE stmt_cpi;
            ");

            migrationBuilder.Sql(@"
                SET @exist_cpk := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Wishlists' AND COLUMN_NAME = 'CompareAtPriceKWD');
                SET @sql_cpk := IF(@exist_cpk > 0, 'SELECT 1', 'ALTER TABLE Wishlists ADD COLUMN CompareAtPriceKWD DECIMAL(18,3) NULL');
                PREPARE stmt_cpk FROM @sql_cpk;
                EXECUTE stmt_cpk;
                DEALLOCATE PREPARE stmt_cpk;
            ");

            migrationBuilder.Sql(@"
                SET @exist_pna := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Wishlists' AND COLUMN_NAME = 'ProductNameArabic');
                SET @sql_pna := IF(@exist_pna > 0, 'SELECT 1', 'ALTER TABLE Wishlists ADD COLUMN ProductNameArabic LONGTEXT NULL');
                PREPARE stmt_pna FROM @sql_pna;
                EXECUTE stmt_pna;
                DEALLOCATE PREPARE stmt_pna;
            ");

            migrationBuilder.Sql(@"
                SET @exist_pne := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'Wishlists' AND COLUMN_NAME = 'ProductNameEnglish');
                SET @sql_pne := IF(@exist_pne > 0, 'SELECT 1', 'ALTER TABLE Wishlists ADD COLUMN ProductNameEnglish LONGTEXT NULL');
                PREPARE stmt_pne FROM @sql_pne;
                EXECUTE stmt_pne;
                DEALLOCATE PREPARE stmt_pne;
            ");

            // Clean up leftover ProductId1 column and index from previous failed migration
            migrationBuilder.Sql(@"
                SET @exist_idx := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductVariants' AND INDEX_NAME = 'IX_ProductVariants_ProductId1');
                SET @sql_idx := IF(@exist_idx > 0, 'DROP INDEX IX_ProductVariants_ProductId1 ON ProductVariants', 'SELECT 1');
                PREPARE stmt_idx FROM @sql_idx;
                EXECUTE stmt_idx;
                DEALLOCATE PREPARE stmt_idx;
            ");

            migrationBuilder.Sql(@"
                SET @exist_col := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'ProductVariants' AND COLUMN_NAME = 'ProductId1');
                SET @sql_col := IF(@exist_col > 0, 'ALTER TABLE ProductVariants DROP COLUMN ProductId1', 'SELECT 1');
                PREPARE stmt_col FROM @sql_col;
                EXECUTE stmt_col;
                DEALLOCATE PREPARE stmt_col;
            ");

            // Clean up admin user with old ID if exists, then insert new one
            migrationBuilder.Sql("DELETE FROM Users WHERE Email = 'admin@mayar.com';");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("ef357d16-2107-46c6-adb8-b4814c02331d"), null, null, "admin@mayar.com", "Admin", "$2a$11$E6A6jge0tbhAb8jmQd6jS.HapfpWltAd.3Hbvh9KaQ90YaaK/mcGu", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("ef357d16-2107-46c6-adb8-b4814c02331d"));

            migrationBuilder.DropColumn(
                name: "Brand",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "CompareAtPriceINR",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "CompareAtPriceKWD",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "ProductNameArabic",
                table: "Wishlists");

            migrationBuilder.DropColumn(
                name: "ProductNameEnglish",
                table: "Wishlists");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("a2247a15-38b5-431c-88af-b1597b871357"), null, null, "admin@mayar.com", "Admin", "$2a$11$XaUn0M3Eu/Xvn8SYXMbd3.dYv8JSpCeGUB0XbBR2o2TdeL9DSydLC", null, null, null, null, "Admin" });
        }
    }
}
