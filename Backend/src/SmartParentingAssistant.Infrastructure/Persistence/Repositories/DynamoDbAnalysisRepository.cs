using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.Persistence.Repositories;

public class DynamoDbAnalysisRepository : IAnalysisRepository
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private const string TableName = "SmartParenting_MoodAnalysis";

    public DynamoDbAnalysisRepository(IAmazonDynamoDB dynamoDb)
    {
        _dynamoDb = dynamoDb;
    }

    public async Task<Analysis> AddMoodAnalysis(Analysis analysis)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            ["Id"] = new AttributeValue { S = analysis.Id },
            ["BabyId"] = new AttributeValue { S = analysis.BabyId },
            ["AnalysisText"] = new AttributeValue { S = analysis.AnalysisText },
            ["Date"] = new AttributeValue { S = analysis.Date.ToString("yyyy-MM-dd") },
            ["Sentiment"] = new AttributeValue { S = analysis.Sentiment },
            ["ConfidenceScore"] = new AttributeValue { N = analysis.ConfidenceScore.ToString() },
            ["Language"] = new AttributeValue { S = analysis.Language },
            ["HasRedFlags"] = new AttributeValue { BOOL = analysis.HasRedFlags },
            ["CreatedAt"] = new AttributeValue { S = DateTime.UtcNow.ToString("o") }
        };

        var request = new PutItemRequest
        {
            TableName = TableName,
            Item = item
        };

        await _dynamoDb.PutItemAsync(request);
        return analysis;
    }

    public async Task<IEnumerable<Analysis>> GetAnalysesByBabyIdAsync(string babyId)
    {
        var queryRequest = new QueryRequest
        {
            TableName = TableName,
            IndexName = "babyId-index",
            KeyConditionExpression = "BabyId = :babyId",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":babyId"] = new AttributeValue { S = babyId }
            },
            ScanIndexForward = false // Newest first
        };

        var response = await _dynamoDb.QueryAsync(queryRequest);
        return response.Items.Select(MapToEntity).ToList();
    }

    private static Analysis MapToEntity(Dictionary<string, AttributeValue> item)
    {
        return new Analysis
        {
            Id = item["Id"].S,
            BabyId = item["BabyId"].S,
            AnalysisText = item["AnalysisText"].S,
            Date = DateTime.Parse(item["Date"].S),
            Sentiment = item["Sentiment"].S,
            ConfidenceScore = double.Parse(item["ConfidenceScore"].N),
            Language = item.ContainsKey("Language") ? item["Language"].S : "en",
            HasRedFlags = item.ContainsKey("HasRedFlags") && item["HasRedFlags"].BOOL
        };
    }
}
