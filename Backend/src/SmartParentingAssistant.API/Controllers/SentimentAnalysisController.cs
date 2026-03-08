using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.Features.Babies.Commands;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
[Authorize]
[Produces("application/json")]
public class SentimentAnalysisController : ControllerBase
{
    private readonly IMediator _mediator;

    public SentimentAnalysisController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("analyze")]
    [SwaggerOperation(
        Summary = "Analyze text sentiment",
        Description = "Analyzes text sentiment using Amazon Comprehend with multilingual support (English, Hindi, Hinglish). Includes red flag detection for crisis keywords and returns emergency resources when needed.",
        Tags = new[] { "Sentiment Analysis" }
    )]
    [SwaggerResponse(200, "Sentiment analysis completed successfully", typeof(object))]
    [SwaggerResponse(400, "Invalid request - text is required")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> Analyse([FromBody] AnalysisCommand command)
    {
        if (string.IsNullOrWhiteSpace(command.Text))
            return BadRequest(new { error = "Text is required for sentiment analysis" });

        if (command.Text.Length > 5000)
            return BadRequest(new { error = "Text must be less than 5000 characters" });

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var result = await _mediator.Send(command);
        
        return Ok(new 
        { 
            babyId = result.BabyId,
            sentiment = result.Sentiment,
            confidence = result.Confidence,
            language = result.Language,
            sentimentScores = result.SentimentScores,
            hasRedFlags = result.HasRedFlags,
            emergencyResources = result.EmergencyResources,
            message = result.HasRedFlags 
                ? "⚠️ We detected concerning content. Please reach out for support if needed." 
                : "Analysis completed successfully"
        });
    }

    [HttpGet("{babyId}")]
    [SwaggerOperation(
        Summary = "Get mood analysis history",
        Description = "Retrieves sentiment analysis history for a specific baby profile, showing mood trends over time",
        Tags = new[] { "Sentiment Analysis" }
    )]
    [SwaggerResponse(200, "Mood analysis history retrieved successfully")]
    [SwaggerResponse(404, "Baby profile not found")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> GetMoodAnalysis([SwaggerParameter("Baby profile ID")] string babyId)
    {
        if (string.IsNullOrWhiteSpace(babyId))
            return BadRequest(new { error = "Baby ID is required" });

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var query = new GetMoodAnalysisQuery { BabyId = babyId };
        var result = await _mediator.Send(query);
        
        return Ok(result);
    }
}
