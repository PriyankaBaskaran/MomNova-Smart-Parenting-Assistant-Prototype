using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Analytics.Queries;

public record GetMoodTrendsQuery(string UserId, DateTime StartDate, DateTime EndDate)
    : IRequest<MoodTrendDto>;
