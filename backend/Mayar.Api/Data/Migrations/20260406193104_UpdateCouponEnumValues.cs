using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateCouponEnumValues : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("77a8590f-94d2-4eff-aea2-4c9d4a12c34a"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("2e31b0eb-8c8f-40e6-9bcb-7b4a9cae55aa"), null, null, "admin@mayar.com", "Admin", "$2a$11$kdEBOGj/GaLPGhBE.eDeHuII.Sg8KPouojvD34lruPQvae4QCSl.W", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2e31b0eb-8c8f-40e6-9bcb-7b4a9cae55aa"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("77a8590f-94d2-4eff-aea2-4c9d4a12c34a"), null, null, "admin@mayar.com", "Admin", "$2a$11$z3Y6x8XLs5JNWko55l0zbecn/gaMvcfmSmvpaanf3Im0/lK3orrca", null, null, null, null, "Admin" });
        }
    }
}
