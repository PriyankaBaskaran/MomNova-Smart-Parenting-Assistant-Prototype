using Asp.Versioning;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Features.Journal.Commands;
using SmartParentingAssistant.Application.Features.Journal.Queries;
using Swashbuckle.AspNetCore.Annotations;
using System.Security.Claims;

namespace SmartParentingAssistant.API.Controllers;

[ApiController]
[ApiVersion("1.0")]
[Route("api/v{version:apiVersion}/[controller]")]
//[Authorize]
[Produces("application/json")]
public class JournalController : ControllerBase
{
    private readonly IMediator _mediator;

    public JournalController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost("entries")]
    [SwaggerOperation(
        Summary = "Create journal entry with AI sentiment analysis",
        Description = "Creates a new journal entry and automatically analyzes sentiment using Amazon Comprehend. Supports English, Hindi, and Hinglish. Detects red flags for crisis keywords and returns emergency resources when needed.",
        Tags = new[] { "Journal" }
    )]
    [SwaggerResponse(201, "Journal entry created successfully with sentiment analysis", typeof(JournalEntryDto))]
    [SwaggerResponse(400, "Invalid request (e.g., content exceeds 5000 characters)")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> CreateEntry([FromBody] CreateJournalEntryRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Content))
            return BadRequest(new { error = "Content is required" });

        if (request.Content.Length > 500)
            return BadRequest(new { error = "Content cannot exceed 5000 characters" });

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var command = new CreateJournalEntryCommand(userId, request.Content, request.Mood, request.BabyId);
        var result = await _mediator.Send(command);
        
        return CreatedAtAction(nameof(GetEntry), new { id = result.Id }, result);
    }

    [HttpGet("entries")]
    [SwaggerOperation(
        Summary = "Get journal entries",
        Description = "Retrieves journal entries for the authenticated user with optional date range filtering. Includes sentiment analysis results.",
        Tags = new[] { "Journal" }
    )]
    [SwaggerResponse(200, "Journal entries retrieved successfully", typeof(List<JournalEntryDto>))]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> GetEntries(
        [FromQuery, SwaggerParameter("Start date for filtering (optional)")] DateTime? startDate,
        [FromQuery, SwaggerParameter("End date for filtering (optional)")] DateTime? endDate)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var query = new GetJournalEntriesQuery(userId, startDate, endDate);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("entries/{id}")]
    [SwaggerOperation(
        Summary = "Get journal entry by ID",
        Description = "Retrieves a specific journal entry by its ID with sentiment analysis results",
        Tags = new[] { "Journal" }
    )]
    [SwaggerResponse(200, "Journal entry retrieved successfully", typeof(JournalEntryDto))]
    [SwaggerResponse(404, "Journal entry not found")]
    [SwaggerResponse(401, "Unauthorized - JWT token required")]
    public async Task<IActionResult> GetEntry([SwaggerParameter("Journal entry ID")] string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return BadRequest(new { error = "Entry ID is required" });

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var query = new GetJournalEntriesQuery(userId, null, null);
        var entries = await _mediator.Send(query);
        var entry = entries.FirstOrDefault(e => e.Id == id);

        return entry != null ? Ok(entry) : NotFound(new { error = "Journal entry not found" });
    }
}

public class CreateJournalEntryRequest
{
    [SwaggerSchema("Journal entry content (max 5000 characters)")]
    public string Content { get; set; } = string.Empty;

    [SwaggerSchema("Current mood (e.g., happy, anxious, tired, overwhelmed)")]
    public string Mood { get; set; } = string.Empty;

    [SwaggerSchema("Baby profile ID")]
    public string BabyId { get; set; } = string.Empty;
}
