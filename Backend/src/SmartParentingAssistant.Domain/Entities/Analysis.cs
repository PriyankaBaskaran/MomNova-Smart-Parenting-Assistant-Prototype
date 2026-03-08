namespace SmartParentingAssistant.Domain.Entities;

public class Analysis
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string BabyId { get; set; } = string.Empty;
    public string AnalysisText { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
    public string Sentiment { get; set; } = string.Empty;
    public double ConfidenceScore { get; set; }
    public string Language { get; set; } = string.Empty;
    public bool HasRedFlags { get; set; }
}
