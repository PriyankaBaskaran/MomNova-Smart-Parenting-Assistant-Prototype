using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.DTOs;

public class JournalEntryDto
{
    public string Id { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Mood { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public SentimentScores SentimentScores { get; set; } = new();
    public float ConfidenceScore { get; set; }
    public string Language { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public bool HasRedFlags { get; set; }
    public List<EmergencyResource>? EmergencyResources { get; set; }
}
