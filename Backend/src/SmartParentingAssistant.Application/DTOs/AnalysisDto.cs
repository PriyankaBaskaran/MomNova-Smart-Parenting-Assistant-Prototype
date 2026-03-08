namespace SmartParentingAssistant.Application.DTOs;

public class AnalysisDto
{
    public string BabyId { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public string Language { get; set; } = string.Empty;
    public SentimentScoresDto? SentimentScores { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public bool HasRedFlags { get; set; }
    public List<EmergencyResourceDto>? EmergencyResources { get; set; }
}

public class SentimentScoresDto
{
    public float Positive { get; set; }
    public float Negative { get; set; }
    public float Neutral { get; set; }
    public float Mixed { get; set; }
}

public class EmergencyResourceDto
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
