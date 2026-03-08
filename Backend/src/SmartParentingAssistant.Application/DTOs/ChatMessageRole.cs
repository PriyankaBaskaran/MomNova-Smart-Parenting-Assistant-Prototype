using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.DTOs
{
    public class ChatMessage
    {
        public ChatMessageRole Role { get; set; } = ChatMessageRole.User;
        public string Content { get; set; } = string.Empty;
    }

    public enum ChatMessageRole
    {
        System,
        User,
        Assistant
    }
}
