using API.Hubs;
using AutoMapper;
using Domain.Commands;
using Domain.DTOs;
using Domain.Interface;
using Domain.Models;
using Domain.Queries;
using Domain.Types;
using MediatR;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace API.Services
{
    public class NotificationService : IProjectNotification
    {
        private readonly IHubContext<NotificationHub> _hubContext;
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public NotificationService(
            IHubContext<NotificationHub> hubContext,
            IMediator mediator,
            IMapper mapper)
        {
            _hubContext = hubContext;
            _mediator = mediator;
            _mapper = mapper;
        }

        // For notifications to all project members
        public async Task SendProjectNotification(Notification notification)
        {
            // Save the base notification
            await _mediator.Send(new PostGeneric<Notification>(notification));

            // Get all users in the project
            var members = await _mediator.Send(new GetAllGeneric<Member>(
                m => m.ProjectId == notification.ProjectId,
                query => query.Include(m => m.User)
            ));

            foreach (var member in members)
            {
                // Track read status
                await _mediator.Send(new PostGeneric<UserNotification>(
                    new UserNotification
                    {
                        UserId = member.User.UserId,
                        NotificationId = notification.Id,
                        IsRead = false
                    }
                ));

                // Push notification to user in real-time
                var notificationDto = _mapper.Map<NotificationDTO>(notification);
                await _hubContext.Clients.User(member.User.UserId)
                    .SendAsync("ReceiveNotification", notificationDto);
            }
        }

        // For notifications to specific users
        public async Task SendUserNotification(string userId, Notification notification)
        {
            // Save the base notification
            await _mediator.Send(new PostGeneric<Notification>(notification));

            // Track read status for the specific user
            var userNotification = new UserNotification
            {
                UserId = userId,
                NotificationId = notification.Id,
                IsRead = false
            };
            await _mediator.Send(new PostGeneric<UserNotification>(userNotification));

            // Send real-time notification to the specific user
            var notificationDto = _mapper.Map<NotificationDTO>(notification);
            await _hubContext.Clients.User(userId).SendAsync("ReceiveNotification", notificationDto);
        }

        // New method for sprint-related notifications
        public async Task SendSprintNotification(string sprintId, NotificationType type, string message, string actorId = null)
        {
            // Get sprint info to find project
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId  == sprintId));

            if (sprint == null)
                return;

            var notification = new Notification
            {
                Type = type,
                SprintId = sprintId,
                ProjectId = sprint.ProjectId,
                NotificationMessage = message,
                ActorId = actorId,
                Timestamp = DateTime.Now
            };

            await SendProjectNotification(notification);
        }

        // New method for ticket-related notifications
        public async Task SendTicketNotification(string ticketId, NotificationType type, string message, string actorId = null)
        {
            // Get ticket info to find project
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(
                t => t.TicketId == ticketId,
                query => query.Include(t => t.Sprint.ProjectId)));

            if (ticket == null)
                return;

            var notification = new Notification
            {
                Type = type,
                TicketId = ticketId,
                ProjectId = ticket.Sprint.ProjectId,
                SprintId = ticket.SprintId,
                NotificationMessage = message,
                ActorId = actorId,
                Timestamp = DateTime.Now
            };

            await SendProjectNotification(notification);
        }

        // New method for invitation notifications
        public async Task SendInvitationNotification(Invitation invitation, string message, string actorId = null)
        {
            var notification = new Notification
            {
                Type = NotificationType.MemberInvited,
                InvitationId = invitation.Id,
                ProjectId = invitation.ProjectId,
                NotificationMessage = message,
                ActorId = actorId,
                Timestamp = DateTime.Now
            };

            await SendUserNotification(invitation.ReceiverId, notification);
        }

        // New method for message notifications
        public async Task SendMessageNotification(Message message)
        {
            var notification = new Notification
            {
                Type = NotificationType.MessageReceived,
                MessageId = message.MessageId,
                ProjectId = message.ProjectId,
                NotificationMessage = $"New message from {message.Sender.FirstName} {message.Sender.LastName}: {TruncateMessage(message.Content)}",
                ActorId = message.SenderId,
                Timestamp = DateTime.Now
            };

            await SendProjectNotification(notification);
        }

        private string TruncateMessage(string message, int maxLength = 50)
        {
            if (string.IsNullOrEmpty(message) || message.Length <= maxLength)
                return message;

            return message.Substring(0, maxLength - 3) + "...";
        }
    }
}