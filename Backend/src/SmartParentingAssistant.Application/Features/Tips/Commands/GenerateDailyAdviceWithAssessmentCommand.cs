using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Tips.Commands;

public record GenerateDailyAdviceWithAssessmentCommand(
    string UserId,
    string BabyId
) : IRequest<DailyAdviceWithAssessmentDto>;
