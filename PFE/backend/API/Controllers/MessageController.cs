using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Domain.Commands;
using Domain.DTOs;
using Domain.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.SignalR;
using API.Hubs;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessageController(IMediator mediator, IMapper mapper, IHubContext<ChatHub> hubContext)
        {
            _mediator = mediator;
            _mapper = mapper;
            _hubContext = hubContext;
        }

        [HttpGet("getProjectMessages")]
        public async Task<ActionResult<IEnumerable<MessageDTO>>> GetProjectMessages(string projectId)
        {
            var messages = await _mediator.Send(new GetAllGeneric<Message>(
                condition: m => m.ProjectId == projectId,
                includes: q => q.Include(m => m.Sender)
            ));

            if (messages == null || !messages.Any())
                return Ok(new List<MessageDTO>());

            var messageDtos = _mapper.Map<List<MessageDTO>>(messages);
            foreach (var msg in messageDtos)
            {
                var sender = messages.FirstOrDefault(m => m.MessageId == msg.MessageId)?.Sender;
                if (sender != null)
                {
                    msg.SenderName = $"{sender.FirstName} {sender.LastName}";
                    msg.SenderAvatar = sender.Avatar;
                }
            }

            return Ok(messageDtos.OrderBy(m => m.SentAt).ToList());
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] MessageDTO messageDTO)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            messageDTO.SenderId = userId;
            messageDTO.SentAt = DateTime.UtcNow;
            var message = _mapper.Map<Message>(messageDTO);
            var result = await _mediator.Send(new PostGeneric<Message>(message));
            var completeMessage = await _mediator.Send(new GetByIDGeneric<Message>(
                condition: m => m.MessageId == message.MessageId,
                includes: q => q.Include(m => m.Sender)
            ));
            var completeMessageDto = _mapper.Map<MessageDTO>(completeMessage);
            completeMessageDto.SenderName = $"{completeMessage.Sender.FirstName} {completeMessage.Sender.LastName}";
            completeMessageDto.SenderAvatar = completeMessage.Sender.Avatar;
            await _hubContext.Clients.Group(message.ProjectId)
                .SendAsync("ReceiveMessage", completeMessageDto);
            return Ok(completeMessageDto);
        }

        [HttpDelete("deleteMessage")]
        public async Task<IActionResult> DeleteMessage(string messageId)
        {
            var message = await _mediator.Send(new GetByIDGeneric<Message>(
                condition: m => m.MessageId == messageId
            ));
            if (message == null)
                return NotFound("Message not found");
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (message.SenderId != userId)
            {
                return Unauthorized("You don't have permission to delete this message");
            }
            var result = await _mediator.Send(new DeleteGeneric<Message>(messageId));
            await _hubContext.Clients.Group(message.ProjectId)
                .SendAsync("MessageDeleted", messageId);
            return Ok(result);
        }
    }
}