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
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using API.Services;
using Domain.Interface;
using Domain.Types;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IProjectNotification _notificationService;

        public MemberController(IMediator mediator, IMapper mapper, IProjectNotification notificationService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        [HttpGet("getMemberById")]
        public async Task<ActionResult<MemberDTO>> GetMember(string id)
        {
            var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId == id));
            if (member == null)
                return NotFound("Member not found");

            return Ok(_mapper.Map<MemberDTO>(member));
        }

        [HttpGet("getMembersByProject")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMembersByProject(string projectId)
        {
            var members = await _mediator.Send(new GetAllGeneric<Member>(
                m => m.ProjectId == projectId,
                query => query.Include(m => m.User)
            ));

            if (!members.Any())
                return NotFound("No members found for this project");

            return Ok(members.Select(_mapper.Map<MemberDTO>));
        }

        [HttpGet("getProductOwner")]
        public async Task<ActionResult<MemberDTO>> GetProductOwner(string projectId)
        {
            var productOwner = await _mediator.Send(new GetByIDGeneric<Member>(
                m => m.ProjectId == projectId && m.Role == MemberRole.Product_Owner
            ));

            if (productOwner == null)
                return NotFound("No product owner found for this project");

            return Ok(_mapper.Map<MemberDTO>(productOwner));
        }

        [HttpGet("isProductOwner")]
        public async Task<ActionResult<bool>> IsProductOwner(string projectId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            var isOwner = await _mediator.Send(new GetByIDGeneric<Member>(
                m => m.ProjectId == projectId &&
                     m.Role == MemberRole.Product_Owner &&
                     m.UserId == userId
            ));

            return isOwner != null ? Ok(true) : Unauthorized(false);
        }

        [HttpGet("getAssignedMembers")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetAssignedMembersByTicket(string ticketId)
        {
            var ticketMembers = await _mediator.Send(new GetAllGeneric<TicketMember>(
                tm => tm.TicketId == ticketId,
                query => query.Include(tm => tm.Member).ThenInclude(m => m.User)
            ));

            if (!ticketMembers.Any())
                return NotFound(new { Message = "No members assigned to this ticket" });

            var members = ticketMembers.Select(tm => tm.Member);
            return Ok(members.Select(_mapper.Map<MemberDTO>));
        }

        [HttpPut("UpdateMemberRole")]
        public async Task<IActionResult> UpdateMemberRole(string memberId, MemberRole role)
        {
            var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId == memberId));
            if (member == null)
                return NotFound("Member not found");

            if (role == MemberRole.Product_Owner)
            {
                var existingProductOwner = await _mediator.Send(new GetByIDGeneric<Member>(
                    m => m.ProjectId == member.ProjectId &&
                         m.Role == MemberRole.Product_Owner &&
                         m.MemberId != memberId // Make sure it's not the same member
                ));

                if (existingProductOwner != null)
                    return BadRequest("This project already has a product owner.");
            }

            member.Role = role;
            var result = await _mediator.Send(new PutGeneric<Member>(member));
            return Ok(new { Message = result });
        }

        [HttpPost("AddMember")]
        public async Task<IActionResult> AddMember([FromBody] MemberDTO memberDTO)
        {
            if (memberDTO.Role == MemberRole.Product_Owner)
            {
                var existingProductOwner = await _mediator.Send(new GetByIDGeneric<Member>(
                    m => m.ProjectId == memberDTO.ProjectId && m.Role == MemberRole.Product_Owner
                ));

                if (existingProductOwner != null)
                    return BadRequest("This project already has a product owner.");
            }

            var member = _mapper.Map<Member>(memberDTO);
            var result = await _mediator.Send(new PostGeneric<Member>(member));

            return Ok(new { member });
        }

        [HttpDelete("DeleteMember")]
        public async Task<string> DeleteMember(string id)
        {
            return await _mediator.Send(new DeleteGeneric<Member>(id));
        }
    }
}