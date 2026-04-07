using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAdminPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("673ac89e-fa3a-4ad8-aaf8-eaaf4946d398"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("90440b76-da46-4445-9797-1193a14035e3"), null, null, "admin@mayar.com", "Admin", "$2a$11$nop3EZNu.BjNSpPu2pIq9ugYlWzVqBah1rDAV3P7u6X6ciBIdIX42", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("90440b76-da46-4445-9797-1193a14035e3"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("673ac89e-fa3a-4ad8-aaf8-eaaf4946d398"), null, null, "admin@mayar.com", "Admin", "$2a$11$us40prsnz8kLdAQabwlghe4.Yf2TkLsti8FxQcyvipZ240tuyMLXm", null, null, null, null, "Admin" });
        }
    }
}
