using MediatR;
using SmartParentingAssistant.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Features.Babies.Commands
{
    public record AnalysisCommand(string BabyId, string Text)
        : IRequest<AnalysisDto>;
}
