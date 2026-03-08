using SmartParentingAssistant.Application.Interfaces;
using Microsoft.SemanticKernel.Prompty;
using Microsoft.SemanticKernel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.SemanticKernel.PromptTemplates.Liquid;
using HandlebarsDotNet;
using Microsoft.SemanticKernel.Connectors.OpenAI;

namespace SmartParentingAssistant.Infrastructure.AI
{
    public class PromptyService : IPromptyService
    {
        private readonly Kernel _kernel;
        public PromptyService(Kernel kernel)
        {
            _kernel = kernel;
        }

        public async Task<string> RenderPromptAsync(string filePath, Dictionary<string, object> arguments)
        {
            var promptConfig = KernelFunctionPrompty.ToPromptTemplateConfig(File.ReadAllText(filePath));

            var kernelArgs = new KernelArguments();

            foreach (var arg in arguments)
                kernelArgs[arg.Key] = arg.Value;

            promptConfig.AddExecutionSettings(new OpenAIPromptExecutionSettings()
            {
                ToolCallBehavior = ToolCallBehavior.AutoInvokeKernelFunctions
            });

            var promptTemplateFactory = new LiquidPromptTemplateFactory();

            var promptTemplate = promptTemplateFactory.Create(promptConfig);

            return await promptTemplate.RenderAsync(_kernel, kernelArgs);
        }
    }
}
