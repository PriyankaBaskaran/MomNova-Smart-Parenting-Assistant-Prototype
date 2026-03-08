namespace SmartParentingAssistant.Application.Interfaces;

public interface IAIService
{
    Task<string> GenerateAdviceAsync(string sentiment, string babyInfo, string parentNote);
    Task<string> GenerateBabyAdviceAsync(string babyName, int babyAgeMonths, string gender, string feedingType);

}