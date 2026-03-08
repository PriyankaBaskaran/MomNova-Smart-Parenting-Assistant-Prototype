using SmartParentingAssistant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Interfaces
{
    public interface IAdviceRepository
    {
        Task<ParentAdvice> AddAsync(ParentAdvice advice);
        Task<DailyAdvice> AddDailyAdviceAsync(DailyAdvice advice);
    }
}
