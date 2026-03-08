# Design Document: AWS AI Integration MVP

## Executive Summary

This design document outlines the technical implementation for migrating the Smart Parenting Assistant from Azure services to AWS services for the AWS AI for Bharat Hackathon. The MVP focuses on integrating Amazon Bedrock (Claude 3 Sonnet) for AI advice generation, Amazon Comprehend for multilingual sentiment analysis, DynamoDB for data persistence, and CloudWatch for monitoring. The design emphasizes rapid implementation within a 6-day timeline while maintaining code quality and demonstrating AWS AI capabilities for maternal mental health support.

### Key Design Decisions
- **Amazon Bedrock Integration**: Claude 3 Sonnet for culturally-intelligent advice generation
- **Amazon Comprehend**: Multilingual sentiment analysis (English, Hindi, Hinglish)
- **DynamoDB**: NoSQL database with on-demand scaling for user data
- **Semantic Kernel**: AI orchestration framework for prompt management
- **Clean Architecture**: Maintain existing 4-layer separation
- **CQRS Pattern**: Continue using MediatR for command/query separation
- **Simple Authentication**: JWT-based auth without MFA for MVP speed

---

## Overview

The AWS AI Integration MVP enhances the existing .NET 8 API by replacing Azure services with AWS equivalents and adding new features for maternal mental health support. The system will handle journal entries with automatic sentiment analysis, generate culturally-aware parenting advice, track mood trends, and detect crisis situations requiring immediate intervention.

### Architecture Principles
- Leverage existing Clean Architecture structure
- Minimize changes to Domain and Application layers
- Focus AWS integration in Infrastructure layer
- Use Semantic Kernel for AI orchestration
- Implement graceful degradation for AWS service failures
- Prioritize demo-ready features over production hardening

---

## Architecture

### High-Level Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        API Layer                            │
│  Controllers: Journal, DailyAdvice, Baby, Analytics, Auth  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                   Application Layer                         │
│  Commands: CreateJournalEntry, GenerateAdvice              │
│  Queries: GetJournalEntries, GetMoodTrends                 │
│  Handlers: MediatR command/query handlers                  │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                    Domain Layer                             │
│  Entities: JournalEntry, BabyProfile, DailyAdvice          │
│  Value Objects: SentimentScore, MoodLevel                  │
└─────────────────────────────────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────────────┐
│                 Infrastructure Layer                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Bedrock    │  │  Comprehend  │  │  DynamoDB    │     │
│  │   Service    │  │   Service    │  │  Repository  │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐                       │
│  │  CloudWatch  │  │   Semantic   │                       │
│  │   Service    │  │    Kernel    │                       │
│  └──────────────┘  └──────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```


### Data Flow Architecture

```
User Creates Journal Entry
         ↓
API: POST /api/journal/entries
         ↓
CreateJournalEntryCommand
         ↓
CreateJournalEntryCommandHandler
         ↓
    ┌────┴────┐
    ↓         ↓
Store Entry   Analyze Sentiment
(DynamoDB)    (Comprehend)
    ↓         ↓
    └────┬────┘
         ↓
Update Sentiment History
         ↓
Check for Red Flags
         ↓
Return Response with Sentiment
```

```
User Requests Daily Advice
         ↓
API: GET /api/advice/daily/{babyId}
         ↓
GenerateDailyAdviceQuery
         ↓
GenerateDailyAdviceQueryHandler
         ↓
Fetch Context (Baby, Recent Mood, Location)
         ↓
Load Prompty Template
         ↓
Semantic Kernel Orchestration
         ↓
Amazon Bedrock (Claude 3 Sonnet)
         ↓
Post-process Response
         ↓
Store in DynamoDB
         ↓
Return Advice to User
```

---

## Components and Interfaces

### API Layer Components

#### JournalController
```csharp
[ApiController]
[Route("api/journal")]
[Authorize]
public class JournalController : ControllerBase
{
    private readonly IMediator _mediator;

    [HttpPost("entries")]
    public async Task<ActionResult<JournalEntryDto>> CreateEntry(
        [FromBody] CreateJournalEntryCommand command)
    {
        var result = await _mediator.Send(command);
        return CreatedAtAction(nameof(GetEntry), new { id = result.EntryId }, result);
    }

    [HttpGet("entries")]
    public async Task<ActionResult<List<JournalEntryDto>>> GetEntries(
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate)
    {
        var query = new GetJournalEntriesQuery 
        { 
            UserId = GetUserId(), 
            StartDate = startDate, 
            EndDate = endDate 
        };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("entries/{id}")]
    public async Task<ActionResult<JournalEntryDto>> GetEntry(string id)
    {
        var query = new GetJournalEntryQuery { EntryId = id, UserId = GetUserId() };
        var result = await _mediator.Send(query);
        return result != null ? Ok(result) : NotFound();
    }
}
```

#### AnalyticsController
```csharp
[ApiController]
[Route("api/analytics")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly IMediator _mediator;

    [HttpGet("mood-trends")]
    public async Task<ActionResult<MoodTrendDto>> GetMoodTrends(
        [FromQuery] DateTime startDate,
        [FromQuery] DateTime endDate)
    {
        var query = new GetMoodTrendsQuery 
        { 
            UserId = GetUserId(), 
            StartDate = startDate, 
            EndDate = endDate 
        };
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("sentiment-summary")]
    public async Task<ActionResult<SentimentSummaryDto>> GetSentimentSummary()
    {
        var query = new GetSentimentSummaryQuery { UserId = GetUserId() };
        var result = await _mediator.Send(query);
        return Ok(result);
    }
}
```


### Application Layer Components

#### Commands

```csharp
// CreateJournalEntryCommand.cs
public class CreateJournalEntryCommand : IRequest<JournalEntryDto>
{
    public string UserId { get; set; }
    public string Content { get; set; }
    public string Mood { get; set; }
    public string BabyId { get; set; }
}

// GenerateDailyAdviceCommand.cs
public class GenerateDailyAdviceCommand : IRequest<DailyAdviceDto>
{
    public string UserId { get; set; }
    public string BabyId { get; set; }
}
```

#### Queries

```csharp
// GetJournalEntriesQuery.cs
public class GetJournalEntriesQuery : IRequest<List<JournalEntryDto>>
{
    public string UserId { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

// GetMoodTrendsQuery.cs
public class GetMoodTrendsQuery : IRequest<MoodTrendDto>
{
    public string UserId { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}
```

#### Handlers

```csharp
// CreateJournalEntryCommandHandler.cs
public class CreateJournalEntryCommandHandler 
    : IRequestHandler<CreateJournalEntryCommand, JournalEntryDto>
{
    private readonly IJournalRepository _journalRepository;
    private readonly ISentimentAnalysisService _sentimentService;
    private readonly IRedFlagDetectionService _redFlagService;

    public async Task<JournalEntryDto> Handle(
        CreateJournalEntryCommand request, 
        CancellationToken cancellationToken)
    {
        // 1. Analyze sentiment
        var sentimentResult = await _sentimentService.AnalyzeAsync(request.Content);

        // 2. Create journal entry entity
        var entry = new JournalEntry
        {
            EntryId = Guid.NewGuid().ToString(),
            UserId = request.UserId,
            Content = request.Content,
            Mood = request.Mood,
            BabyId = request.BabyId,
            Sentiment = sentimentResult.Sentiment,
            SentimentScores = sentimentResult.Scores,
            ConfidenceScore = sentimentResult.Confidence,
            Language = sentimentResult.Language,
            Timestamp = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
            CreatedAt = DateTime.UtcNow
        };

        // 3. Store in DynamoDB
        await _journalRepository.CreateAsync(entry);

        // 4. Check for red flags
        var hasRedFlags = await _redFlagService.DetectAsync(request.Content, sentimentResult);

        // 5. Return DTO
        return MapToDto(entry, hasRedFlags);
    }
}
```

### Infrastructure Layer Components

#### Amazon Comprehend Service

```csharp
// ComprehendSentimentService.cs
public class ComprehendSentimentService : ISentimentAnalysisService
{
    private readonly IAmazonComprehend _comprehendClient;
    private readonly ILogger<ComprehendSentimentService> _logger;

    public async Task<SentimentResult> AnalyzeAsync(string text)
    {
        try
        {
            // Detect language first
            var detectLanguageRequest = new DetectDominantLanguageRequest
            {
                Text = text
            };
            var languageResponse = await _comprehendClient
                .DetectDominantLanguageAsync(detectLanguageRequest);
            
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
            _logger.LogError(ex, "Comprehend sentiment analysis failed");
            throw;
        }
    }

    private float GetMaxConfidence(SentimentScore scores)
    {
        return Math.Max(
            Math.Max(scores.Positive, scores.Negative),
            Math.Max(scores.Neutral, scores.Mixed)
        );
    }
}
```


#### Amazon Bedrock Service

```csharp
// BedrockChatCompletionService.cs
public class BedrockChatCompletionService : IChatCompletionService
{
    private readonly IAmazonBedrockRuntime _bedrockClient;
    private readonly ILogger<BedrockChatCompletionService> _logger;
    private const string ModelId = "anthropic.claude-3-sonnet-20240229-v1:0";

    public async Task<ChatMessageContent> GetChatMessageContentAsync(
        ChatHistory chatHistory,
        PromptExecutionSettings executionSettings = null,
        Kernel kernel = null,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var settings = BedrockPromptExecutionSettings
                .FromExecutionSettings(executionSettings);

            var requestBody = new
            {
                anthropic_version = "bedrock-2023-05-31",
                max_tokens = settings.MaxTokens ?? 2000,
                temperature = settings.Temperature ?? 0.7,
                messages = ConvertChatHistory(chatHistory)
            };

            var request = new InvokeModelRequest
            {
                ModelId = ModelId,
                ContentType = "application/json",
                Accept = "application/json",
                Body = new MemoryStream(
                    Encoding.UTF8.GetBytes(JsonSerializer.Serialize(requestBody)))
            };

            var response = await _bedrockClient.InvokeModelAsync(request, cancellationToken);
            
            using var reader = new StreamReader(response.Body);
            var responseBody = await reader.ReadToEndAsync();
            var claudeResponse = JsonSerializer.Deserialize<ClaudeResponse>(responseBody);

            return new ChatMessageContent(
                role: AuthorRole.Assistant,
                content: claudeResponse.Content.First().Text);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Bedrock API call failed");
            throw;
        }
    }

    private List<object> ConvertChatHistory(ChatHistory chatHistory)
    {
        return chatHistory
            .Where(m => m.Role != AuthorRole.System)
            .Select(m => new
            {
                role = m.Role.ToString().ToLower(),
                content = m.Content
            })
            .Cast<object>()
            .ToList();
    }
}

// ClaudeResponse.cs (DTO for Bedrock response)
public class ClaudeResponse
{
    [JsonPropertyName("content")]
    public List<ContentBlock> Content { get; set; }

    [JsonPropertyName("stop_reason")]
    public string StopReason { get; set; }
}

public class ContentBlock
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("text")]
    public string Text { get; set; }
}
```

#### Semantic Kernel Service (Enhanced)

```csharp
// SemanticKernelService.cs
public class SemanticKernelService : ISmartParentingKernelService
{
    private readonly Kernel _kernel;
    private readonly IPromptyService _promptyService;
    private readonly ILogger<SemanticKernelService> _logger;

    public SemanticKernelService(
        IChatCompletionService chatCompletionService,
        IPromptyService promptyService,
        ILogger<SemanticKernelService> logger)
    {
        var builder = Kernel.CreateBuilder();
        builder.Services.AddSingleton(chatCompletionService);
        _kernel = builder.Build();
        _promptyService = promptyService;
        _logger = logger;
    }

    public async Task<string> GenerateDailyAdviceAsync(
        string babyName,
        int babyAgeMonths,
        string gender,
        string feedingType,
        string recentMood,
        string location,
        string festivalContext)
    {
        try
        {
            // Load prompty template
            var promptTemplate = await _promptyService
                .LoadPromptAsync("DailyAdvice.prompty");

            // Render with context
            var renderedPrompt = _promptyService.RenderPrompt(promptTemplate, new
            {
                babyName,
                babyAge = $"{babyAgeMonths} months",
                gender,
                feedingType,
                recentMood,
                location,
                festivalContext
            });

            // Execute with Semantic Kernel
            var result = await _kernel.InvokePromptAsync(renderedPrompt);
            
            return result.ToString();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Daily advice generation failed");
            throw;
        }
    }
}
```


#### DynamoDB Repository

```csharp
// JournalRepository.cs
public class JournalRepository : IJournalRepository
{
    private readonly IAmazonDynamoDB _dynamoDbClient;
    private readonly ILogger<JournalRepository> _logger;
    private const string TableName = "SmartParenting_JournalEntries";

    public async Task<JournalEntry> CreateAsync(JournalEntry entry)
    {
        try
        {
            var item = new Dictionary<string, AttributeValue>
            {
                ["userId"] = new AttributeValue { S = entry.UserId },
                ["timestamp"] = new AttributeValue { N = entry.Timestamp.ToString() },
                ["entryId"] = new AttributeValue { S = entry.EntryId },
                ["date"] = new AttributeValue { S = entry.CreatedAt.ToString("yyyy-MM-dd") },
                ["content"] = new AttributeValue { S = entry.Content },
                ["mood"] = new AttributeValue { S = entry.Mood },
                ["sentiment"] = new AttributeValue { S = entry.Sentiment },
                ["sentimentScores"] = new AttributeValue 
                { 
                    M = new Dictionary<string, AttributeValue>
                    {
                        ["positive"] = new AttributeValue { N = entry.SentimentScores.Positive.ToString() },
                        ["negative"] = new AttributeValue { N = entry.SentimentScores.Negative.ToString() },
                        ["neutral"] = new AttributeValue { N = entry.SentimentScores.Neutral.ToString() },
                        ["mixed"] = new AttributeValue { N = entry.SentimentScores.Mixed.ToString() }
                    }
                },
                ["confidenceScore"] = new AttributeValue { N = entry.ConfidenceScore.ToString() },
                ["language"] = new AttributeValue { S = entry.Language },
                ["babyId"] = new AttributeValue { S = entry.BabyId },
                ["createdAt"] = new AttributeValue { S = entry.CreatedAt.ToString("o") }
            };

            var request = new PutItemRequest
            {
                TableName = TableName,
                Item = item
            };

            await _dynamoDbClient.PutItemAsync(request);
            return entry;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to create journal entry in DynamoDB");
            throw;
        }
    }

    public async Task<List<JournalEntry>> GetEntriesAsync(
        string userId, 
        DateTime? startDate, 
        DateTime? endDate)
    {
        try
        {
            var queryRequest = new QueryRequest
            {
                TableName = TableName,
                IndexName = "date-index",
                KeyConditionExpression = "userId = :userId AND #date BETWEEN :startDate AND :endDate",
                ExpressionAttributeNames = new Dictionary<string, string>
                {
                    ["#date"] = "date"
                },
                ExpressionAttributeValues = new Dictionary<string, AttributeValue>
                {
                    [":userId"] = new AttributeValue { S = userId },
                    [":startDate"] = new AttributeValue { S = (startDate ?? DateTime.UtcNow.AddDays(-30)).ToString("yyyy-MM-dd") },
                    [":endDate"] = new AttributeValue { S = (endDate ?? DateTime.UtcNow).ToString("yyyy-MM-dd") }
                },
                ScanIndexForward = false // Newest first
            };

            var response = await _dynamoDbClient.QueryAsync(queryRequest);
            return response.Items.Select(MapToEntity).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to query journal entries from DynamoDB");
            throw;
        }
    }

    private JournalEntry MapToEntity(Dictionary<string, AttributeValue> item)
    {
        return new JournalEntry
        {
            EntryId = item["entryId"].S,
            UserId = item["userId"].S,
            Content = item["content"].S,
            Mood = item["mood"].S,
            Sentiment = item["sentiment"].S,
            SentimentScores = new SentimentScores
            {
                Positive = float.Parse(item["sentimentScores"].M["positive"].N),
                Negative = float.Parse(item["sentimentScores"].M["negative"].N),
                Neutral = float.Parse(item["sentimentScores"].M["neutral"].N),
                Mixed = float.Parse(item["sentimentScores"].M["mixed"].N)
            },
            ConfidenceScore = float.Parse(item["confidenceScore"].N),
            Language = item["language"].S,
            BabyId = item["babyId"].S,
            Timestamp = long.Parse(item["timestamp"].N),
            CreatedAt = DateTime.Parse(item["createdAt"].S)
        };
    }
}
```


#### Red Flag Detection Service

```csharp
// RedFlagDetectionService.cs
public class RedFlagDetectionService : IRedFlagDetectionService
{
    private readonly ILogger<RedFlagDetectionService> _logger;
    private readonly HashSet<string> _crisisKeywords;

    public RedFlagDetectionService(ILogger<RedFlagDetectionService> logger)
    {
        _logger = logger;
        _crisisKeywords = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
        {
            // English
            "suicide", "kill myself", "end my life", "want to die", "harm myself",
            "can't go on", "no point living", "better off dead", "hurt my baby",
            
            // Hindi (transliterated)
            "marna chahti", "jaan dena", "khud ko nuksan",
            
            // Hinglish
            "mar jaana chahti", "zindagi khatam"
        };
    }

    public async Task<RedFlagResult> DetectAsync(string text, SentimentResult sentiment)
    {
        var hasKeywords = _crisisKeywords.Any(keyword => 
            text.Contains(keyword, StringComparison.OrdinalIgnoreCase));

        var isSevereNegative = sentiment.Sentiment == "NEGATIVE" 
            && sentiment.Confidence > 0.9f;

        var isRedFlag = hasKeywords || isSevereNegative;

        if (isRedFlag)
        {
            _logger.LogWarning(
                "Red flag detected. Keywords: {HasKeywords}, Severe: {IsSevere}", 
                hasKeywords, 
                isSevereNegative);
        }

        return new RedFlagResult
        {
            IsRedFlag = isRedFlag,
            HasCrisisKeywords = hasKeywords,
            IsSevereNegative = isSevereNegative,
            EmergencyResources = isRedFlag ? GetEmergencyResources() : null
        };
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
```

#### Cultural Intelligence Service

```csharp
// CulturalIntelligenceService.cs
public class CulturalIntelligenceService : ICulturalIntelligenceService
{
    private readonly Dictionary<string, List<Festival>> _festivalCalendar;

    public CulturalIntelligenceService()
    {
        _festivalCalendar = new Dictionary<string, List<Festival>>
        {
            ["2025"] = new List<Festival>
            {
                new Festival { Name = "Makar Sankranti", Date = new DateTime(2025, 1, 14), Region = "All India" },
                new Festival { Name = "Pongal", Date = new DateTime(2025, 1, 15), Region = "South India" },
                new Festival { Name = "Holi", Date = new DateTime(2025, 3, 14), Region = "North India" },
                new Festival { Name = "Eid ul-Fitr", Date = new DateTime(2025, 3, 31), Region = "All India" },
                new Festival { Name = "Diwali", Date = new DateTime(2025, 10, 20), Region = "All India" }
            }
        };
    }

    public string GetFestivalContext(string location)
    {
        var today = DateTime.UtcNow;
        var year = today.Year.ToString();

        if (!_festivalCalendar.ContainsKey(year))
            return "No upcoming festivals";

        var upcomingFestivals = _festivalCalendar[year]
            .Where(f => f.Date >= today && f.Date <= today.AddDays(14))
            .Where(f => f.Region == "All India" || location.Contains(f.Region.Replace(" India", "")))
            .ToList();

        if (!upcomingFestivals.Any())
            return "No upcoming festivals";

        var festival = upcomingFestivals.First();
        var daysUntil = (festival.Date - today).Days;

        return daysUntil == 0 
            ? $"Today is {festival.Name}" 
            : $"{festival.Name} in {daysUntil} days";
    }
}
```


#### CloudWatch Logging Service

```csharp
// CloudWatchService.cs
public class CloudWatchService : ICloudWatchService
{
    private readonly IAmazonCloudWatch _cloudWatchClient;
    private readonly ILogger<CloudWatchService> _logger;
    private const string Namespace = "SmartParenting/MVP";

    public async Task PutMetricAsync(string metricName, double value, string unit = "Count")
    {
        try
        {
            var request = new PutMetricDataRequest
            {
                Namespace = Namespace,
                MetricData = new List<MetricDatum>
                {
                    new MetricDatum
                    {
                        MetricName = metricName,
                        Value = value,
                        Unit = unit,
                        Timestamp = DateTime.UtcNow
                    }
                }
            };

            await _cloudWatchClient.PutMetricDataAsync(request);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to put CloudWatch metric: {MetricName}", metricName);
        }
    }

    public async Task LogApiCallAsync(string serviceName, bool success, long durationMs)
    {
        await PutMetricAsync($"{serviceName}_Calls", 1, "Count");
        await PutMetricAsync($"{serviceName}_Duration", durationMs, "Milliseconds");
        
        if (!success)
        {
            await PutMetricAsync($"{serviceName}_Errors", 1, "Count");
        }
    }
}
```

---

## Data Models

### Domain Entities

```csharp
// JournalEntry.cs
public class JournalEntry
{
    public string EntryId { get; set; }
    public string UserId { get; set; }
    public string Content { get; set; }
    public string Mood { get; set; }
    public string BabyId { get; set; }
    public string Sentiment { get; set; } // POSITIVE, NEGATIVE, NEUTRAL, MIXED
    public SentimentScores SentimentScores { get; set; }
    public float ConfidenceScore { get; set; }
    public string Language { get; set; }
    public long Timestamp { get; set; }
    public DateTime CreatedAt { get; set; }
}

// SentimentScores.cs (Value Object)
public class SentimentScores
{
    public float Positive { get; set; }
    public float Negative { get; set; }
    public float Neutral { get; set; }
    public float Mixed { get; set; }
}

// DailyAdvice.cs (Enhanced)
public class DailyAdvice
{
    public string AdviceId { get; set; }
    public string UserId { get; set; }
    public string BabyId { get; set; }
    public string Date { get; set; }
    public string AdviceText { get; set; }
    public string FestivalContext { get; set; }
    public DateTime GeneratedAt { get; set; }
    public bool Read { get; set; }
}

// SentimentHistory.cs
public class SentimentHistory
{
    public string UserId { get; set; }
    public string Date { get; set; }
    public string AggregatedSentiment { get; set; }
    public float AverageScore { get; set; }
    public int EntryCount { get; set; }
    public string DominantMood { get; set; }
    public bool ConcerningPattern { get; set; }
}
```

### DTOs

```csharp
// JournalEntryDto.cs
public class JournalEntryDto
{
    public string EntryId { get; set; }
    public string Content { get; set; }
    public string Mood { get; set; }
    public string Sentiment { get; set; }
    public SentimentScoresDto SentimentScores { get; set; }
    public float ConfidenceScore { get; set; }
    public string Language { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool HasRedFlags { get; set; }
    public List<EmergencyResource> EmergencyResources { get; set; }
}

// MoodTrendDto.cs
public class MoodTrendDto
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public List<MoodDataPoint> DataPoints { get; set; }
    public float AverageSentiment { get; set; }
    public string Trend { get; set; } // "improving", "declining", "stable"
    public bool HasConcerningPattern { get; set; }
}

public class MoodDataPoint
{
    public string Date { get; set; }
    public string Sentiment { get; set; }
    public float Score { get; set; }
    public int EntryCount { get; set; }
}

// SentimentSummaryDto.cs
public class SentimentSummaryDto
{
    public int TotalEntries { get; set; }
    public int PositiveDays { get; set; }
    public int NegativeDays { get; set; }
    public int NeutralDays { get; set; }
    public float PositivePercentage { get; set; }
    public float NegativePercentage { get; set; }
    public float NeutralPercentage { get; set; }
    public int ConsecutiveNegativeDays { get; set; }
}
```


### DynamoDB Table Schemas

#### JournalEntries Table

```json
{
  "TableName": "SmartParenting_JournalEntries",
  "KeySchema": [
    { "AttributeName": "userId", "KeyType": "HASH" },
    { "AttributeName": "timestamp", "KeyType": "RANGE" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "userId", "AttributeType": "S" },
    { "AttributeName": "timestamp", "AttributeType": "N" },
    { "AttributeName": "date", "AttributeType": "S" }
  ],
  "GlobalSecondaryIndexes": [
    {
      "IndexName": "date-index",
      "KeySchema": [
        { "AttributeName": "userId", "KeyType": "HASH" },
        { "AttributeName": "date", "KeyType": "RANGE" }
      ],
      "Projection": { "ProjectionType": "ALL" }
    }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

#### SentimentHistory Table

```json
{
  "TableName": "SmartParenting_SentimentHistory",
  "KeySchema": [
    { "AttributeName": "userId", "KeyType": "HASH" },
    { "AttributeName": "date", "KeyType": "RANGE" }
  ],
  "AttributeDefinitions": [
    { "AttributeName": "userId", "AttributeType": "S" },
    { "AttributeName": "date", "AttributeType": "S" }
  ],
  "BillingMode": "PAY_PER_REQUEST"
}
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property Reflection

After analyzing all acceptance criteria, I've identified the following consolidations to eliminate redundancy:

**Consolidations:**
- Properties 1.1, 1.2, 1.3 (language-specific sentiment analysis) → Combined into Property 1 (multilingual sentiment analysis)
- Properties 3.3, 3.4 (journal entry retrieval with sentiment) → Combined into Property 3 (journal entry completeness)
- Properties 8.1, 8.5 (DynamoDB userId filtering) → Combined into Property 11 (data isolation)
- Properties 9.1, 9.2, 9.3, 9.5 (JWT operations) → Combined into Property 13 (authentication round-trip)
- Properties 10.1, 10.2, 10.3, 10.4 (CloudWatch logging) → Combined into Property 15 (comprehensive logging)

**Removed as redundant:**
- Property 7.3 (baby age retrieval) is implied by Property 7.5 (age calculation)
- Property 8.3 (sentiment aggregation storage) is covered by Property 4 (mood trend generation)

### Correctness Properties

#### Property 1: Multilingual Sentiment Analysis
*For any* journal entry text in English, Hindi, or Hinglish, when analyzed by the Sentiment_Analyzer, the system should return sentiment scores (positive, negative, neutral, mixed) with language detection and confidence level.

**Validates: Requirements 1.1, 1.2, 1.3**

#### Property 2: Sentiment Data Persistence
*For any* completed sentiment analysis, when the journal entry is stored, the entry should contain sentiment type, sentiment scores, confidence level, and detected language.

**Validates: Requirements 1.4**

#### Property 3: Journal Entry Completeness
*For any* journal entry retrieval, the returned entry should include all required fields (content, timestamp, userId, sentiment type, sentiment scores, confidence level) and entries should be sorted by date descending.

**Validates: Requirements 3.3, 3.4**

#### Property 4: Mood Trend Generation
*For any* user with 7 or more days of mood data, when mood trends are requested, the system should generate daily average sentiment scores, identify concerning patterns (3+ consecutive negative days), and provide weekly/monthly summaries.

**Validates: Requirements 4.1, 4.2, 4.3, 4.4**

#### Property 5: Sentiment Distribution Calculation
*For any* sentiment summary, the percentages of positive, negative, and neutral days should sum to 100% (within floating-point tolerance).

**Validates: Requirements 4.5**

#### Property 6: Crisis Keyword Detection
*For any* journal entry text containing crisis keywords from the configured list, the Red_Flag_Detection should trigger and return emergency resources.

**Validates: Requirements 5.1**

#### Property 7: High-Confidence Negative Sentiment Detection
*For any* sentiment analysis result with NEGATIVE sentiment and confidence above 0.9, the Red_Flag_Detection should evaluate for crisis indicators.

**Validates: Requirements 5.2**

#### Property 8: Red Flag Response Completeness
*For any* triggered red flag, the response should include emergency mental health resources with helpline numbers.

**Validates: Requirements 5.3**

#### Property 9: Temporal Red Flag Escalation
*For any* sequence of multiple red flags within a 24-hour window, the system should escalate support recommendations.

**Validates: Requirements 5.4**

#### Property 10: Baby Profile Data Persistence
*For any* baby profile creation or update, all required fields (name, dateOfBirth, gender, feedingType) should be persisted in DynamoDB with timestamp tracking.

**Validates: Requirements 7.1, 7.2**

#### Property 11: Data Isolation by User
*For any* DynamoDB query operation, the query should be filtered by the authenticated userId to ensure data isolation.

**Validates: Requirements 8.1, 8.5**

#### Property 12: DynamoDB GSI Usage for Date Queries
*For any* journal entry date-range query, the system should use the DynamoDB Global Secondary Index (date-index) for efficient retrieval.

**Validates: Requirements 8.2**

#### Property 13: Authentication Round-Trip
*For any* user registration followed by login, the system should hash the password on registration, return a JWT on successful login, and the JWT should contain the userId in claims.

**Validates: Requirements 9.1, 9.2, 9.5**

#### Property 14: JWT Validation and Extraction
*For any* authenticated API request, the system should validate the JWT token and extract the userId for authorization.

**Validates: Requirements 9.3**

#### Property 15: Comprehensive Logging
*For any* API request, error occurrence, or AI service call, the system should log appropriate details to CloudWatch (request info for API calls, stack traces for errors, metrics for AI calls).

**Validates: Requirements 10.1, 10.2, 10.3, 10.4**

#### Property 16: Journal Entry Character Limit
*For any* journal entry submission, entries up to 5000 characters should be accepted, and entries exceeding 5000 characters should be rejected with validation error.

**Validates: Requirements 3.5**

#### Property 17: Automatic Sentiment Analysis Trigger
*For any* journal entry creation, sentiment analysis using Amazon Comprehend should be automatically triggered.

**Validates: Requirements 3.2**

#### Property 18: Baby Age Calculation
*For any* baby profile with a date of birth, the system should automatically calculate the baby's age in months based on the current date.

**Validates: Requirements 7.5**

#### Property 19: Multi-Profile Baby Selection
*For any* user with multiple baby profiles, the system should allow selection of which baby profile to use for advice generation.

**Validates: Requirements 7.4**

#### Property 20: PII Filtering for AI Services
*For any* AI service call (Bedrock or Comprehend), the system should not send personally identifiable information (email, phone, full name) in the request.

**Validates: Requirements 12.4**

#### Property 21: Generic Authentication Error Messages
*For any* failed authentication attempt, the system should return a generic error message that does not reveal whether the user exists.

**Validates: Requirements 12.5**

#### Property 22: AWS Service Retry Logic
*For any* AWS service call failure (Bedrock, Comprehend, DynamoDB), the system should implement exponential backoff retry logic before failing.

**Validates: Requirements 13.3**

#### Property 23: AWS Service Failure Logging
*For any* AWS service failure, the system should log the failure details to CloudWatch for monitoring.

**Validates: Requirements 13.5**


---

## Error Handling

### Error Handling Strategy

The system implements a multi-layered error handling approach:

1. **API Layer**: Global exception middleware catches unhandled exceptions
2. **Application Layer**: Command/query handlers return Result objects with success/failure states
3. **Infrastructure Layer**: Service-specific error handling with retry logic
4. **AWS Services**: Graceful degradation when services are unavailable

### Exception Handling Patterns

```csharp
// Global Exception Middleware
public class ExceptionHandlingMiddleware
{
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 400;
            await context.Response.WriteAsJsonAsync(new { error = ex.Message });
        }
        catch (NotFoundException ex)
        {
            context.Response.StatusCode = 404;
            await context.Response.WriteAsJsonAsync(new { error = "Resource not found" });
        }
        catch (UnauthorizedException ex)
        {
            context.Response.StatusCode = 401;
            await context.Response.WriteAsJsonAsync(new { error = "Unauthorized" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            context.Response.StatusCode = 500;
            await context.Response.WriteAsJsonAsync(new { error = "Internal server error" });
        }
    }
}
```

### AWS Service Error Handling

```csharp
// Bedrock Error Handling with Fallback
public async Task<string> GenerateAdviceWithFallbackAsync(string babyId)
{
    try
    {
        return await _bedrockService.GenerateAdviceAsync(babyId);
    }
    catch (AmazonBedrockRuntimeException ex)
    {
        _logger.LogWarning(ex, "Bedrock unavailable, using cached advice");
        
        // Fallback to cached advice
        var cachedAdvice = await _cache.GetLastAdviceAsync(babyId);
        if (cachedAdvice != null)
            return cachedAdvice;
        
        // Final fallback
        return "We're experiencing technical difficulties. Please try again later.";
    }
}

// Comprehend Error Handling
public async Task<SentimentResult> AnalyzeWithGracefulDegradationAsync(string text)
{
    try
    {
        return await _comprehendClient.DetectSentimentAsync(text);
    }
    catch (AmazonComprehendException ex)
    {
        _logger.LogWarning(ex, "Comprehend unavailable, storing entry without sentiment");
        
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
```

### Retry Configuration

```csharp
// Exponential Backoff Retry Policy
public class AwsRetryPolicy
{
    public static async Task<T> ExecuteWithRetryAsync<T>(
        Func<Task<T>> operation,
        int maxRetries = 3)
    {
        for (int attempt = 0; attempt <= maxRetries; attempt++)
        {
            try
            {
                return await operation();
            }
            catch (Exception ex) when (attempt < maxRetries && IsTransientError(ex))
            {
                var delay = TimeSpan.FromSeconds(Math.Pow(2, attempt));
                await Task.Delay(delay);
            }
        }
        
        throw new Exception("Max retries exceeded");
    }

    private static bool IsTransientError(Exception ex)
    {
        return ex is AmazonServiceException serviceEx 
            && (serviceEx.StatusCode == System.Net.HttpStatusCode.ServiceUnavailable
                || serviceEx.StatusCode == System.Net.HttpStatusCode.TooManyRequests);
    }
}
```

---

## Testing Strategy

### Testing Approach

The MVP testing strategy balances comprehensive coverage with the 6-day timeline constraint. We employ both unit tests and property-based tests to ensure correctness while maintaining development velocity.

### Unit Testing

**Focus Areas:**
- Specific examples demonstrating correct behavior
- Edge cases (empty inputs, boundary values)
- Error conditions and exception handling
- Integration points between components

**Unit Test Examples:**

```csharp
// Example: Journal Entry Creation
[Fact]
public async Task CreateJournalEntry_WithValidInput_ReturnsEntryWithSentiment()
{
    // Arrange
    var command = new CreateJournalEntryCommand
    {
        UserId = "user123",
        Content = "Baby slept well tonight!",
        Mood = "happy",
        BabyId = "baby456"
    };

    // Act
    var result = await _handler.Handle(command, CancellationToken.None);

    // Assert
    Assert.NotNull(result);
    Assert.Equal("user123", result.UserId);
    Assert.NotNull(result.Sentiment);
    Assert.InRange(result.ConfidenceScore, 0f, 1f);
}

// Example: Red Flag Detection
[Fact]
public async Task DetectRedFlags_WithCrisisKeyword_TriggersRedFlag()
{
    // Arrange
    var text = "I can't go on anymore";
    var sentiment = new SentimentResult { Sentiment = "NEGATIVE", Confidence = 0.95f };

    // Act
    var result = await _redFlagService.DetectAsync(text, sentiment);

    // Assert
    Assert.True(result.IsRedFlag);
    Assert.True(result.HasCrisisKeywords);
    Assert.NotEmpty(result.EmergencyResources);
}
```

### Property-Based Testing

**Configuration:**
- Minimum 100 iterations per property test
- Use appropriate PBT library for .NET (FsCheck or CsCheck)
- Each test references its design document property

**Property Test Examples:**

```csharp
// Feature: aws-ai-integration, Property 1: Multilingual Sentiment Analysis
[Property(Arbitrary = new[] { typeof(JournalTextGenerator) })]
public Property SentimentAnalysis_ForAnyLanguage_ReturnsSentimentScores(string text, string language)
{
    return Prop.ForAll(
        Arb.From(GenerateJournalText(language)),
        async (journalText) =>
        {
            // Act
            var result = await _sentimentService.AnalyzeAsync(journalText);

            // Assert
            return result.Scores != null
                && result.Scores.Positive >= 0 && result.Scores.Positive <= 1
                && result.Scores.Negative >= 0 && result.Scores.Negative <= 1
                && result.Scores.Neutral >= 0 && result.Scores.Neutral <= 1
                && result.Scores.Mixed >= 0 && result.Scores.Mixed <= 1
                && result.Confidence >= 0 && result.Confidence <= 1;
        });
}

// Feature: aws-ai-integration, Property 5: Sentiment Distribution Calculation
[Property]
public Property SentimentDistribution_ForAnySummary_SumsTo100Percent()
{
    return Prop.ForAll(
        GenerateSentimentHistory(),
        (history) =>
        {
            // Act
            var summary = _analyticsService.CalculateSentimentSummary(history);

            // Assert
            var total = summary.PositivePercentage 
                + summary.NegativePercentage 
                + summary.NeutralPercentage;
            return Math.Abs(total - 100.0f) < 0.01f; // Floating-point tolerance
        });
}

// Feature: aws-ai-integration, Property 11: Data Isolation by User
[Property]
public Property DataIsolation_ForAnyQuery_FiltersBy UserId()
{
    return Prop.ForAll(
        GenerateUserId(),
        async (userId) =>
        {
            // Act
            var entries = await _journalRepository.GetEntriesAsync(userId, null, null);

            // Assert
            return entries.All(e => e.UserId == userId);
        });
}

// Feature: aws-ai-integration, Property 16: Journal Entry Character Limit
[Property]
public Property CharacterLimit_ForAnyEntry_EnforcesMaxLength()
{
    return Prop.ForAll(
        Arb.From(Gen.Choose(0, 10000).Select(len => new string('a', len))),
        async (content) =>
        {
            // Arrange
            var command = new CreateJournalEntryCommand { Content = content };

            // Act & Assert
            if (content.Length <= 5000)
            {
                var result = await _handler.Handle(command, CancellationToken.None);
                return result != null;
            }
            else
            {
                await Assert.ThrowsAsync<ValidationException>(
                    () => _handler.Handle(command, CancellationToken.None));
                return true;
            }
        });
}
```

### Test Data Generators

```csharp
// Generator for multilingual journal text
public static class JournalTextGenerator
{
    public static Arbitrary<string> EnglishText() =>
        Arb.From(Gen.Elements(
            "I feel happy today",
            "Baby is sleeping well",
            "Feeling overwhelmed with responsibilities"
        ));

    public static Arbitrary<string> HindiText() =>
        Arb.From(Gen.Elements(
            "आज मैं खुश हूं",
            "बच्चा अच्छी तरह सो रहा है",
            "जिम्मेदारियों से परेशान महसूस कर रही हूं"
        ));

    public static Arbitrary<string> HinglishText() =>
        Arb.From(Gen.Elements(
            "Baby aaj bahut khush hai",
            "Main thodi tired feel kar rahi hoon",
            "Sab kuch theek chal raha hai"
        ));
}
```

### Integration Testing

**Scope for MVP:**
- End-to-end API tests for critical flows
- AWS service integration tests (using LocalStack for local testing)
- Database integration tests with DynamoDB Local

**Example Integration Test:**

```csharp
[Fact]
public async Task EndToEnd_CreateJournalEntry_WithSentimentAnalysis()
{
    // Arrange
    var client = _factory.CreateClient();
    var request = new
    {
        content = "Baby slept through the night!",
        mood = "happy",
        babyId = "baby123"
    };

    // Act
    var response = await client.PostAsJsonAsync("/api/journal/entries", request);

    // Assert
    response.EnsureSuccessStatusCode();
    var result = await response.Content.ReadFromJsonAsync<JournalEntryDto>();
    Assert.NotNull(result.Sentiment);
    Assert.Equal("POSITIVE", result.Sentiment);
}
```

### Test Coverage Goals

- Unit Test Coverage: 70%+ for critical business logic
- Property Test Coverage: All 23 correctness properties implemented
- Integration Test Coverage: All API endpoints with happy path tests
- Manual Testing: Demo scenarios for hackathon presentation

---

## Deployment and Configuration

### AWS Service Configuration

```json
// appsettings.json
{
  "AWS": {
    "Region": "us-east-1",
    "Bedrock": {
      "ModelId": "anthropic.claude-3-sonnet-20240229-v1:0",
      "MaxTokens": 2000,
      "Temperature": 0.7
    },
    "DynamoDB": {
      "TablePrefix": "SmartParenting_",
      "BillingMode": "PAY_PER_REQUEST"
    },
    "CloudWatch": {
      "Namespace": "SmartParenting/MVP",
      "LogGroup": "/aws/smartparenting/api"
    }
  },
  "Authentication": {
    "JwtSecret": "your-secret-key-here",
    "JwtExpirationMinutes": 15
  }
}
```

### Dependency Injection Setup

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

// AWS Services
builder.Services.AddAWSService<IAmazonBedrockRuntime>();
builder.Services.AddAWSService<IAmazonComprehend>();
builder.Services.AddAWSService<IAmazonDynamoDB>();
builder.Services.AddAWSService<IAmazonCloudWatch>();

// Application Services
builder.Services.AddMediatR(cfg => 
    cfg.RegisterServicesFromAssembly(typeof(CreateJournalEntryCommand).Assembly));

// Infrastructure Services
builder.Services.AddSingleton<IChatCompletionService, BedrockChatCompletionService>();
builder.Services.AddScoped<ISentimentAnalysisService, ComprehendSentimentService>();
builder.Services.AddScoped<ISmartParentingKernelService, SemanticKernelService>();
builder.Services.AddScoped<IRedFlagDetectionService, RedFlagDetectionService>();
builder.Services.AddScoped<ICulturalIntelligenceService, CulturalIntelligenceService>();
builder.Services.AddScoped<ICloudWatchService, CloudWatchService>();

// Repositories
builder.Services.AddScoped<IJournalRepository, JournalRepository>();
builder.Services.AddScoped<IBabyRepository, BabyRepository>();
builder.Services.AddScoped<IAdviceRepository, AdviceRepository>();

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Authentication:JwtSecret"])),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };
    });

var app = builder.Build();

// Middleware
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
```

### Environment Variables

```bash
# AWS Credentials (for local development)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1

# Application Settings
JWT_SECRET=your-jwt-secret-key
ASPNETCORE_ENVIRONMENT=Development
```

---

## Implementation Timeline (6 Days)

### Day 1: Foundation
- Set up AWS SDK dependencies
- Configure DynamoDB tables
- Implement basic authentication (JWT)
- Create domain entities and DTOs

### Day 2: Amazon Comprehend Integration
- Implement ComprehendSentimentService
- Create journal entry endpoints
- Add sentiment analysis to journal creation
- Write unit tests for sentiment analysis

### Day 3: Amazon Bedrock Integration
- Implement BedrockChatCompletionService
- Enhance Semantic Kernel service
- Create daily advice endpoints
- Add cultural intelligence service
- Write unit tests for advice generation

### Day 4: Analytics and Red Flags
- Implement mood trend analytics
- Create analytics endpoints
- Implement red flag detection service
- Add emergency resources
- Write unit tests for analytics and red flags

### Day 5: Testing and Refinement
- Write property-based tests for all 23 properties
- Integration testing for critical flows
- Performance testing and optimization
- Bug fixes and refinements

### Day 6: Demo Preparation
- End-to-end testing of demo scenarios
- CloudWatch dashboard setup
- Demo data preparation
- Documentation and presentation materials

---

This design provides a comprehensive technical blueprint for implementing the AWS AI Integration MVP within the 6-day hackathon timeline, focusing on demonstrable AWS AI capabilities for maternal mental health support while maintaining code quality and testability.
