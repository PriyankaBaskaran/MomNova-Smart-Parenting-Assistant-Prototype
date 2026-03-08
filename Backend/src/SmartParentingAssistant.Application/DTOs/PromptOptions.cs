using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.DTOs
{
    public class PromptOptions
    {
        public double Temperature { get; set; } = 0.4;
        public int MaxTokens { get; set; } = 2000;
        public string? ResponseFormat { get; set; }
        public string ServiceId { get; set; } = ServiceIds.Bedrock; // Changed to Bedrock
    }
}
