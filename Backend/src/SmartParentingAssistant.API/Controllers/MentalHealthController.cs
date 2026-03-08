using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.Features.MentalHealth.Queries;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class MentalHealthController : ControllerBase
{
    private readonly IMediator _mediator;

    public MentalHealthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet("assessment")]
    [SwaggerOperation(
        Summary = "Get postpartum depression risk assessment",
        Description = "Analyzes journal entries to assess postpartum depression risk. Provides risk score (0-100), risk level (Low/Moderate/High/Critical), risk factors, protective factors, and personalized recommendations. Default analyzes last 14 days of journal entries.",
        Tags = new[] { "Mental Health" }
    )]
    [SwaggerResponse(200, "Assessment completed successfully")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> GetAssessment([FromQuery] int days = 14)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        if (days < 1 || days > 90)
            return BadRequest("Days must be between 1 and 90");

        var query = new GetMentalHealthAssessmentQuery(userId, days);
        var assessment = await _mediator.Send(query);

        return Ok(assessment);
    }
}
