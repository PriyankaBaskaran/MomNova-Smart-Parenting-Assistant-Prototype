using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.Analytics.Queries;

public class GetMoodTrendsQueryHandler : IRequestHandler<GetMoodTrendsQuery, MoodTrendDto>
{
    private readonly IJournalRepository _journalRepository;

    public GetMoodTrendsQueryHandler(IJournalRepository journalRepository)
    {
        _journalRepository = journalRepository;
    }

    public async Task<MoodTrendDto> Handle(GetMoodTrendsQuery request, CancellationToken cancellationToken)
    {
        var entries = await _journalRepository.GetEntriesAsync(request.UserId, request.StartDate, request.EndDate);

        var dataPoints = entries
            .GroupBy(e => e.CreatedAt.Date)
            .Select(g => new MoodDataPoint
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Sentiment = g.First().Sentiment,
                Score = CalculateAverageScore(g.ToList()),
                EntryCount = g.Count()
            })
            .OrderBy(d => d.Date)
            .ToList();

        var avgSentiment = dataPoints.Any() ? dataPoints.Average(d => d.Score) : 0;
        var trend = DetermineTrend(dataPoints);
        var hasConcerningPattern = DetectConcerningPattern(dataPoints);

        return new MoodTrendDto
        {
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            DataPoints = dataPoints,
            AverageSentiment = avgSentiment,
            Trend = trend,
            HasConcerningPattern = hasConcerningPattern
        };
    }

    private float CalculateAverageScore(List<Domain.Entities.JournalEntry> entries)
    {
        return entries.Average(e => e.SentimentScores.Positive - e.SentimentScores.Negative);
    }

    private string DetermineTrend(List<MoodDataPoint> dataPoints)
    {
        if (dataPoints.Count < 2) return "stable";

        var firstHalf = dataPoints.Take(dataPoints.Count / 2).Average(d => d.Score);
        var secondHalf = dataPoints.Skip(dataPoints.Count / 2).Average(d => d.Score);

        if (secondHalf > firstHalf + 0.1) return "improving";
        if (secondHalf < firstHalf - 0.1) return "declining";
        return "stable";
    }

    private bool DetectConcerningPattern(List<MoodDataPoint> dataPoints)
    {
        int consecutiveNegative = 0;
        foreach (var point in dataPoints)
        {
            if (point.Sentiment == "NEGATIVE")
                consecutiveNegative++;
            else
                consecutiveNegative = 0;

            if (consecutiveNegative >= 3)
                return true;
        }
        return false;
    }
}
