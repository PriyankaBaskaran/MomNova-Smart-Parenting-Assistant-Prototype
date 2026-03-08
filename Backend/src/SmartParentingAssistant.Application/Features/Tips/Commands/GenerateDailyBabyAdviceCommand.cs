using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Features.Tips.Commands
{
    public record GenerateDailyBabyAdviceCommand(
        string BabyId
    ) : IRequest<string>;
}
