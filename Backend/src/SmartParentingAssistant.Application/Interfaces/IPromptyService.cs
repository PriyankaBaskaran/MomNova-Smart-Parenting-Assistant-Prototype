using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Interfaces
{
    public interface IPromptyService
    {
        Task<string> RenderPromptAsync(string filePath, Dictionary<string, object> arguments);
    }
}
