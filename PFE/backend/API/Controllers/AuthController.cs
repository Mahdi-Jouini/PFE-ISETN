using AutoMapper;
using Domain.Commands;
using Domain.DTOs;
using Domain.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain.Models;
using API.Services;
using Microsoft.AspNetCore.Identity.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthController : ControllerBase
    {
        private readonly IMediator _mediator;
        private readonly IMapper _mapper;
        private readonly TokenService _tokenService;
        private readonly OtpService _otpService;

        public AuthController(IMediator mediator, IMapper mapper, TokenService tokenService, OtpService otpService)
        {
            _mediator = mediator;
            _mapper = mapper;
            _tokenService = tokenService;
            _otpService = otpService;
        }

        [HttpPost("signIn")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> SignIn([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var utilisateur = await _mediator.Send(new GetByIDGeneric<User>(c => c.EmailAddress.Equals(request.Email)));
            if (utilisateur == null)
            {
                return NotFound("User not found");
            }

            // Assuming you implement proper password hashing
            if (!request.Password.Equals(utilisateur.Password))
            {
                return Unauthorized("Mot de passe incorrect");
            }


            var token = _tokenService.GenerateToken(utilisateur.Id, utilisateur.EmailAddress, utilisateur.IsAdmin);
            return Ok(new { Message = "Connection successful", Token = token });
        }

        [HttpGet("sendOtp")]
        [AllowAnonymous]
        public async Task<IActionResult> VerifyMmail(string? emailAddress)
        {
            if (string.IsNullOrEmpty(emailAddress))
            {
                return BadRequest("Email Address is required");
            }
            var otp = _otpService.GenerateAndStoreOtp(emailAddress);
            var result = MailService.MailSender(emailAddress, "nesssi wa7bebi!!", otp);
            return Ok(new { Message = result });
        }

        [HttpPost("signUp")]
        [AllowAnonymous]
        public async Task<IActionResult> SignUp([FromBody] UserDTO userDTO)
        {
            Console.WriteLine(userDTO.EmailAddress);
            bool isValid = _otpService.ValidateOtp(userDTO.EmailAddress, userDTO.otp);
            string? storedOtp = _otpService.GetStoredOtp(userDTO.EmailAddress) ?? "Not Found";
            if (!isValid) return BadRequest(new { error = "Invalid OTP or expired", is_valid = isValid, Stored_Otp = storedOtp  });
            var user = _mapper.Map<User>(userDTO);
            var result = await _mediator.Send(new PostGeneric<User>(user));
            if (result == null) return StatusCode(500, "User registration failed.");
            return Ok(new { Message = result });
        }

        [HttpPost("resetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO request)
        {
            if (request == null) return BadRequest("Email, password and OTP are required.");

            bool isValid = _otpService.ValidateOtp(request.EmailAddress, request.Otp);
            if (!isValid) return BadRequest("Invalid OTP or expired.");

            var existingUser = await _mediator.Send(new GetByIDGeneric<User>(c => c.EmailAddress.Equals(request.EmailAddress)));
            if (existingUser == null)
            {
                return NotFound("User not found.");
            }
            existingUser.Password = request.Password;
            var result = await _mediator.Send(new PutGeneric<User>(existingUser));
            if (result == null) return StatusCode(500, "Reset password failed.");
            return Ok(new { Message = "Password reset successfully." });
        }

        [HttpGet("me")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var utilisateur = await _mediator.Send(new GetByIDGeneric<User>(c => c.Id.Equals(userId)));
            if (utilisateur == null)
                return NotFound("User not found");

            return Ok(_mapper.Map<UserDTO>(utilisateur));
        }
    }
}
