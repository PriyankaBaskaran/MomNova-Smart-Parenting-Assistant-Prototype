using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Journal.Commands;

public record CreateJournalEntryCommand(string UserId, string Content, string Mood, string BabyId)
    : IRequest<JournalEntryDto>;
