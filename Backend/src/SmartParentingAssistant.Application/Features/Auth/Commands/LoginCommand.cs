using MediatR;
using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Features.Auth.Commands;

public record LoginCommand(string Email, string Password)
    : IRequest<AuthResponseDto>;
