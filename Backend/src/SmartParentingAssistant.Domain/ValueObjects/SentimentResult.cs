namespace SmartParentingAssistant.Domain.Entities;

public class SentimentResult
{
    public string Sentiment { get; set; } = string.Empty;
    public SentimentScores Scores { get; set; } = new();
    public float Confidence { get; set; }
    public string Language { get; set; } = string.Empty;
}
