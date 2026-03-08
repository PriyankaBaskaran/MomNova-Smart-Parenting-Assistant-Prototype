using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Interfaces;

public interface IUserRepository
{
    Task<User> CreateAsync(User user);
    Task<User?> GetByEmailAsync(string email);
    Task<User?> GetByIdAsync(string id);
    Task UpdateLastLoginAsync(string userId);
}
