using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Auth.Commands;

public record RegisterCommand(string Email, string Password, string Name, string? Location)
    : IRequest<AuthResponseDto>;
