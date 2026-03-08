using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.Features.Auth.Commands;
using Swashbuckle.AspNetCore.Annotations;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Produces("application/json")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("register")]
    [SwaggerOperation(
        Summary = "Register a new user",
        Description = "Creates a new user account with email, password, name, and optional location",
        Tags = new[] { "Authentication" }
    )]
    [SwaggerResponse(200, "User registered successfully", typeof(AuthResponse))]
    [SwaggerResponse(400, "Invalid request or user already exists")]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("login")]
    [SwaggerOperation(
        Summary = "Login user",
        Description = "Authenticates user and returns JWT token for accessing protected endpoints",
        Tags = new[] { "Authentication" }
    )]
    [SwaggerResponse(200, "Login successful", typeof(AuthResponse))]
    [SwaggerResponse(401, "Invalid credentials")]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        try
        {
            var result = await _mediator.Send(command);
            return Ok(result);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized(new { error = "Invalid credentials" });
        }
    }
}

public class AuthResponse
{
    [SwaggerSchema("JWT authentication token")]
    public string Token { get; set; } = string.Empty;

    [SwaggerSchema("User ID")]
    public string UserId { get; set; } = string.Empty;

    [SwaggerSchema("User email address")]
    public string Email { get; set; } = string.Empty;

    [SwaggerSchema("User full name")]
    public string Name { get; set; } = string.Empty;
}
