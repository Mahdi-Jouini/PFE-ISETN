
using AutoMapper;
using Domain.Commands;
using Domain.DTOs;
using Domain.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using Domain.Interface;
using Domain.Types;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvitationController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IProjectNotification _notificationService;

        public InvitationController(IMediator mediator, IMapper mapper, IProjectNotification notificationService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        [HttpPost("InviteUser")]
        public async Task<IActionResult> InviteUser([FromBody] InvitationDTO invitationDto)
        {
            var existingMember = await _mediator.Send(new GetByIDGeneric<Member>(
                m => m.UserId == invitationDto.ReceiverId && m.ProjectId == invitationDto.ProjectId
            ));
            if (existingMember != null)
            {
                return BadRequest(new
                {
                    Message = "This user is already a member of the project."
                });
            }
            var existingInvitation = await _mediator.Send(new GetByIDGeneric<Invitation>(
                i => i.ReceiverId == invitationDto.ReceiverId &&
                     i.ProjectId == invitationDto.ProjectId &&
                     i.Status == InvitationStatus.Pending
            ));
            if (existingInvitation != null)
            {
                return BadRequest(new
                {
                    Message = "This user has already been invited to the project and the invitation is still pending."
                });
            }
            var invitation = _mapper.Map<Invitation>(invitationDto);
            invitation.Status = InvitationStatus.Pending;
            var result = await _mediator.Send(new PostGeneric<Invitation>(invitation));
            return Ok(new { invitation });
        }

        [HttpPut("ApproveInvitation")]
        public async Task<IActionResult> ApproveInvitation(string invitationId)
        {
            var invitation = await _mediator.Send(new GetByIDGeneric<Invitation>(i => i.Id == invitationId));
            if (invitation == null)
                return NotFound("Invitation not found");
            if (invitation.Status != InvitationStatus.Pending)
                return BadRequest("Only pending invitations can be approved");
            invitation.Status = InvitationStatus.Approved;
            var result = await _mediator.Send(new PutGeneric<Invitation>(invitation));
            var member = new Member
            {
                ProjectId = invitation.ProjectId,
                UserId = invitation.ReceiverId,
                Role = invitation.Role
            };
            await _mediator.Send(new PostGeneric<Member>(member));
            return Ok(new { Message = "Invitation approved", invitation });
        }

        [HttpPut("CancelInvitation")]
        public async Task<IActionResult> CancelInvitation(string invitationId)
        {
            var invitation = await _mediator.Send(new GetByIDGeneric<Invitation>(i => i.Id == invitationId));
            if (invitation == null)
                return NotFound("Invitation not found");
            if (invitation.Status != InvitationStatus.Pending)
                return BadRequest("Only pending invitations can be canceled");
            invitation.Status = InvitationStatus.Canceled;
            var result = await _mediator.Send(new PutGeneric<Invitation>(invitation));
            return Ok(new { Message = "Invitation canceled", invitation });
        }
    }
}
