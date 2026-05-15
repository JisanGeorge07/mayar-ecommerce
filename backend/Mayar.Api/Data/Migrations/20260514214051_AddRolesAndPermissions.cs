using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddRolesAndPermissions : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("02e9071c-d1a2-43fc-a4f3-dab44084ea04"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("8150229a-919e-48f9-ac36-5087ce1991e5"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("dbaab5ed-1dc8-4df7-92fe-691543bf5982"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("de71732e-c0b9-4ca4-b58f-46d93a3844a9"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("d9edc079-1fdc-4ed4-965f-6f7d8e52c72c"));

            migrationBuilder.AddColumn<Guid>(
                name: "RoleId",
                table: "Users",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci");

            migrationBuilder.CreateTable(
                name: "Roles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Description = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Roles", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "RolePermissions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    RoleId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Path = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RolePermissions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_RolePermissions_Roles_RoleId",
                        column: x => x.RoleId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Roles",
                columns: new[] { "Id", "Description", "Name" },
                values: new object[,]
                {
                    { new Guid("28a73326-dc7e-4006-ab79-28838e94643e"), "Default role for customers.", "User" },
                    { new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545"), "Full access to all sections of the admin panel.", "Admin" }
                });

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("2d539fb2-28d7-4b1b-9886-b62b0c5e5256"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("3282c6f7-0a89-429b-bc0d-7ac81e9d51c0"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("908efd99-9c00-45c2-b74d-1fafcc23c917"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("d876e0fd-0c06-4e3c-b0ee-2a1f6cb55f79"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" }
                });

            migrationBuilder.InsertData(
                table: "RolePermissions",
                columns: new[] { "Id", "Path", "RoleId" },
                values: new object[,]
                {
                    { 1, "/dashboard", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 2, "/categories", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 3, "/subcategories", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 4, "/product-types", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 5, "/products", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 6, "/orders", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 7, "/hero-banners", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 8, "/shop-by-category", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 9, "/promo-banners", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 10, "/coupons", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 11, "/pages/about-us", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 12, "/pages/privacy-policy", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 13, "/pages/contact-us", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 14, "/pages/shipping-information", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 15, "/pages/returns-exchange", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 16, "/pages/terms-conditions", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 17, "/notifications", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 18, "/roles-permissions", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") },
                    { 19, "/settings", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PasswordResetToken", "PasswordResetTokenExpiry", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role", "RoleId" },
                values: new object[] { new Guid("54ac75ae-49f4-4ef6-8326-9d04f2ceb43a"), null, null, "admin@mayar.com", "Admin", "$2a$11$44aSXNe1sGAebgsT8YKwY.oG7vC/VbPnt5aH/NWLDV.3dd6J2MNA2", null, null, null, null, null, null, "Admin", new Guid("7ea3bb20-cbe8-4c5f-ae66-3caac30e3545") });

            migrationBuilder.CreateIndex(
                name: "IX_Users_RoleId",
                table: "Users",
                column: "RoleId");

            migrationBuilder.CreateIndex(
                name: "IX_RolePermissions_RoleId",
                table: "RolePermissions",
                column: "RoleId");

            migrationBuilder.AddForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users",
                column: "RoleId",
                principalTable: "Roles",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Users_Roles_RoleId",
                table: "Users");

            migrationBuilder.DropTable(
                name: "RolePermissions");

            migrationBuilder.DropTable(
                name: "Roles");

            migrationBuilder.DropIndex(
                name: "IX_Users_RoleId",
                table: "Users");

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("2d539fb2-28d7-4b1b-9886-b62b0c5e5256"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("3282c6f7-0a89-429b-bc0d-7ac81e9d51c0"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("908efd99-9c00-45c2-b74d-1fafcc23c917"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("d876e0fd-0c06-4e3c-b0ee-2a1f6cb55f79"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("54ac75ae-49f4-4ef6-8326-9d04f2ceb43a"));

            migrationBuilder.DropColumn(
                name: "RoleId",
                table: "Users");

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("02e9071c-d1a2-43fc-a4f3-dab44084ea04"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("8150229a-919e-48f9-ac36-5087ce1991e5"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("dbaab5ed-1dc8-4df7-92fe-691543bf5982"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("de71732e-c0b9-4ca4-b58f-46d93a3844a9"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PasswordResetToken", "PasswordResetTokenExpiry", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("d9edc079-1fdc-4ed4-965f-6f7d8e52c72c"), null, null, "admin@mayar.com", "Admin", "$2a$11$nbhg.F82q9aAkRLW5YV2m.fZ4mhhHUcvTlvnNLLSIVkQZ25SLo5Su", null, null, null, null, null, null, "Admin" });
        }
    }
}
