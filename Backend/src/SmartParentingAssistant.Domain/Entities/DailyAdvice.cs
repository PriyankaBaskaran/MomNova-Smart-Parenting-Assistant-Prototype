namespace SmartParentingAssistant.Domain.Entities;

public class DailyAdvice
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string BabyId { get; set; } = string.Empty;
    public string AdviceText { get; set; } = string.Empty;
    public DateTime Date { get; set; } = DateTime.UtcNow.Date;
}
