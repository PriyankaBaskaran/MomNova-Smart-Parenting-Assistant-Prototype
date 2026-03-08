using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.Journal.Queries;

public class GetJournalEntriesQueryHandler : IRequestHandler<GetJournalEntriesQuery, List<JournalEntryDto>>
{
    private readonly IJournalRepository _journalRepository;

    public GetJournalEntriesQueryHandler(IJournalRepository journalRepository)
    {
        _journalRepository = journalRepository;
    }

    public async Task<List<JournalEntryDto>> Handle(GetJournalEntriesQuery request, CancellationToken cancellationToken)
    {
        var entries = await _journalRepository.GetEntriesAsync(request.UserId, request.StartDate, request.EndDate);

        return entries.Select(e => new JournalEntryDto
        {
            Id = e.Id,
            Content = e.Content,
            Mood = e.Mood,
            Sentiment = e.Sentiment,
            SentimentScores = e.SentimentScores,
            ConfidenceScore = e.ConfidenceScore,
            Language = e.Language,
            CreatedAt = e.CreatedAt,
            HasRedFlags = false
        }).ToList();
    }
}
