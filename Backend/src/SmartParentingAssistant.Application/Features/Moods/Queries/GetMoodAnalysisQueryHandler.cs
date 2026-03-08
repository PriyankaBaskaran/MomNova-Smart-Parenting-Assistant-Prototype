using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

public class GetMoodAnalysisQueryHandler : IRequestHandler<GetMoodAnalysisQuery, IEnumerable<AnalysisDto>>
{
    private readonly IAnalysisRepository _repo;

    public GetMoodAnalysisQueryHandler(IAnalysisRepository repo)
    {
        _repo = repo;
    }

    public async Task<IEnumerable<AnalysisDto>> Handle(GetMoodAnalysisQuery request, CancellationToken cancellationToken)
    {
        var analyses = await _repo.GetAnalysesByBabyIdAsync(request.BabyId);

        return analyses.Select(a => new AnalysisDto
        {
            BabyId = a.BabyId,
            Sentiment = a.Sentiment,
            Confidence = a.ConfidenceScore,
            Language = a.Language,
            Date = a.Date,
            HasRedFlags = a.HasRedFlags,
            EmergencyResources = null // Historical data, emergency resources not stored
        });
    }
}
