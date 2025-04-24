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

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public ProjectController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet("getAllProjects")]
        public async Task<ActionResult<IEnumerable<ProjectDTO>>> Gets()
        {
            // Get all projects
            var projects = await _mediator.Send(new GetAllGeneric<Project>());
            if (projects == null || !projects.Any())
                return NotFound("No projects found");

            // Get all product owners in a single query
            var productOwners = await _mediator.Send(new GetAllGeneric<Member>(
                m => m.Role == MemberRole.Product_Owner,
                query => query.Include(m => m.User)
            ));

            // Create a dictionary for quick lookup
            var ownersByProject = productOwners.ToDictionary(
                m => m.ProjectId,
                m => m.User
            );

            // Map projects and add owners
            var projectDtos = projects.Select(project => {
                var projectDto = _mapper.Map<ProjectDTO>(project);

                // Add the owner if found
                if (ownersByProject.TryGetValue(project.ProjectId, out var owner))
                {
                    projectDto.ProductOwner = _mapper.Map<UserDTO>(owner);
                }

                return projectDto;
            }).ToList();

            return Ok(projectDtos);
        }

        [HttpGet("getProjectById")]
        public async Task<ActionResult<ProjectDTO>> GetProject(string id)
        {
            var project = await _mediator.Send(new GetByIDGeneric<Project>(p => p.ProjectId.Equals(id)));
            if (project == null)
                return NotFound("Project not found");

            // Get the product owner for this project
            var productOwner = await _mediator.Send(new GetAllGeneric<Member>(
                m => m.ProjectId == project.ProjectId && m.Role == MemberRole.SCRUM_Master,
                query => query.Include(m => m.User)
            ));

            var projectDto = _mapper.Map<ProjectDTO>(project);
            var owner = productOwner.FirstOrDefault();
            if (owner != null)
            {
                projectDto.ProductOwner = _mapper.Map<UserDTO>(owner.User);
            }

            return Ok(projectDto);
        }

        [HttpPost("PostProject")]
        public async Task<IActionResult> CreateProject([FromBody] ProjectDTO projectDTO)
        {
            var project = _mapper.Map<Project>(projectDTO);
            var result = await _mediator.Send(new PostGeneric<Project>(project));
            return Ok(new { Message = result });
        }

        [HttpPut("PutProject")]
        public async Task<string> UpdateProject(Project project)
        {
            return await _mediator.Send(new PutGeneric<Project>(project));
        }

        [HttpDelete("DeleteProject")]
        public async Task<string> DeleteProject(string id)
        {
            return await _mediator.Send(new DeleteGeneric<Project>(id));
        }
    }
}