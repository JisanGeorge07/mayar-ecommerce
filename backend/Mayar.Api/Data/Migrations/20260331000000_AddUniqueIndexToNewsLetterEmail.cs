using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUniqueIndexToNewsLetterEmail : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f674f78e-8428-43f6-907e-830c86747b9a"));

            migrationBuilder.CreateIndex(
                name: "IX_NewsLetters_Email",
                table: "NewsLetters",
                column: "Email",
                unique: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"), null, null, "admin@mayar.com", "Admin", "$2a$11$aN4rYpIlPx55oeAwrgSfX.X0YYdczBJZR5VAboqV4C50aQ3DDdttq", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("a1b2c3d4-e5f6-7890-abcd-ef1234567890"));

            migrationBuilder.DropIndex(
                name: "IX_NewsLetters_Email",
                table: "NewsLetters");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("f674f78e-8428-43f6-907e-830c86747b9a"), null, null, "admin@mayar.com", "Admin", "$2a$11$aN4rYpIlPx55oeAwrgSfX.X0YYdczBJZR5VAboqV4C50aQ3DDdttq", null, null, null, null, "Admin" });
        }
    }
}
