namespace SmartParentingAssistant.Application.DTOs;

public class MentalHealthRiskDto
{
    public string RiskLevel { get; set; } = string.Empty; // Low, Moderate, High, Critical
    public int RiskScore { get; set; } // 0-100
    public string Summary { get; set; } = string.Empty;
    public List<string> RiskFactors { get; set; } = new();
    public List<string> ProtectiveFactors { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public bool RequiresProfessionalHelp { get; set; }
    public int DaysAnalyzed { get; set; }
    public MentalHealthMetrics Metrics { get; set; } = new();
}

public class MentalHealthMetrics
{
    public int TotalEntries { get; set; }
    public int NegativeEntries { get; set; }
    public int RedFlagCount { get; set; }
    public float AverageSentimentScore { get; set; }
    public int ConsecutiveNegativeDays { get; set; }
    public bool HasSleepIssues { get; set; }
    public bool HasSocialIsolation { get; set; }
    public bool HasAnxietyIndicators { get; set; }
}
