using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Logging;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.Persistence.Repositories;

public class DynamoDbJournalRepository : IJournalRepository
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private readonly ILogger<DynamoDbJournalRepository> _logger;
    private const string TableName = "SmartParenting_JournalEntries";

    public DynamoDbJournalRepository(IAmazonDynamoDB dynamoDb, ILogger<DynamoDbJournalRepository> logger)
    {
        _dynamoDb = dynamoDb;
        _logger = logger;
    }

    public async Task<JournalEntry> CreateAsync(JournalEntry entry)
    {
        _logger.LogInformation("Creating journal entry - UserId: {UserId}, Timestamp: {Timestamp}, EntryId: {EntryId}", 
            entry.UserId, entry.Timestamp, entry.Id);

        var item = new Dictionary<string, AttributeValue>
        {
            ["userId"] = new AttributeValue { S = entry.UserId },
            ["timestamp"] = new AttributeValue { N = entry.Timestamp.ToString() },
            ["entryId"] = new AttributeValue { S = entry.Id },
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

        await _dynamoDb.PutItemAsync(new PutItemRequest
        {
            TableName = TableName,
            Item = item
        });

        _logger.LogInformation("Journal entry created successfully");

        return entry;
    }

    public async Task<JournalEntry?> GetByIdAsync(string id, string userId)
    {
        // Use Scan with filter since we don't have the timestamp
        var response = await _dynamoDb.ScanAsync(new ScanRequest
        {
            TableName = TableName,
            FilterExpression = "userId = :userId AND entryId = :entryId",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":userId"] = new AttributeValue { S = userId },
                [":entryId"] = new AttributeValue { S = id }
            },
            Limit = 1
        });

        return response.Items.FirstOrDefault() != null ? MapToEntity(response.Items.First()) : null;
    }

    public async Task<List<JournalEntry>> GetEntriesAsync(string userId, DateTime? startDate, DateTime? endDate)
    {
        try
        {
            // Use the userId-index GSI
            var response = await _dynamoDb.QueryAsync(new QueryRequest
            {
                TableName = TableName,
                IndexName = "userId-index",
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
                ScanIndexForward = false
            });

            return response.Items.Select(MapToEntity).ToList();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error querying journal entries for user {UserId}", userId);
            throw;
        }
    }

    private JournalEntry MapToEntity(Dictionary<string, AttributeValue> item)
    {
        return new JournalEntry
        {
            Id = item["entryId"].S,
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
