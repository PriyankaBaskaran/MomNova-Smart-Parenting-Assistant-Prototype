using Microsoft.Extensions.Logging;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.AI;

public class RedFlagDetectionService : IRedFlagDetectionService
{
    private readonly ILogger<RedFlagDetectionService> _logger;
    private readonly HashSet<string> _crisisKeywords;

    public RedFlagDetectionService(ILogger<RedFlagDetectionService> logger)
    {
        _logger = logger;
        _crisisKeywords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            "suicide", "kill myself", "end my life", "want to die", "harm myself",
            "can't go on", "no point living", "better off dead", "hurt my baby",
            "marna chahti", "jaan dena", "khud ko nuksan",
            "mar jaana chahti", "zindagi khatam"
        };
    }

    public Task<RedFlagResult> DetectAsync(string text, SentimentResult sentiment)
    {
        var hasKeywords = _crisisKeywords.Any(keyword =>
            text.Contains(keyword, StringComparison.OrdinalIgnoreCase));

        var isSevereNegative = sentiment.Sentiment == "NEGATIVE" && sentiment.Confidence > 0.9f;

        var isRedFlag = hasKeywords || isSevereNegative;

        if (isRedFlag)
        {
            _logger.LogWarning(
                "Red flag detected. Keywords: {HasKeywords}, Severe: {IsSevere}",
                hasKeywords,
                isSevereNegative);
        }

        return Task.FromResult(new RedFlagResult
        {
            IsRedFlag = isRedFlag,
            HasCrisisKeywords = hasKeywords,
            IsSevereNegative = isSevereNegative,
            EmergencyResources = isRedFlag ? GetEmergencyResources() : null
        });
    }

    private List<EmergencyResource> GetEmergencyResources()
    {
        return new List<EmergencyResource>
        {
            new EmergencyResource
            {
                Name = "National Mental Health Helpline (India)",
                Phone = "1800-599-0019",
                Description = "24/7 mental health support"
            },
            new EmergencyResource
            {
                Name = "Vandrevala Foundation",
                Phone = "1860-2662-345",
                Description = "Mental health counseling"
            },
            new EmergencyResource
            {
                Name = "iCall Psychosocial Helpline",
                Phone = "9152987821",
                Description = "Professional counseling support"
            }
        };
    }
}
