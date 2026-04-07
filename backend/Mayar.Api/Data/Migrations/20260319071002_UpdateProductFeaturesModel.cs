using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateProductFeaturesModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ImageAlt",
                table: "ProductFeatures");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "ProductFeatures",
                newName: "IconName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IconName",
                table: "ProductFeatures",
                newName: "ImageUrl");

            migrationBuilder.AddColumn<string>(
                name: "ImageAlt",
                table: "ProductFeatures",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");
        }
    }
}
