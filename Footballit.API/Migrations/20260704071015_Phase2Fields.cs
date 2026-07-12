using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Footballit.API.Migrations
{
    /// <inheritdoc />
    public partial class Phase2Fields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "BackpackAgeGroup",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BackpackSport",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BackpackTopic",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BackpackTrainingType",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "BirthCertificatePath",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentClass",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentTerm",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NationalCardPath",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PassportExpiryDate",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "PassportIssueDate",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PassportNumber",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PersonalPhotoPath",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "RpeIndex",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShirtSize",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ShoeSize",
                table: "Users",
                type: "INTEGER",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ShortsSize",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SleepQuality",
                table: "Users",
                type: "INTEGER",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BackpackAgeGroup",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BackpackSport",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BackpackTopic",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BackpackTrainingType",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "BirthCertificatePath",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CurrentClass",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "CurrentTerm",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "NationalCardPath",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PassportExpiryDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PassportIssueDate",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PassportNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "PersonalPhotoPath",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "RpeIndex",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShirtSize",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShoeSize",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "ShortsSize",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "SleepQuality",
                table: "Users");
        }
    }
}
