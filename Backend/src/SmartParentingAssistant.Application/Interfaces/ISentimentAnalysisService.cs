using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Interfaces;

public interface ISentimentAnalysisService
{
    Task<SentimentResult> AnalyzeAsync(string text);
}
