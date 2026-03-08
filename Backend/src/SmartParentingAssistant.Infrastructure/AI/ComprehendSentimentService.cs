using Amazon.Comprehend;
using Amazon.Comprehend.Model;
using Microsoft.Extensions.Logging;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.AI;

public class ComprehendSentimentService : ISentimentAnalysisService
{
    private readonly IAmazonComprehend _comprehendClient;
    private readonly ILogger<ComprehendSentimentService> _logger;

    public ComprehendSentimentService(
        IAmazonComprehend comprehendClient,
        ILogger<ComprehendSentimentService> logger)
    {
        _comprehendClient = comprehendClient;
        _logger = logger;
    }

    public async Task<SentimentResult> AnalyzeAsync(string text)
    {
        try
        {
            // Detect language first
            var detectLanguageRequest = new DetectDominantLanguageRequest
            {
                Text = text
            };
            var languageResponse = await _comprehendClient.DetectDominantLanguageAsync(detectLanguageRequest);

            var languageCode = languageResponse.Languages
                .OrderByDescending(l => l.Score)
                .First()
                .LanguageCode;

            // Analyze sentiment
            var sentimentRequest = new DetectSentimentRequest
            {
                Text = text,
                LanguageCode = languageCode
            };

            var response = await _comprehendClient.DetectSentimentAsync(sentimentRequest);

            return new SentimentResult
            {
                Sentiment = response.Sentiment.Value,
                Scores = new SentimentScores
                {
                    Positive = response.SentimentScore.Positive,
                    Negative = response.SentimentScore.Negative,
                    Neutral = response.SentimentScore.Neutral,
                    Mixed = response.SentimentScore.Mixed
                },
                Confidence = GetMaxConfidence(response.SentimentScore),
                Language = languageCode
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Amazon Comprehend sentiment analysis failed");
            
            // Return neutral sentiment as fallback
            return new SentimentResult
            {
                Sentiment = "NEUTRAL",
                Scores = new SentimentScores { Neutral = 1.0f },
                Confidence = 0.0f,
                Language = "unknown"
            };
        }
    }

    private float GetMaxConfidence(Amazon.Comprehend.Model.SentimentScore scores)
    {
        return Math.Max(
            Math.Max(scores.Positive, scores.Negative),
            Math.Max(scores.Neutral, scores.Mixed)
        );
    }
}
