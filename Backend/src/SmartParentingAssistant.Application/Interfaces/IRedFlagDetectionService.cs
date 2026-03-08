using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Interfaces;

public interface IRedFlagDetectionService
{
    Task<RedFlagResult> DetectAsync(string text, SentimentResult sentiment);
}
