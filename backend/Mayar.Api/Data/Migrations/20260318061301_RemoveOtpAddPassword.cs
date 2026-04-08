using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mayar.Api.Data.Migrations
{
    /// <inheritdoc />
    public partial class RemoveOtpAddPassword : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // All changes already applied to live database - migration is now a no-op
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Rollback not supported for already-applied changes
        }
    }
}
