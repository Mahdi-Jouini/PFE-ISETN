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


        public  UserController(IMediator mediator, IMapper mapper, TokenService tokenService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpGet("getAllUtilisateurs")]
        public async Task<IEnumerable<UserDTO>> Gets()
        {
            var utilisateurs = await _mediator.Send(new GetAllGeneric<Domain.Models.User>());
            return utilisateurs.Select(l => _mapper.Map<UserDTO>(l));
        }

        [HttpGet("getUtilisateurById")]
        public async Task<ActionResult<UserDTO>> GetUtilisateur(string? id)
        {
            var utilisateur = await _mediator.Send(new GetByIDGeneric<User>(c => c.Id.Equals(id)));

            if (utilisateur == null)
                return NotFound("Utilisateur not found");

            return Ok(_mapper.Map<UserDTO>(utilisateur));
        }

        [HttpPost("PostUtilisateur")]
        public async Task<IActionResult> RegisterUser([FromBody] UserDTO utilisateurDTO)
        {
            var utilisateur = _mapper.Map<User>(utilisateurDTO);
            var result = await _mediator.Send(new PostGeneric<User>(utilisateur));
            return Ok(new { Message = result });
        }

        [HttpPut("PutUtilisateur")]
        public async Task<string> PutUtilisateur(User  utilisateur)
        {

            return await _mediator.Send(new PutGeneric<User>( utilisateur));
        }


        [HttpDelete("DeleteUtilisateur")]
        public async Task<string> DeleteUtilisateur(Guid id)
        {
            return await _mediator.Send(new DeleteGeneric<User>(id));
        }
    }
}