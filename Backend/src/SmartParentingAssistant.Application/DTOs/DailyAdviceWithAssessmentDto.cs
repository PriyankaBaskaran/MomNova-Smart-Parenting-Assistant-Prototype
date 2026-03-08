namespace SmartParentingAssistant.Application.DTOs;

public class DailyAdviceWithAssessmentDto
{
    public string Advice { get; set; } = string.Empty;
    public MentalHealthAssessmentSummary MentalHealthAssessment { get; set; } = new();
}

public class MentalHealthAssessmentSummary
{
    public string RiskLevel { get; set; } = string.Empty;
    public int RiskScore { get; set; }
    public string Summary { get; set; } = string.Empty;
    public List<string> RiskFactors { get; set; } = new();
    public List<string> Recommendations { get; set; } = new();
    public bool RequiresProfessionalHelp { get; set; }
    public string? InterventionAdvice { get; set; }
}
