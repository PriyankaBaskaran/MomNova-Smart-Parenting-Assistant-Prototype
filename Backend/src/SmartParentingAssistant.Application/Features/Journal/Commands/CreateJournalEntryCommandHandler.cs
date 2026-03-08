using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Features.Journal.Commands;

public class CreateJournalEntryCommandHandler : IRequestHandler<CreateJournalEntryCommand, JournalEntryDto>
{
    private readonly IJournalRepository _journalRepository;
    private readonly ISentimentAnalysisService _sentimentService;
    private readonly IRedFlagDetectionService _redFlagService;

    public CreateJournalEntryCommandHandler(
        IJournalRepository journalRepository,
        ISentimentAnalysisService sentimentService,
        IRedFlagDetectionService redFlagService)
    {
        _journalRepository = journalRepository;
        _sentimentService = sentimentService;
        _redFlagService = redFlagService;
    }

    public async Task<JournalEntryDto> Handle(CreateJournalEntryCommand request, CancellationToken cancellationToken)
    {
        if (request.Content.Length > 5000)
            throw new ArgumentException("Journal entry cannot exceed 5000 characters");

        var sentimentResult = await _sentimentService.AnalyzeAsync(request.Content);

        var entry = new JournalEntry
        {
            Id = Guid.NewGuid().ToString(),
            UserId = request.UserId,
            Content = request.Content,
            Mood = request.Mood,
            BabyId = request.BabyId,
            Sentiment = sentimentResult.Sentiment,
            SentimentScores = sentimentResult.Scores,
            ConfidenceScore = sentimentResult.Confidence,
            Language = sentimentResult.Language,
            Timestamp = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds() + Random.Shared.Next(0, 1000),
            CreatedAt = DateTime.UtcNow
        };

        await _journalRepository.CreateAsync(entry);

        var redFlagResult = await _redFlagService.DetectAsync(request.Content, sentimentResult);

        return new JournalEntryDto
        {
            Id = entry.Id,
            Content = entry.Content,
            Mood = entry.Mood,
            Sentiment = entry.Sentiment,
            SentimentScores = entry.SentimentScores,
            ConfidenceScore = entry.ConfidenceScore,
            Language = entry.Language,
            CreatedAt = entry.CreatedAt,
            HasRedFlags = redFlagResult.IsRedFlag,
            EmergencyResources = redFlagResult.EmergencyResources
        };
    }
}
