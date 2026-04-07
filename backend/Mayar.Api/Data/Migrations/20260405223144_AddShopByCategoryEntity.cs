using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddShopByCategoryEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("250d8861-ab70-47b8-b916-d1ff82c61c41"));

            migrationBuilder.CreateTable(
                name: "ShopByCategories",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    InternalName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TitleEnglish = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    TitleArabic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ImageUrl = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AltText = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LinkType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CategoryId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    SubcategoryId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ProductTypeId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    ProductId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CustomUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    IsActive = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsPublished = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ShopByCategories", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ShopByCategories_BottomCategories_ProductTypeId",
                        column: x => x.ProductTypeId,
                        principalTable: "BottomCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ShopByCategories_MiddleCategories_SubcategoryId",
                        column: x => x.SubcategoryId,
                        principalTable: "MiddleCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ShopByCategories_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_ShopByCategories_TopCategories_CategoryId",
                        column: x => x.CategoryId,
                        principalTable: "TopCategories",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("39cb0229-3c80-421f-8c4e-485aa30b49b2"), null, null, "admin@mayar.com", "Admin", "$2a$11$kO2cBqHCMCeEXkCeroqCOeFPoA3GImyW6Q3EP1qK6b61fY5GDUBzi", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_ShopByCategories_CategoryId",
                table: "ShopByCategories",
                column: "CategoryId");

            migrationBuilder.CreateIndex(
                name: "IX_ShopByCategories_ProductId",
                table: "ShopByCategories",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_ShopByCategories_ProductTypeId",
                table: "ShopByCategories",
                column: "ProductTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_ShopByCategories_SubcategoryId",
                table: "ShopByCategories",
                column: "SubcategoryId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ShopByCategories");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("39cb0229-3c80-421f-8c4e-485aa30b49b2"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("250d8861-ab70-47b8-b916-d1ff82c61c41"), null, null, "admin@mayar.com", "Admin", "$2a$11$TlVTzoceis6pxV/pKAa02efM.6HT6mlZ/M/lm6wduQuI4fOsQaJum", null, null, null, null, "Admin" });
        }
    }
}
