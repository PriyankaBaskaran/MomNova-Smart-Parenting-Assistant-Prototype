using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.Features.Analytics.Queries;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    public AnalyticsController(IMediator mediator)
    {
        _mediator = mediator;
    }
        
    [HttpGet("mood-trends")]
    [SwaggerOperation(
        Summary = "Get mood trends analysis",
        Description = "Analyzes mood trends over a specified date range. Detects concerning patterns (3+ consecutive negative days) and calculates trend direction (improving/declining/stable).",
        Tags = new[] { "Analytics" }
    )]
    [SwaggerResponse(200, "Mood trends retrieved successfully", typeof(MoodTrendResponse))]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> GetMoodTrends(
        [FromQuery, SwaggerParameter("Start date", Required = true)] DateTime startDate,
        [FromQuery, SwaggerParameter("End date", Required = true)] DateTime endDate)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var query = new GetMoodTrendsQuery(userId, startDate, endDate);
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}

public class MoodTrendResponse
{
    [SwaggerSchema("Analysis start date")]
    public DateTime StartDate { get; set; }

    [SwaggerSchema("Analysis end date")]
    public DateTime EndDate { get; set; }

    [SwaggerSchema("Average sentiment score")]
    public float AverageSentiment { get; set; }

    [SwaggerSchema("Trend direction (improving, declining, stable)")]
    public string Trend { get; set; } = string.Empty;

    [SwaggerSchema("Whether concerning pattern detected (3+ consecutive negative days)")]
    public bool HasConcerningPattern { get; set; }
}
