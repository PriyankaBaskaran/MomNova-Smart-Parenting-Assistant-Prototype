using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SmartParentingAssistant.Application.DTOs
{
    public static class ServiceIds
    {
        public const string AzureOpenAI = "azure-openai";
        public const string Bedrock = "aws-bedrock";
        public const string Ollama = "ollama";
        public const string Mistral = "mistral";
    }
}
