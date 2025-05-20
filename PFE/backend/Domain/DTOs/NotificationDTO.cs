using System;
using Domain.Types;

namespace Domain.DTOs
{
    public class NotificationDTO
    {
        public string Id { get; set; }
        public NotificationType Type { get; set; }

        // Source entity IDs
        public string? ProjectId { get; set; }
        public string? SprintId { get; set; }
        public string? TicketId { get; set; }
        public string? InvitationId { get; set; }
        public string? MessageId { get; set; }

        // Actor information
        public string? ActorId { get; set; }
        public string? ActorName { get; set; }

        // Navigation properties are not included in DTOs, only relevant metadata
        public string? ProjectName { get; set; }
        public string? SprintName { get; set; }
        public string? TicketTitle { get; set; }

        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
        public bool IsRead { get; set; }
    }
}