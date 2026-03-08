using SmartParentingAssistant.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Interfaces
{
    public interface IAnalysisRepository
    {
        Task<Analysis> AddMoodAnalysis(Analysis analysis);
        Task<IEnumerable<Analysis>> GetAnalysesByBabyIdAsync(string babyId);
    }
}
