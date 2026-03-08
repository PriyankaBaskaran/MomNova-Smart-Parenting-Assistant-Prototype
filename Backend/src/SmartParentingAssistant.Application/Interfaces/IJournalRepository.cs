using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Application.Interfaces;

public interface IJournalRepository
{
    Task<JournalEntry> CreateAsync(JournalEntry entry);
    Task<JournalEntry?> GetByIdAsync(string id, string userId);
    Task<List<JournalEntry>> GetEntriesAsync(string userId, DateTime? startDate, DateTime? endDate);
}
