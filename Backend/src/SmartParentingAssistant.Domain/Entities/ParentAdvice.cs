namespace SmartParentingAssistant.Domain.Entities;

public class ParentAdvice
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string BabyId { get; set; } = string.Empty;
    public string Sentiment { get; set; } = string.Empty;
    public string AdviceText { get; set; } = string.Empty;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}