using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Logging;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.Persistence.Repositories;

public class DynamoDbUserRepository : IUserRepository
{
    private readonly IAmazonDynamoDB _dynamoDb;
    private readonly ILogger<DynamoDbUserRepository> _logger;
    private const string TableName = "SmartParenting_Users";

    public DynamoDbUserRepository(IAmazonDynamoDB dynamoDb, ILogger<DynamoDbUserRepository> logger)
    {
        _dynamoDb = dynamoDb;
        _logger = logger;
    }

    public async Task<User> CreateAsync(User user)
    {
        var item = new Dictionary<string, AttributeValue>
        {
            ["userId"] = new AttributeValue { S = user.Id },
            ["email"] = new AttributeValue { S = user.Email },
            ["passwordHash"] = new AttributeValue { S = user.PasswordHash },
            ["name"] = new AttributeValue { S = user.Name },
            ["createdAt"] = new AttributeValue { S = user.CreatedAt.ToString("o") }
        };

        if (!string.IsNullOrEmpty(user.Location))
            item["location"] = new AttributeValue { S = user.Location };

        await _dynamoDb.PutItemAsync(new PutItemRequest
        {
            TableName = TableName,
            Item = item
        });

        return user;
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        var response = await _dynamoDb.QueryAsync(new QueryRequest
        {
            TableName = TableName,
            IndexName = "email-index",
            KeyConditionExpression = "email = :email",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":email"] = new AttributeValue { S = email }
            }
        });

        return response.Items.FirstOrDefault() != null ? MapToEntity(response.Items.First()) : null;
    }

    public async Task<User?> GetByIdAsync(string id)
    {
        var response = await _dynamoDb.GetItemAsync(new GetItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
            {
                ["userId"] = new AttributeValue { S = id }
            }
        });

        return response.Item.Any() ? MapToEntity(response.Item) : null;
    }

    public async Task UpdateLastLoginAsync(string userId)
    {
        await _dynamoDb.UpdateItemAsync(new UpdateItemRequest
        {
            TableName = TableName,
            Key = new Dictionary<string, AttributeValue>
            {
                ["userId"] = new AttributeValue { S = userId }
            },
            UpdateExpression = "SET lastLoginAt = :lastLogin",
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                [":lastLogin"] = new AttributeValue { S = DateTime.UtcNow.ToString("o") }
            }
        });
    }

    private User MapToEntity(Dictionary<string, AttributeValue> item)
    {
        return new User
        {
            Id = item["userId"].S,
            Email = item["email"].S,
            PasswordHash = item["passwordHash"].S,
            Name = item["name"].S,
            Location = item.ContainsKey("location") ? item["location"].S : null,
            CreatedAt = DateTime.Parse(item["createdAt"].S),
            LastLoginAt = item.ContainsKey("lastLoginAt") ? DateTime.Parse(item["lastLoginAt"].S) : null
        };
    }
}
