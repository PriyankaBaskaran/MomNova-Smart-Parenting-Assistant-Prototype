using MediatR;
using SmartParentingAssistant.Application.DTOs;

public class GetMoodAnalysisQuery : IRequest<IEnumerable<AnalysisDto>>
{
    public string BabyId { get; set; } = default!;
}
