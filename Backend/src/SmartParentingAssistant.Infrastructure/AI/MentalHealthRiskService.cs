using Microsoft.Extensions.Logging;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.AI;

public class MentalHealthRiskService : IMentalHealthRiskService
{
    private readonly IJournalRepository _journalRepository;
    private readonly ISmartParentingKernelService _kernelService;
    private readonly ILogger<MentalHealthRiskService> _logger;

    private readonly HashSet<string> _sleepKeywords = new(StringComparer.OrdinalIgnoreCase)
    {
        "can't sleep", "insomnia", "sleepless", "no sleep", "tired", "exhausted",
        "neend nahi", "thak gayi", "sleep deprived"
    };

    private readonly HashSet<string> _isolationKeywords = new(StringComparer.OrdinalIgnoreCase)
    {
        "alone", "lonely", "no one", "isolated", "no help", "no support",
        "akeli", "koi nahi", "lonely feel"
    };

    private readonly HashSet<string> _anxietyKeywords = new(StringComparer.OrdinalIgnoreCase)
    {
        "anxious", "worried", "scared", "fear", "panic", "overwhelmed",
        "tension", "dar lag raha", "ghabra"
    };

    public MentalHealthRiskService(
        IJournalRepository journalRepository,
        ISmartParentingKernelService kernelService,
        ILogger<MentalHealthRiskService> logger)
    {
        _journalRepository = journalRepository;
        _kernelService = kernelService;
        _logger = logger;
    }

    public async Task<MentalHealthRiskDto> AssessRiskAsync(string userId, int daysToAnalyze = 14)
    {
        var startDate = DateTime.UtcNow.AddDays(-daysToAnalyze);
        var entries = await _journalRepository.GetEntriesAsync(userId, startDate, DateTime.UtcNow);

        var metrics = CalculateMetrics(entries.ToList());
        var riskScore = CalculateRiskScore(metrics);
        var riskLevel = DetermineRiskLevel(riskScore);

        return new MentalHealthRiskDto
        {
            RiskLevel = riskLevel,
            RiskScore = riskScore,
            Summary = GenerateSummary(riskLevel, metrics),
            RiskFactors = IdentifyRiskFactors(metrics),
            ProtectiveFactors = IdentifyProtectiveFactors(metrics),
            Recommendations = GenerateRecommendations(riskLevel, metrics),
            RequiresProfessionalHelp = riskScore >= 70,
            DaysAnalyzed = daysToAnalyze,
            Metrics = metrics
        };
    }

    private MentalHealthMetrics CalculateMetrics(List<JournalEntry> entries)
    {
        var metrics = new MentalHealthMetrics
        {
            TotalEntries = entries.Count
        };

        if (entries.Count == 0) return metrics;

        metrics.NegativeEntries = entries.Count(e => e.Sentiment == "NEGATIVE");
        metrics.RedFlagCount = entries.Count(e => 
            e.Content.Contains("suicide", StringComparison.OrdinalIgnoreCase) ||
            e.Content.Contains("harm", StringComparison.OrdinalIgnoreCase));

        var sentimentScores = entries.Select(e => 
            e.SentimentScores.Positive - e.SentimentScores.Negative).ToList();
        metrics.AverageSentimentScore = sentimentScores.Any() ? sentimentScores.Average() : 0;

        metrics.ConsecutiveNegativeDays = CalculateConsecutiveNegativeDays(entries);
        metrics.HasSleepIssues = entries.Any(e => _sleepKeywords.Any(k => 
            e.Content.Contains(k, StringComparison.OrdinalIgnoreCase)));
        metrics.HasSocialIsolation = entries.Any(e => _isolationKeywords.Any(k => 
            e.Content.Contains(k, StringComparison.OrdinalIgnoreCase)));
        metrics.HasAnxietyIndicators = entries.Any(e => _anxietyKeywords.Any(k => 
            e.Content.Contains(k, StringComparison.OrdinalIgnoreCase)));

        return metrics;
    }

    private int CalculateConsecutiveNegativeDays(List<JournalEntry> entries)
    {
        var sortedEntries = entries.OrderByDescending(e => e.CreatedAt).ToList();
        int consecutive = 0;
        int maxConsecutive = 0;

        foreach (var entry in sortedEntries)
        {
            if (entry.Sentiment == "NEGATIVE")
            {
                consecutive++;
                maxConsecutive = Math.Max(maxConsecutive, consecutive);
            }
            else
            {
                consecutive = 0;
            }
        }

        return maxConsecutive;
    }

    private int CalculateRiskScore(MentalHealthMetrics metrics)
    {
        int score = 0;

        if (metrics.TotalEntries == 0) return 0;

        var negativeRatio = (float)metrics.NegativeEntries / metrics.TotalEntries;
        score += (int)(negativeRatio * 30);

        score += metrics.RedFlagCount * 20;
        score += Math.Min(metrics.ConsecutiveNegativeDays * 5, 20);

        if (metrics.HasSleepIssues) score += 10;
        if (metrics.HasSocialIsolation) score += 15;
        if (metrics.HasAnxietyIndicators) score += 10;

        if (metrics.AverageSentimentScore < -0.5f) score += 15;

        return Math.Min(score, 100);
    }

    private string DetermineRiskLevel(int score)
    {
        return score switch
        {
            >= 70 => "Critical",
            >= 50 => "High",
            >= 30 => "Moderate",
            _ => "Low"
        };
    }

    private string GenerateSummary(string riskLevel, MentalHealthMetrics metrics)
    {
        return riskLevel switch
        {
            "Critical" => $"Based on {metrics.TotalEntries} journal entries, we've detected concerning patterns that require immediate attention.",
            "High" => $"Analysis of {metrics.TotalEntries} entries shows elevated stress levels. Professional support is recommended.",
            "Moderate" => $"Your {metrics.TotalEntries} entries show some challenging moments. Let's focus on self-care strategies.",
            _ => $"Your {metrics.TotalEntries} entries show you're managing well. Keep up the good work!"
        };
    }

    private List<string> IdentifyRiskFactors(MentalHealthMetrics metrics)
    {
        var factors = new List<string>();

        if (metrics.NegativeEntries > metrics.TotalEntries * 0.6)
            factors.Add($"High frequency of negative emotions ({metrics.NegativeEntries}/{metrics.TotalEntries} entries)");
        
        if (metrics.RedFlagCount > 0)
            factors.Add($"Crisis keywords detected in {metrics.RedFlagCount} entries");
        
        if (metrics.ConsecutiveNegativeDays >= 3)
            factors.Add($"{metrics.ConsecutiveNegativeDays} consecutive days of negative mood");
        
        if (metrics.HasSleepIssues)
            factors.Add("Sleep disturbances mentioned");
        
        if (metrics.HasSocialIsolation)
            factors.Add("Feelings of isolation or lack of support");
        
        if (metrics.HasAnxietyIndicators)
            factors.Add("Anxiety or worry patterns detected");

        return factors;
    }

    private List<string> IdentifyProtectiveFactors(MentalHealthMetrics metrics)
    {
        var factors = new List<string>();

        var positiveEntries = metrics.TotalEntries - metrics.NegativeEntries;
        if (positiveEntries > metrics.TotalEntries * 0.4)
            factors.Add($"Regular positive moments ({positiveEntries} positive entries)");
        
        if (metrics.TotalEntries >= 7)
            factors.Add("Consistent journaling habit (good self-awareness)");
        
        if (!metrics.HasSocialIsolation)
            factors.Add("Social connections present");

        return factors;
    }

    private List<string> GenerateRecommendations(string riskLevel, MentalHealthMetrics metrics)
    {
        var recommendations = new List<string>();

        if (riskLevel == "Critical" || riskLevel == "High")
        {
            recommendations.Add("🚨 Please reach out to a mental health professional immediately");
            recommendations.Add("📞 Contact helpline: 1800-599-0019 (National Mental Health)");
            recommendations.Add("👥 Talk to a trusted family member or friend today");
        }

        if (metrics.HasSleepIssues)
        {
            recommendations.Add("😴 Prioritize sleep: Ask family to help with night duties");
            recommendations.Add("💤 Try short naps when baby sleeps");
        }

        if (metrics.HasSocialIsolation)
        {
            recommendations.Add("👭 Connect with other mothers (online or local groups)");
            recommendations.Add("🏠 Accept help from family members");
        }

        if (metrics.HasAnxietyIndicators)
        {
            recommendations.Add("🧘 Try 5-minute breathing exercises daily");
            recommendations.Add("📝 Continue journaling - it helps process emotions");
        }

        recommendations.Add("💚 Practice self-compassion - you're doing your best");
        recommendations.Add("🌟 Celebrate small wins every day");

        return recommendations;
    }

    public async Task<string> GenerateInterventionAdviceAsync(MentalHealthRiskDto riskAssessment, BabyProfile baby)
    {
        var prompt = $@"You are a compassionate maternal mental health counselor with expertise in postpartum care.

MENTAL HEALTH ASSESSMENT:
- Risk Level: {riskAssessment.RiskLevel}
- Risk Score: {riskAssessment.RiskScore}/100
- Days Analyzed: {riskAssessment.DaysAnalyzed}
- Risk Factors: {string.Join(", ", riskAssessment.RiskFactors)}

BABY CONTEXT:
- Baby Name: {baby.Name}
- Baby Age: {(DateTime.UtcNow - baby.DateOfBirth).Days / 30} months old

Generate a warm, supportive message (under 100 words) that:
1. Acknowledges their feelings without judgment
2. Provides 1-2 specific, actionable coping strategies
3. Emphasizes they're not alone
4. Uses culturally sensitive language (Indian context)
5. Includes Hinglish phrases naturally if appropriate

Be empathetic and hopeful. Focus on immediate, practical support.";

        var response = await _kernelService.GetChatResponseAsync(prompt);
        return response.Content;
    }
}
