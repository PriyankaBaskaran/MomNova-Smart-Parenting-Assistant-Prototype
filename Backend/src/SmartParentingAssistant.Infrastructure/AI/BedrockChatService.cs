using Amazon.BedrockRuntime;
using Amazon.BedrockRuntime.Model;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.ChatCompletion;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SmartParentingAssistant.Infrastructure.AI;

public class BedrockChatService : IChatCompletionService
{
    private readonly IAmazonBedrockRuntime _bedrockClient;
    private readonly string _modelId;

    public BedrockChatService(IAmazonBedrockRuntime bedrockClient, string modelId)
    {
        _bedrockClient = bedrockClient;
        _modelId = modelId;
    }

    public IReadOnlyDictionary<string, object?> Attributes => new Dictionary<string, object?>();

    public async Task<IReadOnlyList<ChatMessageContent>> GetChatMessageContentsAsync(
        ChatHistory chatHistory,
        PromptExecutionSettings? executionSettings = null,
        Kernel? kernel = null,
        CancellationToken cancellationToken = default)
    {
        var result = await GetChatMessageContentAsync(chatHistory, executionSettings, kernel, cancellationToken);
        return new List<ChatMessageContent> { result };
    }

    public async Task<ChatMessageContent> GetChatMessageContentAsync(
        ChatHistory chatHistory,
        PromptExecutionSettings? executionSettings = null,
        Kernel? kernel = null,
        CancellationToken cancellationToken = default)
    {
        // Determine model type
        bool isClaudeModel = _modelId.StartsWith("anthropic.", StringComparison.OrdinalIgnoreCase);
        bool isLlamaModel = _modelId.StartsWith("meta.llama", StringComparison.OrdinalIgnoreCase);
        
        object requestBody;
        
        if (isClaudeModel)
        {
            // Claude format
            requestBody = new
            {
                anthropic_version = "bedrock-2023-05-31",
                max_tokens = 2000,
                temperature = 0.7,
                messages = ConvertChatHistory(chatHistory)
            };
        }
        else if (isLlamaModel)
        {
            // Llama format
            var prompt = string.Join("\n", chatHistory.Select(m => $"{m.Role}: {m.Content}"));
            requestBody = new
            {
                prompt = prompt,
                temperature = 0.7,
                max_gen_len = 2000
            };
        }
        else
        {
            // Generic Bedrock format (for Titan, etc.)
            var prompt = string.Join("\n", chatHistory.Select(m => $"{m.Role}: {m.Content}"));
            requestBody = new
            {
                prompt = prompt,
                temperature = 0.7,
                maxTokenCount = 2000
            };
        }

        var request = new InvokeModelRequest
        {
            ModelId = _modelId,
            ContentType = "application/json",
            Accept = "application/json",
            Body = new MemoryStream(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(requestBody)))
        };

        var response = await _bedrockClient.InvokeModelAsync(request, cancellationToken);

        using var reader = new StreamReader(response.Body);
        var responseBody = await reader.ReadToEndAsync(cancellationToken);
        
        string responseText;
        
        if (isClaudeModel)
        {
            var claudeResponse = JsonSerializer.Deserialize<ClaudeResponse>(responseBody);
            responseText = claudeResponse?.Content?.FirstOrDefault()?.Text ?? "No response";
        }
        else if (isLlamaModel)
        {
            var llamaResponse = JsonSerializer.Deserialize<LlamaResponse>(responseBody);
            responseText = llamaResponse?.Generation ?? "No response";
        }
        else
        {
            // Generic response format
            var genericResponse = JsonSerializer.Deserialize<GenericResponse>(responseBody);
            responseText = genericResponse?.Results?.FirstOrDefault()?.OutputText 
                ?? genericResponse?.Completion 
                ?? "No response";
        }

        return new ChatMessageContent(
            role: AuthorRole.Assistant,
            content: responseText);
    }

    public IAsyncEnumerable<StreamingChatMessageContent> GetStreamingChatMessageContentsAsync(
        ChatHistory chatHistory,
        PromptExecutionSettings? executionSettings = null,
        Kernel? kernel = null,
        CancellationToken cancellationToken = default)
    {
        throw new NotImplementedException("Streaming not implemented");
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

    private class ClaudeResponse
    {
        [JsonPropertyName("content")]
        public List<ContentBlock>? Content { get; set; }
    }

    private class ContentBlock
    {
        [JsonPropertyName("text")]
        public string Text { get; set; } = string.Empty;
    }
    
    private class LlamaResponse
    {
        [JsonPropertyName("generation")]
        public string? Generation { get; set; }
    }
    
    private class GenericResponse
    {
        [JsonPropertyName("results")]
        public List<ResultBlock>? Results { get; set; }
        
        [JsonPropertyName("completion")]
        public string? Completion { get; set; }
    }
    
    private class ResultBlock
    {
        [JsonPropertyName("outputText")]
        public string OutputText { get; set; } = string.Empty;
    }
}
