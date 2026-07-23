using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footballit.API.Migrations
{
    /// <inheritdoc />
    public partial class AddBirthCertificateNo : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BirthCertificateNo",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BirthCertificateNo",
                table: "Users");
        }
    }
}
