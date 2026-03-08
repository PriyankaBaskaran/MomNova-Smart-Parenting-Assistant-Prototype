using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.Features.Tips.Commands;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class DailyAdviceController : ControllerBase
{
    private readonly IMediator _mediator;

    public DailyAdviceController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("generate")]
    [SwaggerOperation(
        Summary = "Generate daily parenting advice with mental health check",
        Description = "Generates personalized daily parenting advice using AWS Bedrock AI. Includes postpartum depression risk assessment based on recent journal entries (last 14 days). Returns both the daily advice and a mental health risk summary.",
        Tags = new[] { "Daily Advice" }
    )]
    [SwaggerResponse(200, "Advice generated successfully with mental health assessment")]
    [SwaggerResponse(400, "Invalid request")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> Generate([FromQuery] string babyId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        if (string.IsNullOrEmpty(babyId))
            return BadRequest("BabyId is required");

        var command = new GenerateDailyAdviceWithAssessmentCommand(userId, babyId);
        var result = await _mediator.Send(command);

        return Ok(result);
    }
}
