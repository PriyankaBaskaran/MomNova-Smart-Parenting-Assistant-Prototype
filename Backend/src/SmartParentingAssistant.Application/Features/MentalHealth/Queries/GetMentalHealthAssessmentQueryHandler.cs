using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.MentalHealth.Queries;

public class GetMentalHealthAssessmentQueryHandler 
    : IRequestHandler<GetMentalHealthAssessmentQuery, MentalHealthRiskDto>
{
    private readonly IMentalHealthRiskService _mentalHealthService;

    public GetMentalHealthAssessmentQueryHandler(IMentalHealthRiskService mentalHealthService)
    {
        _mentalHealthService = mentalHealthService;
    }

    public async Task<MentalHealthRiskDto> Handle(
        GetMentalHealthAssessmentQuery request, 
        CancellationToken cancellationToken)
    {
        return await _mentalHealthService.AssessRiskAsync(request.UserId, request.DaysToAnalyze);
    }
}
