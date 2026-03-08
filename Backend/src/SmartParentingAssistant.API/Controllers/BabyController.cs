using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.Features.Babies.Commands;
using SmartParentingAssistant.Application.Features.Babies.Queries;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class BabyController : ControllerBase
{
    private readonly IMediator _mediator;

    public BabyController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    [SwaggerOperation(
        Summary = "Create baby profile",
        Description = "Creates a new baby profile for the authenticated user",
        Tags = new[] { "Baby" }
    )]
    [SwaggerResponse(201, "Baby profile created successfully")]
    [SwaggerResponse(400, "Invalid request")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> CreateBaby([FromBody] CreateBabyCommand command)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        // Create new command with UserId from token
        var commandWithUserId = command with { UserId = userId };
        var result = await _mediator.Send(commandWithUserId);
        return CreatedAtAction(nameof(GetAll), new { id = result.Id }, result);
    }

    [HttpGet]
    [SwaggerOperation(
        Summary = "Get all baby profiles",
        Description = "Retrieves all baby profiles for the authenticated user",
        Tags = new[] { "Baby" }
    )]
    [SwaggerResponse(200, "Baby profiles retrieved successfully")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> GetAll()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _mediator.Send(new GetAllBabiesQuery(userId));
        return Ok(result);
    }
}
