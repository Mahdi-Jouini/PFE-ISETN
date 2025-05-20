using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class _0905v2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Taille",
                table: "FilesAttachments",
                newName: "Size");

            migrationBuilder.RenameColumn(
                name: "Nom",
                table: "FilesAttachments",
                newName: "originalName");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "originalName",
                table: "FilesAttachments",
                newName: "Nom");

            migrationBuilder.RenameColumn(
                name: "Size",
                table: "FilesAttachments",
                newName: "Taille");
        }
    }
}
