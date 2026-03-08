using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.Babies.Queries;

public class GetAllBabiesQueryHandler : IRequestHandler<GetAllBabiesQuery, List<BabyProfileDto>>
{
    private readonly IBabyRepository _repo;

    public GetAllBabiesQueryHandler(IBabyRepository repo)
    {
        _repo = repo;
    }

    public async Task<List<BabyProfileDto>> Handle(GetAllBabiesQuery request, CancellationToken cancellationToken)
    {
        var babies = await _repo.GetByUserIdAsync(request.UserId);

        return babies.Select(b => new BabyProfileDto
        {
            Id = b.Id,
            Name = b.Name,
            DateOfBirth = b.DateOfBirth,
            Gender = b.Gender,
            FeedingType = b.FeedingType,
            Notes = b.Notes
        }).ToList();
    }
}
