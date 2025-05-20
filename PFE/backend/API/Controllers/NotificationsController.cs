    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Security.Claims;
    using System.Threading.Tasks;
    using AutoMapper;
    using Domain.Commands;
    using Domain.DTOs;
    using Domain.Models;
    using Domain.Queries;
    using MediatR;
    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.EntityFrameworkCore;

    namespace API.Controllers
    {

        [Route("api/[controller]")]
        [ApiController]
        public class NotificationsController : ControllerBase
        {
            private readonly IMediator _mediator;
            private readonly IMapper _mapper;

            public NotificationsController(IMediator mediator, IMapper mapper)
            {
                _mediator = mediator;
                _mapper = mapper;
            }

            // Get all notifications for the current user
            [HttpGet("user")]
            public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetUserNotifications()
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var userNotifications = await _mediator.Send(new GetAllGeneric<UserNotification>(
                    un => un.UserId == userId,
                    query => query.Include(un => un.Notification)
                ));

                if (userNotifications == null || !userNotifications.Any())
                    return new List<NotificationDTO>();

                var notificationDtos = userNotifications
                    .OrderByDescending(un => un.Notification.Timestamp)
                    .Select(un => new NotificationDTO
                    {
                        Id = un.Notification.Id,
                        Type = un.Notification.Type,
                        ProjectId = un.Notification.ProjectId,
                        Message = un.Notification.NotificationMessage,
                        Timestamp = un.Notification.Timestamp,
                        IsRead = un.IsRead,
     
                    });

                return Ok(notificationDtos);
            }

            // Get notifications for a specific project
            [HttpGet("project/{projectId}")]
            public async Task<ActionResult<IEnumerable<NotificationDTO>>> GetProjectNotifications(string projectId)
            {
                string userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                // Check if user is a member of the project
                var member = await _mediator.Send(new GetByIDGeneric<Member>(
                    m => m.ProjectId == projectId && m.User.UserId == userId
                ));

                if (member == null)
                    return Forbid();

                var userNotifications = await _mediator.Send(new GetAllGeneric<UserNotification>(
                    un => un.UserId == userId && un.Notification.ProjectId == projectId,
                    query => query.Include(un => un.Notification)
                ));

                if (userNotifications == null || !userNotifications.Any())
                    return new List<NotificationDTO>();

                var notificationDtos = userNotifications
                    .OrderByDescending(un => un.Notification.Timestamp)
                    .Select(un => new NotificationDTO
                    {
                        Id = un.Notification.Id,
                        Type = un.Notification.Type,
                        ProjectId = un.Notification.ProjectId,
                        Message = un.Notification.NotificationMessage,
                        Timestamp = un.Notification.Timestamp,
                        IsRead = un.IsRead,
                    });

                return Ok(notificationDtos);
            }

            // Mark a notification as read
            [HttpPut("markAsRead/{notificationId}")]
            public async Task<IActionResult> MarkAsRead(string notificationId)
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var userNotification = await _mediator.Send(new GetByIDGeneric<UserNotification>(
                    un => un.NotificationId == notificationId && un.UserId == userId
                ));

                if (userNotification == null)
                    return NotFound("Notification not found");

                if (!userNotification.IsRead)
                {
                    userNotification.IsRead = true;
                    userNotification.ReadAt = DateTime.Now;
                    await _mediator.Send(new PutGeneric<UserNotification>(userNotification));
                }

                return Ok();
            }

            // Mark all notifications as read
            [HttpPut("markAllAsRead")]
            public async Task<IActionResult> MarkAllAsRead()
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var userNotifications = await _mediator.Send(new GetAllGeneric<UserNotification>(
                    un => un.UserId == userId && !un.IsRead
                ));

                if (userNotifications != null && userNotifications.Any())
                {
                    foreach (var notification in userNotifications)
                    {
                        notification.IsRead = true;
                        notification.ReadAt = DateTime.Now;
                        await _mediator.Send(new PutGeneric<UserNotification>(notification));
                    }
                }

                return Ok();
            }

            // Delete a notification
            [HttpDelete("{notificationId}")]
            public async Task<IActionResult> DeleteNotification(string notificationId)
            {
                string userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                if (string.IsNullOrEmpty(userId))
                    return Unauthorized();

                var userNotification = await _mediator.Send(new GetByIDGeneric<UserNotification>(
                    un => un.NotificationId == notificationId && un.UserId == userId
                ));

                if (userNotification == null)
                    return NotFound("Notification not found");

                // Delete the user notification linking
                await _mediator.Send(new DeleteGeneric<UserNotification>(userNotification.Id));

                return Ok();
            }
        }   
    }