using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Journal.Queries;

public record GetJournalEntriesQuery(string UserId, DateTime? StartDate, DateTime? EndDate)
    : IRequest<List<JournalEntryDto>>;
