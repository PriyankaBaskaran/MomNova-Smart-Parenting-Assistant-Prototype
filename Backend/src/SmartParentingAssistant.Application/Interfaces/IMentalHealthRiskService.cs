using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Interfaces;

public interface IMentalHealthRiskService
{
    Task<MentalHealthRiskDto> AssessRiskAsync(string userId, int daysToAnalyze = 14);
    Task<string> GenerateInterventionAdviceAsync(MentalHealthRiskDto riskAssessment, BabyProfile baby);
}
