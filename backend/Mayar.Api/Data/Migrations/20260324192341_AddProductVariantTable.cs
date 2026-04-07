using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductVariantTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("fb1ed42b-66ec-4be1-a394-fbb390888c13"));

            migrationBuilder.CreateTable(
                name: "ProductVariants",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ProductColorId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ProductSizeId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    BasePriceKWD = table.Column<decimal>(type: "decimal(18,3)", nullable: true),
                    CompareAtPriceKWD = table.Column<decimal>(type: "decimal(18,3)", nullable: true),
                    BasePriceINR = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    CompareAtPriceINR = table.Column<decimal>(type: "decimal(18,0)", nullable: true),
                    StockQuantity = table.Column<int>(type: "int", nullable: true),
                    InStock = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsDefault = table.Column<bool>(type: "tinyint(1)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductVariants", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductVariants_ProductColors_ProductColorId",
                        column: x => x.ProductColorId,
                        principalTable: "ProductColors",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductVariants_ProductSizes_ProductSizeId",
                        column: x => x.ProductSizeId,
                        principalTable: "ProductSizes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProductVariants_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("7fe923de-cd05-4460-9300-a27696f34d42"), null, null, "admin@mayar.com", "Admin", "$2a$11$iXKcoCu.dFeOlRed/.3AJ.8PXrAq5WGsxWpCU.EbAvPxmmFUixKXS", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariants_ProductColorId",
                table: "ProductVariants",
                column: "ProductColorId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariants_ProductId_ProductColorId_ProductSizeId",
                table: "ProductVariants",
                columns: new[] { "ProductId", "ProductColorId", "ProductSizeId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ProductVariants_ProductSizeId",
                table: "ProductVariants",
                column: "ProductSizeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ProductVariants");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("7fe923de-cd05-4460-9300-a27696f34d42"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("fb1ed42b-66ec-4be1-a394-fbb390888c13"), null, null, "admin@mayar.com", "Admin", "$2a$11$jNSNxhuGVOOjH7CUJ2QwF.lQrAwsNZ3bZZuisL.HRUs9WDusDS8b6", null, null, null, null, "Admin" });
        }
    }
}
