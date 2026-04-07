using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class UpdateAboutEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2237d2b8-55e7-4f1e-b68c-140463afff05"));

            migrationBuilder.DropColumn(
                name: "DescriptionArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "DescriptionEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "SectionSubtitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "SectionSubtitleEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "SectionTitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "SectionTitleEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "TitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "TitleEnglish",
                table: "About");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "VisionTitleEnglish",
                keyValue: null,
                column: "VisionTitleEnglish",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "VisionTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "VisionTitleArabic",
                keyValue: null,
                column: "VisionTitleArabic",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "VisionTitleArabic",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "VisionDescriptionEnglish",
                keyValue: null,
                column: "VisionDescriptionEnglish",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "VisionDescriptionEnglish",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "VisionDescriptionArabic",
                keyValue: null,
                column: "VisionDescriptionArabic",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "VisionDescriptionArabic",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "MissionTitleEnglish",
                keyValue: null,
                column: "MissionTitleEnglish",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MissionTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "MissionTitleArabic",
                keyValue: null,
                column: "MissionTitleArabic",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MissionTitleArabic",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "MissionDescriptionEnglish",
                keyValue: null,
                column: "MissionDescriptionEnglish",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MissionDescriptionEnglish",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "About",
                keyColumn: "MissionDescriptionArabic",
                keyValue: null,
                column: "MissionDescriptionArabic",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "MissionDescriptionArabic",
                table: "About",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroBgColor",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroSubtitleArabic",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroSubtitleEnglish",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroTitleArabic",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HeroTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaDescriptionArabic",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaDescriptionEnglish",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitleArabic",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MetaTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "MissionIcon",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "About",
                type: "datetime(6)",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "VisionIcon",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "WhoWeAreTitleArabic",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "WhoWeAreTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: false)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AboutContactItems",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    AboutId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Icon = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LabelEnglish = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LabelArabic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActionType = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ActionValue = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutContactItems", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutContactItems_About_AboutId",
                        column: x => x.AboutId,
                        principalTable: "About",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AboutParagraphs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    AboutId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ContentEnglish = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ContentArabic = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AboutParagraphs", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AboutParagraphs_About_AboutId",
                        column: x => x.AboutId,
                        principalTable: "About",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("2f7e371d-e74a-4c56-a886-45d2ae9dbf13"), null, null, "admin@mayar.com", "Admin", "$2a$11$uQWL38qWg21lcPsTAtqasOWRaptnF5o4TAh9S/A6Ha4Gmsj.7lVIq", null, null, null, null, "Admin" });

            migrationBuilder.CreateIndex(
                name: "IX_AboutContactItems_AboutId",
                table: "AboutContactItems",
                column: "AboutId");

            migrationBuilder.CreateIndex(
                name: "IX_AboutParagraphs_AboutId",
                table: "AboutParagraphs",
                column: "AboutId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AboutContactItems");

            migrationBuilder.DropTable(
                name: "AboutParagraphs");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2f7e371d-e74a-4c56-a886-45d2ae9dbf13"));

            migrationBuilder.DropColumn(
                name: "HeroBgColor",
                table: "About");

            migrationBuilder.DropColumn(
                name: "HeroSubtitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "HeroSubtitleEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "HeroTitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "HeroTitleEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "MetaDescriptionArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "MetaDescriptionEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "MetaTitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "MetaTitleEnglish",
                table: "About");

            migrationBuilder.DropColumn(
                name: "MissionIcon",
                table: "About");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "About");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "About");

            migrationBuilder.DropColumn(
                name: "VisionIcon",
                table: "About");

            migrationBuilder.DropColumn(
                name: "WhoWeAreTitleArabic",
                table: "About");

            migrationBuilder.DropColumn(
                name: "WhoWeAreTitleEnglish",
                table: "About");

            migrationBuilder.AlterColumn<string>(
                name: "VisionTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "VisionTitleArabic",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "VisionDescriptionEnglish",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "VisionDescriptionArabic",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MissionTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MissionTitleArabic",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MissionDescriptionEnglish",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AlterColumn<string>(
                name: "MissionDescriptionArabic",
                table: "About",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionArabic",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "DescriptionEnglish",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionSubtitleArabic",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionSubtitleEnglish",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionTitleArabic",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "SectionTitleEnglish",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TitleArabic",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TitleEnglish",
                table: "About",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Address", "Country", "Email", "Name", "PasswordHash", "PhoneNumber", "PinCode", "RefreshToken", "RefreshTokenExpiryTime", "Role" },
                values: new object[] { new Guid("2237d2b8-55e7-4f1e-b68c-140463afff05"), null, null, "admin@mayar.com", "Admin", "$2a$11$Pfxq.bVH/W/gQlfTn91y7.MErkBjzGpDrIYHK.L2Kbl0xRSbpPpHW", null, null, null, null, "Admin" });
        }
    }
}
