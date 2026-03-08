namespace SmartParentingAssistant.Domain.Entities;

public class JournalEntry
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string UserId { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string Mood { get; set; } = string.Empty;
    public string BabyId { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public SentimentScores SentimentScores { get; set; } = new();
    public float ConfidenceScore { get; set; }
    public string Language { get; set; } = string.Empty;
    public long Timestamp { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
