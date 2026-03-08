using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.Tips.Commands;

public class GenerateDailyAdviceWithAssessmentCommandHandler 
    : IRequestHandler<GenerateDailyAdviceWithAssessmentCommand, DailyAdviceWithAssessmentDto>
{
    private readonly IMediator _mediator;
    private readonly IMentalHealthRiskService _mentalHealthService;
    private readonly IBabyRepository _babyRepository;

    public GenerateDailyAdviceWithAssessmentCommandHandler(
        IMediator mediator,
        IMentalHealthRiskService mentalHealthService,
        IBabyRepository babyRepository)
    {
        _mediator = mediator;
        _mentalHealthService = mentalHealthService;
        _babyRepository = babyRepository;
    }

    public async Task<DailyAdviceWithAssessmentDto> Handle(
        GenerateDailyAdviceWithAssessmentCommand request, 
        CancellationToken cancellationToken)
    {
        // Generate daily advice
        var adviceCommand = new GenerateDailyBabyAdviceCommand(request.BabyId);
        var advice = await _mediator.Send(adviceCommand, cancellationToken);

        // Assess mental health risk
        var riskAssessment = await _mentalHealthService.AssessRiskAsync(request.UserId, 14);

        // Generate intervention advice if needed (optional - may fail if payment not set up)
        string? interventionAdvice = null;
        if (riskAssessment.RiskScore >= 30)
        {
            try
            {
                var baby = await _babyRepository.GetByIdAsync(request.BabyId);
                if (baby != null)
                {
                    interventionAdvice = await _mentalHealthService
                        .GenerateInterventionAdviceAsync(riskAssessment, baby);
                }
            }
            catch (Exception)
            {
                // Intervention advice generation failed - continue without it
                interventionAdvice = null;
            }
        }

        return new DailyAdviceWithAssessmentDto
        {
            Advice = advice,
            MentalHealthAssessment = new MentalHealthAssessmentSummary
            {
                RiskLevel = riskAssessment.RiskLevel,
                RiskScore = riskAssessment.RiskScore,
                Summary = riskAssessment.Summary,
                RiskFactors = riskAssessment.RiskFactors,
                Recommendations = riskAssessment.Recommendations,
                RequiresProfessionalHelp = riskAssessment.RequiresProfessionalHelp,
                InterventionAdvice = interventionAdvice
            }
        };
    }
}
