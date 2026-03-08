using Microsoft.Extensions.DependencyInjection;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Infrastructure.AI;

public class SemanticKernelService : ISmartParentingKernelService
{
    private readonly Kernel _kernel;

    public SemanticKernelService(Kernel kernel)
    {
        _kernel = kernel;
    }

    public async Task<ChatMessage> GetChatResponseAsync(string prompt, PromptOptions? options = null)
    {
        var opts = options ?? new PromptOptions();
        
        // Use generic PromptExecutionSettings for Bedrock compatibility
        var settings = new PromptExecutionSettings
        {
            ServiceId = opts.ServiceId,
            ExtensionData = new Dictionary<string, object>
            {
                ["temperature"] = opts.Temperature,
                ["max_tokens"] = opts.MaxTokens
            }
        };

        var chatService = _kernel.Services
            .GetKeyedServices<IChatCompletionService>(opts.ServiceId)
            .FirstOrDefault()
            ?? throw new InvalidOperationException($"ChatCompletionService with ServiceId {opts.ServiceId} not found.");

        var response = await chatService.GetChatMessageContentAsync(prompt, settings, _kernel);

        return new ChatMessage
        {
            Role = ChatMessageRole.Assistant,
            Content = response.Content ?? string.Empty
        };
    }
}