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
    public class MemberController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;

        public MemberController(IMediator mediator, IMapper mapper)
        {
            _mediator = mediator;
            _mapper = mapper;
        }

        [HttpGet("getAllMembers")]
        public async Task<IEnumerable<MemberDTO>> Gets()
        {
            var members = await _mediator.Send(new GetAllGeneric<Member>());
            return members.Select(m => _mapper.Map<MemberDTO>(m));
        }

        [HttpGet("getMemberById")]
        public async Task<ActionResult<MemberDTO>> GetMember(string id)
        {
            var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId.Equals(id)));
            if (member == null)
                return NotFound("Member not found");
            return Ok(_mapper.Map<MemberDTO>(member));
        }

        [HttpGet("getMembersByProject")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMembersByProject(string projectId)
        {
            // Using your GetAllGeneric structure with Expression<Func<>>
            var members = await _mediator.Send(new GetAllGeneric<Member>(
                m => m.ProjectId == projectId,
                query => query.Include(m => m.User)
            ));

            if (members == null || !members.Any())
                return NotFound("No members found for this project");

            return Ok(members.Select(m => _mapper.Map<MemberDTO>(m)));
        }

        [HttpGet("getMembersByUser")]
        public async Task<ActionResult<IEnumerable<MemberDTO>>> GetMembersByUser(string userId)
        {
            // Using your GetAllGeneric structure with Expression<Func<>>
            var members = await _mediator.Send(new GetAllGeneric<Member>(
                m => m.UserId == userId,
                query => query.Include(m => m.User)
            ));

            if (members == null || !members.Any())
                return NotFound("No memberships found for this user");

            return Ok(members.Select(m => _mapper.Map<MemberDTO>(m)));
        }

        [HttpPost("PostMember")]
        public async Task<IActionResult> AddMember([FromBody] MemberDTO memberDTO)
        {
            var member = _mapper.Map<Member>(memberDTO);
            var result = await _mediator.Send(new PostGeneric<Member>(member));
            return Ok(new { member});
        }

        [HttpPut("UpdateMemberRole")]
        public async Task<IActionResult> UpdateMemberRole(string memberId, MemberRole role)
        {
            var member = await _mediator.Send(new GetByIDGeneric<Member>(m => m.MemberId.Equals(memberId)));
            if (member == null)
                return NotFound("Member not found");

            member.Role = role;
            var result = await _mediator.Send(new PutGeneric<Member>(member));
            return Ok(new { Message = result });
        }

        [HttpDelete("DeleteMember")]
        public async Task<string> DeleteMember(string id)

        {

            return await _mediator.Send(new DeleteGeneric<Member>(id));
        }
    }
}