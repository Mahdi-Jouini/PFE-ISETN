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
using API.Services;
using Domain.Interface;
using Domain.Types;
using System.Security.Claims;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SprintController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly IProjectNotification _notificationService;

        public SprintController(IMediator mediator, IMapper mapper, IProjectNotification notificationService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _notificationService = notificationService;
        }

        [HttpGet("getSprintById")]
        public async Task<ActionResult<SprintDTO>> GetSprint(string id)
        {
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(id)));
            if (sprint == null)
                return NotFound("Sprint not found");

            var sprintDto = _mapper.Map<SprintDTO>(sprint);
            return Ok(sprintDto);
        }
        [HttpGet("getActiveSprint")]
        public async Task<ActionResult<SprintDTO>> GetActiveSprint(string projectId)
        {
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s =>
            s.ProjectId.Equals(projectId) &&
            s.SprintState == SprintState.InProgress
            ));
            if (sprint == null)
                return NotFound("Active sprint not found");

            var sprintDto = _mapper.Map<SprintDTO>(sprint);
            return Ok(sprintDto);
        }

        [HttpGet("getAllSprintsByProject")]
        public async Task<ActionResult<IEnumerable<SprintDTO>>> GetAllSprintsByProject(string projectId)
        {
            // Check if project exists
            var project = await _mediator.Send(new GetByIDGeneric<Project>(p => p.ProjectId.Equals(projectId)));
            if (project == null)
                return NotFound("Project not found");

            // Get all sprints for the project
            var sprints = await _mediator.Send(new GetAllGeneric<Sprint>(
                s => s.ProjectId == projectId,
                query => query.Include(s => s.Project)
            ));

            if (sprints == null || !sprints.Any())
                return NotFound("No sprints found for this project");

            // Map sprints to DTOs
            var sprintDtos = sprints.Select(sprint => _mapper.Map<SprintDTO>(sprint));
            return Ok(sprintDtos);
        }

        [HttpPost("createSprint")]
        public async Task<IActionResult> CreateSprint([FromBody] SprintDTO sprintDTO)
        {
            var sprint = _mapper.Map<Sprint>(sprintDTO);
            var result = await _mediator.Send(new PostGeneric<Sprint>(sprint));

            await _notificationService.SendSprintNotification(
                sprintId: sprint.SprintId,
                type: NotificationType.SprintCreated,
                message: $"New sprint '{sprint.Title}' was created",
                actorId: User.FindFirst(ClaimTypes.NameIdentifier)?.Value
            );
            return Ok(new { sprint });
        }

        [HttpPut("updateSprint")]
        public async Task<IActionResult> UpdateSprint([FromBody] SprintDTO sprintDTO)
        {
            var existingSprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(sprintDTO.SprintId)));
            if (existingSprint == null)
                return NotFound("Sprint not found");

            _mapper.Map(sprintDTO, existingSprint);

            var result = await _mediator.Send(new PutGeneric<Sprint>(existingSprint));

            return Ok(new { Message = result });
        }

        [HttpPut("updateSprintState")]
        public async Task<IActionResult> UpdateSprintState(string sprintId, SprintState state)
        {
            var sprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(sprintId)));
            if (sprint == null)
            {
                return NotFound($"Sprint with ID {sprintId} not found");
            }
            sprint.SprintState = state;
            if (state == SprintState.InProgress)
            {
                sprint.StartDate = DateTime.Now;
                if (sprint.Duration != null)
                {
                    int durationInWeeks = (int)sprint.Duration;
                    sprint.CompletionDate = sprint.StartDate.AddDays(durationInWeeks * 7);
                }
            }
            var result = await _mediator.Send(new PutGeneric<Sprint>(sprint));
            return Ok(new { Message = result });
        }

        [HttpDelete("deleteSprint")]
        public async Task<IActionResult> DeleteSprint(string id)
        {
            // Check if sprint exists
            var existingSprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(id)));
            if (existingSprint == null)
                return NotFound("Sprint not found");

            var result = await _mediator.Send(new DeleteGeneric<Sprint>(id));

            return Ok(new { Message = result });
        }
    }
}