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
using API.Services;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        public readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly TokenService _tokenService;

        public UserController(IMediator mediator, IMapper mapper, TokenService tokenService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpGet("getAllUsers")]
        public async Task<IEnumerable<UserDTO>> Gets()
        {
            var users = await _mediator.Send(new GetAllGeneric<Domain.Models.User>());
            return users.Select(l => _mapper.Map<UserDTO>(l));
        }

        [HttpGet("getUserById")]
        public async Task<ActionResult<UserDTO>> GetUser(string? id)
        {
            var user = await _mediator.Send(new GetByIDGeneric<User>(c => c.UserId.Equals(id)));
            if (user == null)
                return NotFound("User not found");
            return Ok(_mapper.Map<UserDTO>(user));
        }

        [HttpGet("getUserByEmail")]
        public async Task<ActionResult<UserDTO>> GetUserByEmail(string? email)
        {
            var user = await _mediator.Send(new GetByIDGeneric<User>(c => c.EmailAddress.Equals(email)));
            if (user == null)
                return NotFound("User not found");
            return Ok(_mapper.Map<UserDTO>(user));
        }

        [HttpGet("searchUsersByEmail")]
        public async Task<ActionResult<IEnumerable<UserDTO>>> SearchUsersByEmail(string searchTerm)
        {
            if (string.IsNullOrEmpty(searchTerm))
                return Ok(new List<UserDTO>());
            var users = await _mediator.Send(new GetAllGeneric<User>(u => u.EmailAddress.Contains(searchTerm)));
            return Ok(users.Select(u => _mapper.Map<UserDTO>(u)));
        }

        [HttpPost("PostUser")]
        public async Task<IActionResult> RegisterUser([FromBody] UserDTO userDTO)
        {
            var user = _mapper.Map<User>(userDTO);
            var result = await _mediator.Send(new PostGeneric<User>(user));
            return Ok(new { Message = result });
        }

        [HttpPut("PutUser")]
        public async Task<string> PutUser(User user)
        {
            return await _mediator.Send(new PutGeneric<User>(user));
        }

        [HttpDelete("DeleteUser")]
        public async Task<string> DeleteUser(string id)
        {
            return await _mediator.Send(new DeleteGeneric<User>(id));
        }
    }
}