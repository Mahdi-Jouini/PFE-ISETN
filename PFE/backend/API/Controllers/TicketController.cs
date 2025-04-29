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
            // Check if sprint exists
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(sprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            // Get all tickets for the sprint
            var tickets = await _mediator.Send(new GetAllGeneric<Ticket>(
                t => t.SprintId == sprintId,
                query => query.Include(t => t.Sprint)
                             .Include(t => t.TicketMembers)
                             .ThenInclude(tm => tm.Member)
            ));

            if (tickets == null || !tickets.Any())
                return NotFound("No tickets found for this sprint");

            // Map tickets to DTOs
            var ticketDtos = tickets.Select(ticket => _mapper.Map<TicketDTO>(ticket)).ToList();
            return Ok(ticketDtos);
        }

        [HttpPost("createTicket")]
        public async Task<IActionResult> CreateTicket([FromBody] TicketDTO ticketDTO)
        {
            // Check if sprint exists
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(ticketDTO.SprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            var ticket = _mapper.Map<Ticket>(ticketDTO);

            // 💥 Reset TicketId here
            ticket.TicketId = null; // Or Guid.NewGuid().ToString() if you use GUIDs

            // Set Status
            ticket.Status = ticketDTO.Status;

            var result = await _mediator.Send(new PostGeneric<Ticket>(ticket));

            // Handle TicketMember if MemberId is provided
            if (!string.IsNullOrEmpty(ticketDTO.MemberId))
            {
                var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId.Equals(ticketDTO.MemberId)));
                if (member == null)
                    return NotFound("Member not found");

                if (member.ProjectId != sprint.ProjectId)
                    return BadRequest("Member is not assigned to the same project as the sprint");

                var ticketMember = new TicketMember
                {
                    TicketId = ticket.TicketId,
                    MemberId = ticketDTO.MemberId,
                    AssignedDate = DateTime.Now
                };

                await _mediator.Send(new PostGeneric<TicketMember>(ticketMember));
            }

            return Ok(new { Message = result, TicketId = ticket.TicketId });
        }


        [HttpPut("updateTicket")]
        public async Task<IActionResult> UpdateTicket([FromBody] TicketDTO ticketDTO)
        {
            // Check if ticket exists
            var existingTicket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketDTO.TicketId)));
            if (existingTicket == null)
                return NotFound("Ticket not found");

            // Check if sprint exists
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(ticketDTO.SprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            // Update the ticket
            var ticket = _mapper.Map<Ticket>(ticketDTO);

           

            // Make sure to map the State property from DTO to Status property in model
            ticket.Status = ticketDTO.Status;

            var result = await _mediator.Send(new PutGeneric<Ticket>(ticket));
            return Ok(new { Message = result });
        }

        [HttpPut("updateTicketState")]
        public async Task<IActionResult> UpdateTicketState(string ticketId, TicketState state)
        {
            // Check if ticket exists
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketId)));
            if (ticket == null)
                return NotFound("Ticket not found");

            // Update the state
            ticket.Status = state;
            var result = await _mediator.Send(new PutGeneric<Ticket>(ticket));
            return Ok(new { Message = result });
        }

        [HttpPut("updateTicketDifficulty")]
        public async Task<IActionResult> UpdateTicketDifficulty(string ticketId, TicketDifficulty difficulty)
        {
            // Check if ticket exists
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketId)));
            if (ticket == null)
                return NotFound("Ticket not found");

            // Update the difficulty
            ticket.Difficulty = difficulty;
            var result = await _mediator.Send(new PutGeneric<Ticket>(ticket));
            return Ok(new { Message = result });
        }

        [HttpPut("assignMemberToTicket")]
        public async Task<IActionResult> AssignMemberToTicket(string ticketId, string memberId)
        {
            // Check if ticket exists
            var ticket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(ticketId)));
            if (ticket == null)
                return NotFound("Ticket not found");

            // Check if member exists
            var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId.Equals(memberId)));
            if (member == null)
                return NotFound("Member not found");

            // Check if member is part of the project
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(ticket.SprintId)));
            if (sprint == null)
                return NotFound("Sprint not found");

            if (member.ProjectId != sprint.ProjectId)
                return BadRequest("Member is not assigned to the same project as the ticket");

            // Check if the assignment already exists
            var existingAssignment = await _mediator.Send(new GetByIDGeneric<TicketMember>(
                tm => tm.TicketId.Equals(ticketId) && tm.MemberId.Equals(memberId)));

            if (existingAssignment != null)
                return BadRequest("Member is already assigned to this ticket");

            // Create the ticket member assignment
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
            // Check if the assignment exists
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
            // Check if ticket exists
            var existingTicket = await _mediator.Send(new GetByIDGeneric<Ticket>(t => t.TicketId.Equals(id)));
            if (existingTicket == null)
                return NotFound("Ticket not found");

            // Delete all ticket member assignments first
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