using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class MakeWishlistVariantNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("4f8ae8b5-58de-492b-ae5b-743623a1f6b7"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("6810b87a-0fe0-4015-a0ad-815a3df1da6f"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("b539bf56-c62c-4b6e-a057-8c1d250a9264"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("fa29959c-d06c-437c-a9c7-a982fe2cd94b"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("85f53787-321e-4c4c-9ace-361784ca2358"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductVariantId",
                table: "Wishlists",
                type: "char(36)",
                nullable: true,
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)")
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("101d5131-ecd0-486a-9e9f-1f140b899996"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" },
                    { new Guid("21fd6de7-c305-46f6-877b-63571b2fd1e1"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("6b7005e5-82d9-4606-ae45-6df398cfaec0"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("89976ab8-06b5-4896-9bad-d87c6e33b3d3"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("06c6fc6a-79d8-4e16-b3e9-d217d0c808bf"), null, null, "admin@mayar.com", "Admin", "$2a$11$6AwNZEtUwz.ru08mNd6KruWVzk1597LgJa8hxvjzpPY2imcQae52.", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("101d5131-ecd0-486a-9e9f-1f140b899996"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("21fd6de7-c305-46f6-877b-63571b2fd1e1"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("6b7005e5-82d9-4606-ae45-6df398cfaec0"));

            migrationBuilder.DeleteData(
                table: "TrustBadges",
                keyColumn: "Id",
                keyValue: new Guid("89976ab8-06b5-4896-9bad-d87c6e33b3d3"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("06c6fc6a-79d8-4e16-b3e9-d217d0c808bf"));

            migrationBuilder.AlterColumn<Guid>(
                name: "ProductVariantId",
                table: "Wishlists",
                type: "char(36)",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"),
                collation: "ascii_general_ci",
                oldClrType: typeof(Guid),
                oldType: "char(36)",
                oldNullable: true)
                .OldAnnotation("Relational:Collation", "ascii_general_ci");

            migrationBuilder.InsertData(
                table: "TrustBadges",
                columns: new[] { "Id", "DescriptionArabic", "DescriptionEnglish", "IconName", "Key", "LabelArabic", "LabelEnglish" },
                values: new object[,]
                {
                    { new Guid("4f8ae8b5-58de-492b-ae5b-743623a1f6b7"), "100% أصلي", "100% genuine", "CheckCircle", "authentic", "منتجات أصلية", "Authentic Products" },
                    { new Guid("6810b87a-0fe0-4015-a0ad-815a3df1da6f"), "الدفع المشفر", "Encrypted checkout", "Shield", "secure_payment", "دفع آمن", "Secure Payment" },
                    { new Guid("b539bf56-c62c-4b6e-a057-8c1d250a9264"), "على الطلبات التي تزيد عن 10 دنانير كويتية", "On orders over 10 KWD", "Truck", "free_delivery", "توصيل مجاني", "Free Delivery" },
                    { new Guid("fa29959c-d06c-437c-a9c7-a982fe2cd94b"), "سياسة إرجاع لمدة 14 يومًا", "14 day return policy", "RotateCcw", "easy_returns", "إرجاع سهل", "Easy Returns" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("85f53787-321e-4c4c-9ace-361784ca2358"), null, null, "admin@mayar.com", "Admin", "$2a$11$MSnre6LL.uFIEseKkb8.CuXoCOlVbb/TwTrqNXRSMBvM1rqaA7joW", null, null, null, null, "Admin" });
        }
    }
}
