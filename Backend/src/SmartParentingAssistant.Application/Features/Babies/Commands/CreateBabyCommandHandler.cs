using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Features.Babies.Commands;

public class CreateBabyCommandHandler : IRequestHandler<CreateBabyCommand, BabyProfileDto>
{
    private readonly IBabyRepository _repo;

    public CreateBabyCommandHandler(IBabyRepository repo)
    {
        _repo = repo;
    }

    public async Task<BabyProfileDto> Handle(CreateBabyCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.UserId))
            throw new ArgumentException("UserId is required");

        var baby = new BabyProfile
        {
            UserId = request.UserId,
            Name = request.Name,
            DateOfBirth = request.DateOfBirth,
            Gender = request.Gender,
            FeedingType = request.FeedingType,
            Notes = request.Notes
        };

        var created = await _repo.AddAsync(baby);

        return new BabyProfileDto
        {
            Id = created.Id,
            Name = created.Name,
            DateOfBirth = created.DateOfBirth,
            Gender = created.Gender,
            FeedingType = created.FeedingType,
            Notes = created.Notes
        };
    }
}
