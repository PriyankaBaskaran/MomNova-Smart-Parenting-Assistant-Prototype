using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Babies.Queries;

public record GetAllBabiesQuery(string UserId) : IRequest<List<BabyProfileDto>>;
