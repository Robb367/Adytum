using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Adytum.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCustomBookCopyFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CustomAuthor",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomCoverImageUrl",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomDescription",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomGenre",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomPages",
                table: "BookCopies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CustomPublicationYear",
                table: "BookCopies",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomPublisher",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomTitle",
                table: "BookCopies",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CustomAuthor",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomCoverImageUrl",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomDescription",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomGenre",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomPages",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomPublicationYear",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomPublisher",
                table: "BookCopies");

            migrationBuilder.DropColumn(
                name: "CustomTitle",
                table: "BookCopies");
        }
    }
}
