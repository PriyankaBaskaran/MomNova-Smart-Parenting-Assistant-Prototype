namespace SmartParentingAssistant.Domain.Entities;

public class RedFlagResult
{
    public bool IsRedFlag { get; set; }
    public bool HasCrisisKeywords { get; set; }
    public bool IsSevereNegative { get; set; }
    public List<EmergencyResource>? EmergencyResources { get; set; }
}

public class EmergencyResource
{
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}
