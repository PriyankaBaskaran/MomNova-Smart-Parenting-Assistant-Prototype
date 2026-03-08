using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Babies.Commands
{
    public record CreateBabyCommand(string? UserId, string Name, DateTime DateOfBirth, string Gender, string FeedingType, string? Notes)
        : IRequest<BabyProfileDto>;
}
