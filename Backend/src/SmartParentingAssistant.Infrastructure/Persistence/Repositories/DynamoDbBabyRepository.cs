using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.Persistence.Repositories;

public class DynamoDbBabyRepository : IBabyRepository
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private const string TableName = "SmartParenting_BabyProfiles";

    public DynamoDbBabyRepository(IAmazonDynamoDB dynamoDb)
    {
        _dynamoDb = dynamoDb;
    }

    public async Task<BabyProfile?> GetByIdAsync(string id)
    {
        var request = new GetItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
            {
                { "Id", new AttributeValue { S = id } }
            }
        };

        var response = await _dynamoDb.GetItemAsync(request);

        if (!response.IsItemSet)
            return null;

        return MapFromDynamoDB(response.Item);
    }

    public async Task<List<BabyProfile>> GetByUserIdAsync(string userId)
    {
        var request = new QueryRequest
        {
            TableName = TableName,
            IndexName = "userId-index",
            KeyConditionExpression = "UserId = :userId",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":userId", new AttributeValue { S = userId } }
            }
        };

        var response = await _dynamoDb.QueryAsync(request);
        return response.Items.Select(MapFromDynamoDB).ToList();
    }

    public async Task<BabyProfile> AddAsync(BabyProfile baby)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            { "Id", new AttributeValue { S = baby.Id } },
            { "UserId", new AttributeValue { S = baby.UserId } },
            { "Name", new AttributeValue { S = baby.Name } },
            { "DateOfBirth", new AttributeValue { S = baby.DateOfBirth.ToString("O") } },
            { "Gender", new AttributeValue { S = baby.Gender } },
            { "FeedingType", new AttributeValue { S = baby.FeedingType } }
        };

        if (!string.IsNullOrEmpty(baby.Notes))
        {
            item.Add("Notes", new AttributeValue { S = baby.Notes });
        }

        var request = new PutItemRequest
        {
            TableName = TableName,
            Item = item
        };

        await _dynamoDb.PutItemAsync(request);
        return baby;
    }

    private static BabyProfile MapFromDynamoDB(Dictionary<string, AttributeValue> item)
    {
        return new BabyProfile
        {
            Id = item["Id"].S,
            UserId = item["UserId"].S,
            Name = item["Name"].S,
            DateOfBirth = DateTime.Parse(item["DateOfBirth"].S),
            Gender = item["Gender"].S,
            FeedingType = item["FeedingType"].S,
            Notes = item.ContainsKey("Notes") ? item["Notes"].S : null
        };
    }
}
