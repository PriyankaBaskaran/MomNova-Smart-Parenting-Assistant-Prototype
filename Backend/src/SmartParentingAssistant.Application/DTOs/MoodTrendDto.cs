namespace SmartParentingAssistant.Application.DTOs;

public class MoodTrendDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<MoodDataPoint> DataPoints { get; set; } = new();
    public float AverageSentiment { get; set; }
    public string Trend { get; set; } = string.Empty;
    public bool HasConcerningPattern { get; set; }
}

public class MoodDataPoint
{
    public string Date { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public float Score { get; set; }
    public int EntryCount { get; set; }
}
