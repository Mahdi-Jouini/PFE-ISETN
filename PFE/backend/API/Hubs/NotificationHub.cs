using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace API.Hubs
{
    public class NotificationHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }
        public async Task JoinProjectNotifications(string projectId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"project-notifications-{projectId}");
        }
        public async Task LeaveProjectNotifications(string projectId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"project-notifications-{projectId}");
        }
        public async Task JoinSprintNotifications(string sprintId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"sprint-notifications-{sprintId}");
        }
        public async Task LeaveSprintNotifications(string sprintId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"sprint-notifications-{sprintId}");
        }

        public async Task MarkNotificationAsRead(string notificationId)
        {
            await Clients.Caller.SendAsync("NotificationMarkedAsRead", notificationId);
        }
    }
}