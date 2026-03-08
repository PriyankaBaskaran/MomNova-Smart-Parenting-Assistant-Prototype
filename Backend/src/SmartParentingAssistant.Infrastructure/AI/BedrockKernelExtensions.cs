using Amazon.BedrockRuntime;
using Amazon.Runtime;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;

namespace SmartParentingAssistant.Infrastructure.AI;

public static class BedrockKernelExtensions
{
    public static IKernelBuilder AddBedrockChatCompletionService(
        this IKernelBuilder builder,
        string modelId,
        string? serviceId = null)
    {
        builder.Services.AddKeyedSingleton<IChatCompletionService>(serviceId, (sp, key) =>
        {
            var config = sp.GetRequiredService<IConfiguration>();
            var credentials = sp.GetService<AWSCredentials>();
            var region = Amazon.RegionEndpoint.GetBySystemName(config["AWS:Region"] ?? "ap-south-1");
            
            var bedrockClient = credentials != null 
                ? new AmazonBedrockRuntimeClient(credentials, region)
                : new AmazonBedrockRuntimeClient(region);
                
            return new BedrockChatService(bedrockClient, modelId);
        });

        return builder;
    }
}
