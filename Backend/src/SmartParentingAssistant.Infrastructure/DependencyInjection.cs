using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Infrastructure.AI;
using SmartParentingAssistant.Infrastructure.Identity;
using SmartParentingAssistant.Infrastructure.Persistence.Repositories;
using Amazon.DynamoDBv2;
using Amazon.Comprehend;
using Amazon.CognitoIdentityProvider;
using Amazon.Runtime;
using Amazon.Runtime.CredentialManagement;

namespace SmartParentingAssistant.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        // Get AWS credentials from DI if available
        var serviceProvider = services.BuildServiceProvider();
        var credentials = serviceProvider.GetService<AWSCredentials>();
        
        // Configure AWS options
        var awsOptions = config.GetAWSOptions();
        if (credentials != null)
        {
            awsOptions.Credentials = credentials;
        }
        
        // AWS Services with explicit credentials
        services.AddAWSService<IAmazonDynamoDB>(awsOptions);
        services.AddAWSService<IAmazonComprehend>(awsOptions);
        services.AddAWSService<IAmazonCognitoIdentityProvider>(awsOptions);

        // Semantic Kernel with AWS Bedrock
        services.AddSingleton<Kernel>(sp =>
        {
            var credentials = sp.GetService<AWSCredentials>();
            var region = Amazon.RegionEndpoint.GetBySystemName(config["AWS:Region"] ?? "ap-south-1");
            var modelId = config["AWS:BedrockModelId"] ?? "anthropic.claude-3-sonnet-20240229-v1:0";
            var bearerToken = config["AWS:BearerToken"];
            
            // Set bearer token as environment variable if provided (for DeepSeek)
            if (!string.IsNullOrEmpty(bearerToken))
            {
                Environment.SetEnvironmentVariable("AWS_BEARER_TOKEN_BEDROCK", bearerToken);
            }
            
            var builder = Kernel.CreateBuilder();
            builder.Services.AddKeyedSingleton<IChatCompletionService>("aws-bedrock", (serviceProvider, key) =>
            {
                var bedrockClient = credentials != null 
                    ? new Amazon.BedrockRuntime.AmazonBedrockRuntimeClient(credentials, region)
                    : new Amazon.BedrockRuntime.AmazonBedrockRuntimeClient(region);
                    
                return new BedrockChatService(bedrockClient, modelId);
            });
            
            return builder.Build();
        });

        // Application Services
        services.AddScoped<ISmartParentingKernelService, SemanticKernelService>();
        services.AddScoped<IPromptyService, PromptyService>();
        services.AddScoped<ISentimentAnalysisService, ComprehendSentimentService>();
        services.AddScoped<IRedFlagDetectionService, RedFlagDetectionService>();
        services.AddScoped<IMentalHealthRiskService, MentalHealthRiskService>();
        services.AddScoped<IAuthService, CognitoAuthService>(); // Changed to CognitoAuthService

        // Repositories - DynamoDB
        services.AddScoped<IJournalRepository, DynamoDbJournalRepository>();
        services.AddScoped<IUserRepository, DynamoDbUserRepository>();
        services.AddScoped<IBabyRepository, DynamoDbBabyRepository>(); // Changed to DynamoDB
        services.AddScoped<IAnalysisRepository, DynamoDbAnalysisRepository>(); // Changed to DynamoDB
        services.AddScoped<IAdviceRepository, AdviceRepository>();

        return services;
    }
}
