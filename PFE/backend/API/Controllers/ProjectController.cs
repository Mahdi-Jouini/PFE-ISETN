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
using Microsoft.EntityFrameworkCore;
using API.Services;
using System.Security.Claims;
using System.Net.Sockets;
using Domain.Types;

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
                var projects = await _mediator.Send(new GetAllGeneric<Project>());
                if (projects == null || !projects.Any())
                    return NotFound("No projects found");
                var projectDtos = _mapper.Map<List<ProjectDTO>>(projects);
                foreach (var project in projectDtos)
                {
                    var productOwner = await _mediator.Send(new GetByIDGeneric<Member>(
                        m => m.ProjectId == project.ProjectId && m.Role == MemberRole.Product_Owner,
                        query => query.Include(m => m.User)
                    ));

                    if (productOwner != null)
                    {
                        project.ProductOwner = productOwner.User;
                    }
                }

            return Ok(projectDtos);
            }

            [HttpGet("getProjectById")]
            public async Task<ActionResult<ProjectDTO>> GetProject(string id)
            {
            
                var project = await _mediator.Send(new GetByIDGeneric<Project>(p => p.ProjectId.Equals(id)));
                if (project == null)
                    return NotFound("Project not found");
                var projectDto = _mapper.Map<ProjectDTO>(project);

                return Ok(projectDto);
            }

            [HttpPost("PostProject")]
            public async Task<IActionResult> CreateProject([FromBody] ProjectDTO projectDTO)
            {
                var productOwnerId = User.FindFirstValue(ClaimTypes.NameIdentifier);
                var project = _mapper.Map<Project>(projectDTO);
                var projectResult = await _mediator.Send(new PostGeneric<Project>(project));
                var productOwnerMember = new MemberDTO
                {
                    UserId = productOwnerId,
                    ProjectId = project.ProjectId,
                    Role = MemberRole.Product_Owner
                };
                var member = _mapper.Map<Member>(productOwnerMember);
                var memberResult = await _mediator.Send(new PostGeneric<Member>(member));
                return Ok(new
                {
                    project.ProjectId,
                });
            }

            [HttpPut("PutProject")]
            public async Task<IActionResult> UpdateProject([FromBody] ProjectDTO projectDTO)
            {
            var existingProject = await _mediator.Send(new GetByIDGeneric<Project>(s => s.ProjectId.Equals(projectDTO.ProjectId)));
            if (existingProject == null)
                return NotFound("Project not found");

            _mapper.Map(projectDTO, existingProject);

            var result = await _mediator.Send(new PutGeneric<Project>(existingProject));

            return Ok(new { Message = result });
            }

            [HttpDelete("DeleteProject")]
            public async Task<string> DeleteProject(string id)
            {
                return await _mediator.Send(new DeleteGeneric<Project>(id));

            }

        }
    }