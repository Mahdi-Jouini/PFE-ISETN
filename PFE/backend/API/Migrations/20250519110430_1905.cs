using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class _1905 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "Message",
                table: "Notifications",
                newName: "NotificationMessage");

            migrationBuilder.AlterColumn<string>(
                name: "ProjectId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddColumn<string>(
                name: "ActorId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "InvitationId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "MessageId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "SprintId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TicketId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Invitation",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ReceiverId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProjectId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    Role = table.Column<int>(type: "int", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Invitation", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Invitation_Projects_ProjectId",
                        column: x => x.ProjectId,
                        principalTable: "Projects",
                        principalColumn: "ProjectId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Invitation_Users_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_ActorId",
                table: "Notifications",
                column: "ActorId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_InvitationId",
                table: "Notifications",
                column: "InvitationId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_MessageId",
                table: "Notifications",
                column: "MessageId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_SprintId",
                table: "Notifications",
                column: "SprintId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_TicketId",
                table: "Notifications",
                column: "TicketId");

            migrationBuilder.CreateIndex(
                name: "IX_Invitation_ProjectId",
                table: "Invitation",
                column: "ProjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Invitation_ReceiverId",
                table: "Invitation",
                column: "ReceiverId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Invitation_InvitationId",
                table: "Notifications",
                column: "InvitationId",
                principalTable: "Invitation",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Messages_MessageId",
                table: "Notifications",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "MessageId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Sprints_SprintId",
                table: "Notifications",
                column: "SprintId",
                principalTable: "Sprints",
                principalColumn: "SprintId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Tickets_TicketId",
                table: "Notifications",
                column: "TicketId",
                principalTable: "Tickets",
                principalColumn: "TicketId");

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Users_ActorId",
                table: "Notifications",
                column: "ActorId",
                principalTable: "Users",
                principalColumn: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Invitation_InvitationId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Messages_MessageId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Sprints_SprintId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Tickets_TicketId",
                table: "Notifications");

            migrationBuilder.DropForeignKey(
                name: "FK_Notifications_Users_ActorId",
                table: "Notifications");

            migrationBuilder.DropTable(
                name: "Invitation");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_ActorId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_InvitationId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_MessageId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_SprintId",
                table: "Notifications");

            migrationBuilder.DropIndex(
                name: "IX_Notifications_TicketId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "ActorId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "InvitationId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "MessageId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "SprintId",
                table: "Notifications");

            migrationBuilder.DropColumn(
                name: "TicketId",
                table: "Notifications");

            migrationBuilder.RenameColumn(
                name: "NotificationMessage",
                table: "Notifications",
                newName: "Message");

            migrationBuilder.AlterColumn<string>(
                name: "ProjectId",
                table: "Notifications",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(450)",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Notifications_Projects_ProjectId",
                table: "Notifications",
                column: "ProjectId",
                principalTable: "Projects",
                principalColumn: "ProjectId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
