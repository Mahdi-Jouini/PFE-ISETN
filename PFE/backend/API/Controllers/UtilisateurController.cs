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
    public class UtilisateurController : ControllerBase
    {
        public readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly TokenService _tokenService;


        public  UtilisateurController(IMediator mediator, IMapper mapper, TokenService tokenService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _tokenService = tokenService;
        }

        [HttpGet("getAllUtilisateurs")]
        public async Task<IEnumerable<UtilisateurDTO>> Gets()
        {
            var utilisateurs = await _mediator.Send(new GetAllGeneric<Domain.Models.Utilisateur>());
            return utilisateurs.Select(l => _mapper.Map<UtilisateurDTO>(l));
        }

        [HttpGet("signIn")]
        public async Task<ActionResult<UtilisateurDTO>> SignIn(string? EmailAddress, string password)
        {
            var utilisateur = await _mediator.Send(new GetByIDGeneric<Utilisateur>(c => c.EmailAddress.Equals(EmailAddress)));
            if (utilisateur == null)
            {
                return NotFound("Utilisateur non trouvé");
            }
            if (!utilisateur.Password.Equals(password)) {
                return Unauthorized("Mot de passe incorrect");
            }
            var token = _tokenService.GenerateToken(utilisateur.Id, utilisateur.EmailAddress, new List<string> { utilisateur.Role });
            return Ok(new { Message = "Connexion réussie", Token = token});
        }

        [HttpGet("getUtilisateurById")]
        public async Task<ActionResult<UtilisateurDTO>> GetUtilisateur(string? firstName)
        {
            var utilisateur = await _mediator.Send(new GetByIDGeneric<Utilisateur>(c => c.FirstName.Equals(firstName)));

            if (utilisateur == null)
                return NotFound("Utilisateur not found");

            return Ok(_mapper.Map<UtilisateurDTO>(utilisateur));
        }

        [HttpPost("PostUtilisateur")]
        public async Task<IActionResult> RegisterUser([FromBody] UtilisateurDTO utilisateurDTO)
        {
            //var utilisateur = _mapper.Map<Utilisateur>(utilisateurDTO);
            //var result = await _mediator.Send(new PostGeneric<Utilisateur>(utilisateur));
            var token = _tokenService.GenerateToken("1", utilisateurDTO.EmailAddress, new List<string> { "User" });
            var result = MailService.MailSender(utilisateurDTO.EmailAddress, "nesssi wa7bebi", token);
            return Ok(new { Message = result });
        }

        [HttpPut("PutUtilisateur")]
        public async Task<string> PutUtilisateur(Utilisateur  utilisateur)
        {

            return await _mediator.Send(new PutGeneric<Utilisateur>( utilisateur));
        }

        [HttpDelete("DeleteUtilisateur")]
        public async Task<string> DeleteUtilisateur(Guid id)
        {
            return await _mediator.Send(new DeleteGeneric<Utilisateur>(id));
        }
    }
}