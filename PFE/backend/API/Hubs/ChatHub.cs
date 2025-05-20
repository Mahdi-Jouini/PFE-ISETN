using Domain.DTOs;
using Microsoft.AspNetCore.SignalR;
using System.Text.RegularExpressions;

namespace API.Hubs
{
    public class ChatHub : Hub
    {
        public async Task JoinProjectChat(string projectId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, projectId);
        }

        public async Task LeaveProjectChat(string projectId)
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, projectId);
        }

        public async Task SendMessage(MessageDTO message)
        {
            await Clients.Group(message.ProjectId).SendAsync("ReceiveMessage", message);
        }
    }

}
