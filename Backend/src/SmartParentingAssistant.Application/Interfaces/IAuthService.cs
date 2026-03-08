using SmartParentingAssistant.Application.DTOs;

namespace SmartParentingAssistant.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto request);
    Task<AuthResponseDto> LoginAsync(LoginDto request);
    string GenerateJwtToken(string userId, string email);
}
