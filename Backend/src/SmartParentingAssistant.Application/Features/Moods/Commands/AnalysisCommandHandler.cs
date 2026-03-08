using MediatR;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Features.Babies.Commands;

public class AnalysisCommandHandler : IRequestHandler<AnalysisCommand, AnalysisDto>
{
    private readonly IAnalysisRepository _repo;
    private readonly ISentimentAnalysisService _sentimentService;
    private readonly IRedFlagDetectionService _redFlagService;

    public AnalysisCommandHandler(
        IAnalysisRepository repo,
        ISentimentAnalysisService sentimentService,
        IRedFlagDetectionService redFlagService)
    {
        _repo = repo;
        _sentimentService = sentimentService;
        _redFlagService = redFlagService;
    }

    public async Task<AnalysisDto> Handle(AnalysisCommand request, CancellationToken cancellationToken)
    {
        // Analyze sentiment using Amazon Comprehend
        var sentimentResult = await _sentimentService.AnalyzeAsync(request.Text);

        // Check for red flags
        var redFlagResult = await _redFlagService.DetectAsync(request.Text, sentimentResult);

        // Store analysis
        var analysis = new Analysis
        {
            BabyId = request.BabyId,
            AnalysisText = request.Text,
            Date = DateTime.UtcNow.Date,
            Sentiment = sentimentResult.Sentiment.ToLowerInvariant(),
            ConfidenceScore = sentimentResult.Confidence,
            Language = sentimentResult.Language,
            HasRedFlags = redFlagResult.IsRedFlag
        };

        await _repo.AddMoodAnalysis(analysis);

        return new AnalysisDto
        {
            BabyId = request.BabyId,
            Sentiment = sentimentResult.Sentiment.ToLowerInvariant(),
            Confidence = sentimentResult.Confidence,
            Language = sentimentResult.Language,
            SentimentScores = new SentimentScoresDto
            {
                Positive = sentimentResult.Scores.Positive,
                Negative = sentimentResult.Scores.Negative,
                Neutral = sentimentResult.Scores.Neutral,
                Mixed = sentimentResult.Scores.Mixed
            },
            HasRedFlags = redFlagResult.IsRedFlag,
            EmergencyResources = redFlagResult.EmergencyResources?
                .Select(r => new EmergencyResourceDto
                {
                    Name = r.Name,
                    Phone = r.Phone,
                    Description = r.Description
                }).ToList()
        };
    }
}
