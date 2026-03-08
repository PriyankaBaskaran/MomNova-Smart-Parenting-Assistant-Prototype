using SmartParentingAssistant.Application.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.Interfaces
{
    public interface ISmartParentingKernelService
    {
        Task<ChatMessage> GetChatResponseAsync(string prompt, PromptOptions? options = null);
    }
}
