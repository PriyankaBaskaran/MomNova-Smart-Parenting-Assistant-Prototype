namespace SmartParentingAssistant.Application.DTOs;

public record RegisterDto(string Email, string Password, string Name, string? Location);

public record LoginDto(string Email, string Password);

public record AuthResponseDto(string? Token, string UserId, string Email, string Name);
