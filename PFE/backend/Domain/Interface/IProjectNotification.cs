using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Models;
using Domain.Types;

namespace Domain.Interface
{
    public interface IProjectNotification
    {
        // Core notification methods
        Task SendProjectNotification(Notification notification);
        Task SendUserNotification(string userId, Notification notification);

        // Entity-specific notification methods
        Task SendSprintNotification(string sprintId, NotificationType type, string message, string actorId = null);
        Task SendTicketNotification(string ticketId, NotificationType type, string message, string actorId = null);
        Task SendInvitationNotification(Invitation invitation, string message, string actorId = null);
        Task SendMessageNotification(Message message);
    }
}
