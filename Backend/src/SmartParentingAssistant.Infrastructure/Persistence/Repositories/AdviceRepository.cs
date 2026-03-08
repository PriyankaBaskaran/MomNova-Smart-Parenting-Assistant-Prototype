using SmartParentingAssistant.Application.Interfaces;
using SmartParentingAssistant.Domain.Entities;

namespace SmartParentingAssistant.Infrastructure.Persistence.Repositories;

public class AdviceRepository : IAdviceRepository
{
    private static readonly List<ParentAdvice> _parentAdvices = new();
    private static readonly List<DailyAdvice> _dailyAdvices = new();

    public Task<ParentAdvice> AddAsync(ParentAdvice advice)
    {
        _parentAdvices.Add(advice);
        return Task.FromResult(advice);
    }

    public Task<DailyAdvice> AddDailyAdviceAsync(DailyAdvice advice)
    {
        _dailyAdvices.Add(advice);
        return Task.FromResult(advice);
    }
}
