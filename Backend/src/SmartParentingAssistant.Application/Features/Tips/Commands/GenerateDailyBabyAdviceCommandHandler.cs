using MediatR;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.Tips.Commands;

public class GenerateDailyBabyAdviceCommandHandler : IRequestHandler<GenerateDailyBabyAdviceCommand, string>
{
    private readonly IPromptyService _promptyService;
    private readonly ISmartParentingKernelService _kernelService;
    private readonly IBabyRepository _babyRepo;

    public GenerateDailyBabyAdviceCommandHandler(
        IPromptyService promptyService,
        ISmartParentingKernelService kernelService,
        IBabyRepository babyRepo)
    {
        _promptyService = promptyService;
        _kernelService = kernelService;
        _babyRepo = babyRepo;
    }
    
    public async Task<string> Handle(GenerateDailyBabyAdviceCommand request, CancellationToken cancellationToken)
    {
        var babyDetails = await _babyRepo.GetByIdAsync(request.BabyId);
        
        if (babyDetails == null)
            throw new InvalidOperationException($"Baby with ID {request.BabyId} not found");
        
        try
        {
            // Format dates for AI to calculate age
            var currentDate = DateTime.UtcNow.ToString("yyyy-MM-dd");
            var dateOfBirth = babyDetails.DateOfBirth.ToString("yyyy-MM-dd");
            
            // Render the .prompty file with baby context
            var args = new Dictionary<string, object>
            {
                ["babyName"] = babyDetails.Name,
                ["dateOfBirth"] = dateOfBirth,
                ["currentDate"] = currentDate,
                ["gender"] = babyDetails.Gender,
                ["feedingType"] = babyDetails.FeedingType
            };

            var promptPath = Path.Combine(AppContext.BaseDirectory, "Prompts", "DailyAdvice.prompty");
            var renderedPrompt = await _promptyService.RenderPromptAsync(promptPath, args);

            // Generate advice using Bedrock (Semantic Kernel)
            var adviceText = await _kernelService.GetChatResponseAsync(renderedPrompt);

            return adviceText.Content;
        }
        catch (Exception ex) when (ex.Message.Contains("INVALID_PAYMENT_INSTRUMENT") || 
                                     ex.Message.Contains("AccessDeniedException"))
        {
            // Return a helpful fallback message when Bedrock is not accessible
            var age = (DateTime.UtcNow - babyDetails.DateOfBirth).Days / 30;
            return $"Hello! Your baby {babyDetails.Name} is around {age} months old. " +
                   $"At this age, focus on bonding, regular feeding, and plenty of rest. " +
                   $"Remember to enjoy these precious moments! 💙\n\n" +
                   $"(Note: AI-powered personalized advice is temporarily unavailable. Please ensure your AWS account has a valid payment method configured.)";
        }
    }
}
