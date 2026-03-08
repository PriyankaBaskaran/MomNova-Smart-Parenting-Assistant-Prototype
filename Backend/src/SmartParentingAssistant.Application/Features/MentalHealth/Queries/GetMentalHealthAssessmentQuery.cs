using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.MentalHealth.Queries;

public record GetMentalHealthAssessmentQuery(string UserId, int DaysToAnalyze = 14) 
    : IRequest<MentalHealthRiskDto>;
