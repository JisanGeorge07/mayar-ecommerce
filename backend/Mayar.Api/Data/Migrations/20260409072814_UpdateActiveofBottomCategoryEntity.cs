using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateActiveofBottomCategoryEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("dd5da29b-9d6a-46bd-a5dd-475d7831e814"));

            migrationBuilder.AddColumn<string>(
                name: "AttributeTemplate",
                table: "BottomCategories",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "BottomCategories",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("4be4abd5-7c8e-4633-8844-8792126df420"), null, null, "admin@mayar.com", "Admin", "$2a$11$t4Z.vKNnjZOYfwU/u6cu.uHU5RI.ySYUnDwgIg4SdZcIFnZDELjXe", null, null, null, null, "Admin" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("4be4abd5-7c8e-4633-8844-8792126df420"));

            migrationBuilder.DropColumn(
                name: "AttributeTemplate",
                table: "BottomCategories");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "BottomCategories");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("dd5da29b-9d6a-46bd-a5dd-475d7831e814"), null, null, "admin@mayar.com", "Admin", "$2a$11$y8InAKf2eGg73lftdo3Fren4Ov1pbkaeCJaItlRVLr9BjIzUFUjgy", null, null, null, null, "Admin" });
        }
    }
}
