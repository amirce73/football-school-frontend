using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footballit.API.Migrations
{
    /// <inheritdoc />
    public partial class AddNewSocialNetworks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Eitaa",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Rubika",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Whatsapp",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eitaa",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Rubika",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Whatsapp",
                table: "Users");
        }
    }
}
