using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddSettingsEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2e31b0eb-8c8f-40e6-9bcb-7b4a9cae55aa"));

            migrationBuilder.CreateTable(
                name: "CheckoutCountries",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CountryName = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CountryCode = table.Column<string>(type: "varchar(255)", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsEnabled = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsDefault = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckoutCountries", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "FeatureSettings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    EnableEnglish = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableArabic = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableKwd = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableInr = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableWishlist = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableReviews = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableOrderTracking = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableNewsletter = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableMyAccount = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    EnableGuestCheckout = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    BrandName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Tagline = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LogoUrl = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DefaultMetaTitle = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    DefaultMetaDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeatureSettings", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "CheckoutAddressFields",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CountryId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    FieldKey = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FieldLabel = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FieldLabelArabic = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    IsVisible = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    IsRequired = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CheckoutAddressFields", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CheckoutAddressFields_CheckoutCountries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "CheckoutCountries",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("c524ffaf-b709-4765-994b-9cf1c7f26d3d"), null, null, "admin@mayar.com", "Admin", "$2a$11$o2gAXj1NY2MIb9tecOx7e.wfNLQK/rclYaQIDH984/aa0dwasqgUq", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_CheckoutAddressFields_CountryId",
                table: "CheckoutAddressFields",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_CheckoutCountries_CountryCode",
                table: "CheckoutCountries",
                column: "CountryCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CheckoutAddressFields");

            migrationBuilder.DropTable(
                name: "FeatureSettings");

            migrationBuilder.DropTable(
                name: "CheckoutCountries");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("c524ffaf-b709-4765-994b-9cf1c7f26d3d"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("2e31b0eb-8c8f-40e6-9bcb-7b4a9cae55aa"), null, null, "admin@mayar.com", "Admin", "$2a$11$kdEBOGj/GaLPGhBE.eDeHuII.Sg8KPouojvD34lruPQvae4QCSl.W", null, null, null, null, "Admin" });
        }
    }
}
