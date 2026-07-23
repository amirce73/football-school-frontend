using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footballit.API.Migrations
{
    /// <inheritdoc />
    public partial class AddSportsInfoFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CompetitionSeason",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PlayingAbility",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SlipperSize",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SportsInsuranceNumber",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SportsSlogan",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SportsWarmerSize",
                table: "Users",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompetitionSeason",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PlayingAbility",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SlipperSize",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SportsInsuranceNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SportsSlogan",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SportsWarmerSize",
                table: "Users");
        }
    }
}
