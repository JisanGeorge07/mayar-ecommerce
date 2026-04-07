using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddBottomCategoryDisplayOrder : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("332b025d-bdeb-44c0-a5a4-3552fc03d360"));

            migrationBuilder.AddColumn<long>(
                name: "DisplayOrder",
                table: "BottomCategories",
                type: "bigint",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("aaee4f41-bfd0-47c7-82e6-56108cdafb7f"), null, null, "admin@mayar.com", "Admin", "$2a$11$FesHaNgI9a0Dde8Jg0fLVOvc11vHN7iCLjOhpmQbCumtyHl99HLsS", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("aaee4f41-bfd0-47c7-82e6-56108cdafb7f"));

            migrationBuilder.DropColumn(
                name: "DisplayOrder",
                table: "BottomCategories");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("332b025d-bdeb-44c0-a5a4-3552fc03d360"), null, null, "admin@mayar.com", "Admin", "$2a$11$h0dfo6Gk59mfOGdQQCrQM.MuXLCy2aPpmJxFSkYgCL/XcjCGTE9Me", null, null, null, null, "Admin" });
        }
    }
}
