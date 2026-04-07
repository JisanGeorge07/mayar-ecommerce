using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddProductSlugToWishlist : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("ef357d16-2107-46c6-adb8-b4814c02331d"));

            migrationBuilder.AddColumn<string>(
                name: "ProductSlug",
                table: "Wishlists",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("6e7e0099-298d-4df0-9a74-ae5bcc34be68"), null, null, "admin@mayar.com", "Admin", "$2a$11$bBmPojUPscNx2fcqTNY/Eu8dg.zADYi2xruKwsOILlk2FqQeCoh12", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("6e7e0099-298d-4df0-9a74-ae5bcc34be68"));

            migrationBuilder.DropColumn(
                name: "ProductSlug",
                table: "Wishlists");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("ef357d16-2107-46c6-adb8-b4814c02331d"), null, null, "admin@mayar.com", "Admin", "$2a$11$E6A6jge0tbhAb8jmQd6jS.HapfpWltAd.3Hbvh9KaQ90YaaK/mcGu", null, null, null, null, "Admin" });
        }
    }
}
