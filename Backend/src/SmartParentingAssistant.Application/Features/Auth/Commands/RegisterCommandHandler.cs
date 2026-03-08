using MediatR;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;

namespace SmartParentingAssistant.Application.Features.Auth.Commands;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AuthResponseDto>
{
    private readonly IAuthService _authService;

    public RegisterCommandHandler(IAuthService authService)
    {
        _authService = authService;
    }

    public async Task<AuthResponseDto> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var registerDto = new RegisterDto(request.Email, request.Password, request.Name, request.Location);
        return await _authService.RegisterAsync(registerDto);
    }
}
