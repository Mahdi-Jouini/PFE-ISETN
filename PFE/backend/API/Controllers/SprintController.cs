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
    public class SprintController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public SprintController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
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
            var sprintDtos = sprints.Select(sprint => _mapper.Map<SprintDTO>(sprint)).ToList();
            return Ok(sprintDtos);
        }

        [HttpPost("createSprint")]
        public async Task<IActionResult> CreateSprint([FromBody] SprintDTO sprintDTO)
        {
            
            var project = await _mediator.Send(new GetByIDGeneric<Project>(p => p.ProjectId.Equals(sprintDTO.ProjectId)));
            if (project == null)
                return NotFound("Project not found");

            var sprint = _mapper.Map<Sprint>(sprintDTO);
            var result = await _mediator.Send(new PostGeneric<Sprint>(sprint));

            return Ok(new { Message = result, SprintId = sprint.SprintId });
        }

        [HttpPut("updateSprint")]
        public async Task<IActionResult> UpdateSprint([FromBody] SprintDTO sprintDTO)
        {
            // Check if sprint exists
            var existingSprint = await _mediator.Send(new GetByIDGeneric<Sprint>(s => s.SprintId.Equals(sprintDTO.SprintId)));
            if (existingSprint == null)
                return NotFound("Sprint not found");

            var sprint = _mapper.Map<Sprint>(sprintDTO);
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