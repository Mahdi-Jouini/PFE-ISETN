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
using Domain.Types;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public TicketController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet("getTicketById")]
        public async Task<ActionResult<TicketDTO>> GetTicket(string id)
        {
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(id)));
            if (ticket == null)
                return NotFound("Ticket not found");

            var ticketDto = _mapper.Map<TicketDTO>(ticket);
            return Ok(ticketDto);
        }

        [HttpGet("getAllTicketsBySprint")]
        public async Task<ActionResult<IEnumerable<TicketDTO>>> GetAllTicketsBySprint(string sprintId)
        {
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(sprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            var tickets = await _mediator.Send(new GetAllGeneric<Ticket>(
                t => t.SprintId == sprintId,
                query => query.Include(t => t.Sprint)
                             .Include(t => t.TicketMembers)
                             .ThenInclude(tm => tm.Member)
            ));

            if (tickets == null || !tickets.Any())
                return NotFound("No tickets found for this sprint");
            var ticketDtos = tickets.Select(ticket => _mapper.Map<TicketDTO>(ticket)).ToList();
            return Ok(ticketDtos);
        }
        [HttpGet("getCurrentTickets")]
        public async Task<ActionResult<IEnumerable<TicketDTO>>> getCurrentTickets(string projectId)
        {
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(
                s => s.ProjectId.Equals(projectId) &&
                s.SprintState == SprintState.InProgress
            ));
            if (sprint == null)
                return NotFound("Sprint not found");

            var tickets = await _mediator.Send(new GetAllGeneric<Ticket>(
                t => t.SprintId == sprint.SprintId ,
                query => query.Include(t => t.Sprint)
                             .Include(t => t.TicketMembers)
                             .ThenInclude(tm => tm.Member)
            ));

            if (tickets == null || !tickets.Any())
                return NotFound("No current tickets");
            var ticketDtos = tickets.Select(ticket => _mapper.Map<TicketDTO>(ticket)).ToList();
            return Ok(ticketDtos);
        }

        [HttpPost("createTicket")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketDTO ticketDTO)
        {

            var ticket = _mapper.Map<Ticket>(ticketDTO);
            var result = await _mediator.Send(new PostGeneric<Ticket>(ticket));

            return Ok(new { ticket });
        }


        [HttpPut("updateTicket")]
        public async Task<IActionResult> UpdateTicket([FromBody] TicketDTO ticketDTO)
        {
            var existingTicket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketDTO.TicketId)));
            if (existingTicket == null)
                return NotFound("Ticket not found");

            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(ticketDTO.SprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            _mapper.Map(ticketDTO, existingTicket);

            var result = await _mediator.Send(new PutGeneric<Ticket>(existingTicket));
            return Ok(new { Message = result });
        }


        [HttpPut("updateTicketState")]
        public async Task<IActionResult> UpdateTicketState(string ticketId, TicketState state)
        {
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketId)));
            if (ticket == null)
                return NotFound("Ticket not found");
            ticket.Status = state;
            var result = await _mediator.Send(new PutGeneric<Ticket>(ticket));
            return Ok(new { Message = result });
        }

        [HttpPut("updateTicketStoryPoint")]
        public async Task<IActionResult> UpdateTicketDifficulty(string ticketId, TicketDifficulty difficulty)
        {
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketId)));
            if (ticket == null)
                return NotFound("Ticket not found");
            ticket.Difficulty = difficulty;
            var result = await _mediator.Send(new PutGeneric<Ticket>(ticket));
            return Ok(new { Message = result });
        }

        [HttpPut("assignMemberToTicket")]
        public async Task<IActionResult> AssignMemberToTicket(string ticketId, string memberId)
        {
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketId)));
            if (ticket == null)
                return NotFound("Ticket not found");
            var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId.Equals(memberId)));
            if (member == null)
                return NotFound("Member not found");

            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(ticket.SprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            if (member.ProjectId != sprint.ProjectId)
                return BadRequest("Member is not assigned to the same project as the ticket");

            var existingAssignment = await _mediator.Send(new GetByIDGeneric<TicketMember>(
                tm => tm.TicketId.Equals(ticketId) && tm.MemberId.Equals(memberId)));

            if (existingAssignment != null)
                return BadRequest("Member is already assigned to this ticket");

            var ticketMember = new TicketMember
            {
                TicketId = ticketId,
                MemberId = memberId,
                AssignedDate = DateTime.Now
            };

            await _mediator.Send(new PostGeneric<TicketMember>(ticketMember));
            return Ok(new { Message = "Member assigned successfully" });
        }

        [HttpDelete("removeMemberFromTicket")]
        public async Task<IActionResult> RemoveMemberFromTicket(string ticketId, string memberId)
        {
            var assignment = await _mediator.Send(new GetByIDGeneric<TicketMember>(
                tm => tm.TicketId.Equals(ticketId) && tm.MemberId.Equals(memberId)));

            if (assignment == null)
                return NotFound("Member is not assigned to this ticket");

            var result = await _mediator.Send(new DeleteGeneric<TicketMember>(assignment.TicketMemberId));
            return Ok(new { Message = "Member removed successfully" });
        }

        [HttpDelete("deleteTicket")]
        public async Task<IActionResult> DeleteTicket(string id)
        {
            var existingTicket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(id)));
            if (existingTicket == null)
                return NotFound("Ticket not found");

            var ticketMembers = await _mediator.Send(new GetAllGeneric<TicketMember>(tm => tm.TicketId == id));
            foreach (var ticketMember in ticketMembers)
            {
                await _mediator.Send(new DeleteGeneric<TicketMember>(ticketMember.TicketMemberId));
            }

            var result = await _mediator.Send(new DeleteGeneric<Ticket>(id));
            return Ok(new { Message = result });
        }
    }
}