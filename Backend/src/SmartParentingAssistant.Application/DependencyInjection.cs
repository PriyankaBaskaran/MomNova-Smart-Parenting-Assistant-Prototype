using Microsoft.Extensions.DependencyInjection;
using MediatR;
using System.Reflection;

namespace SmartParentingAssistant.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // Register MediatR Handlers (Commands/Queries)
            services.AddMediatR(cfg =>
                cfg.RegisterServicesFromAssembly(typeof(DependencyInjection).Assembly));

            // If you use FluentValidation, you can register validators here
            // services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());

            return services;
        }
    }
}
