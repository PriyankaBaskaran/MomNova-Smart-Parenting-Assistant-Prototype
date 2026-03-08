using SmartParentingAssistant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Interfaces
{
    public interface IBabyRepository
    {
        Task<BabyProfile?> GetByIdAsync(string id);
        Task<List<BabyProfile>> GetByUserIdAsync(string userId);
        Task<BabyProfile> AddAsync(BabyProfile baby);
    }
}
