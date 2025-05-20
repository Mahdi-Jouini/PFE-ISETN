using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Types;

namespace Domain.Models
{
    public class Notification
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        public NotificationType Type { get; set; }

        // Nullable FKs for different entity types
        public string? ProjectId { get; set; }
        public string? SprintId { get; set; }
        public string? TicketId { get; set; }
        public string? InvitationId { get; set; }
        public string? MessageId { get; set; }

        // For the actor who caused the notification (optional)
        public string? ActorId { get; set; }

        // Navigation properties
        [ForeignKey("ProjectId")]
        public virtual Project? Project { get; set; }

        [ForeignKey("SprintId")]
        public virtual Sprint? Sprint { get; set; }

        [ForeignKey("TicketId")]
        public virtual Ticket? Ticket { get; set; }

        [ForeignKey("InvitationId")]
        public virtual Invitation? Invitation { get; set; }

        [ForeignKey("MessageId")]
        public virtual Message? Message { get; set; }

        [ForeignKey("ActorId")]
        public virtual User? Actor { get; set; }

        public string NotificationMessage { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;

        // Recipients tracking
        public virtual ICollection<UserNotification> UserNotifications { get; set; }
    }
}