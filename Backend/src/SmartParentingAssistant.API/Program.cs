using Asp.Versioning;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SmartParentingAssistant.Application;
using SmartParentingAssistant.Infrastructure;
using Amazon.Runtime;

var builder = WebApplication.CreateBuilder(args);

// Configure AWS credentials explicitly
var awsAccessKey = builder.Configuration["AWS:Credentials:AccessKey"];
var awsSecretKey = builder.Configuration["AWS:Credentials:SecretKey"];
var awsRegion = builder.Configuration["AWS:Region"];

if (!string.IsNullOrEmpty(awsAccessKey) && !string.IsNullOrEmpty(awsSecretKey))
{
    var credentials = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
    builder.Services.AddSingleton<AWSCredentials>(credentials);
}

// Add API versioning
builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1, 0);
    options.AssumeDefaultVersionWhenUnspecified = true;
    options.ReportApiVersions = true;
    options.ApiVersionReader = ApiVersionReader.Combine(
        new UrlSegmentApiVersionReader(),
        new HeaderApiVersionReader("x-api-version")
    );
});

// JWT Authentication with Amazon Cognito
var cognitoUserPoolId = builder.Configuration["AWS:Cognito:UserPoolId"];
var cognitoAppClientId = builder.Configuration["AWS:Cognito:AppClientId"];
var cognitoRegion = builder.Configuration["AWS:Cognito:Region"] ?? builder.Configuration["AWS:Region"];
var cognitoAuthority = $"https://cognito-idp.{cognitoRegion}.amazonaws.com/{cognitoUserPoolId}";

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = cognitoAuthority;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidIssuer = cognitoAuthority,
            ValidateAudience = true,
            ValidAudiences = new[] { cognitoAppClientId }, // Accept App Client ID as audience
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5),
            // Map Cognito's "sub" claim to NameIdentifier
            NameClaimType = "sub"
        };
        options.RequireHttpsMetadata = false; // Set to true in production
        
        // Add event handlers for debugging
        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                logger.LogError(context.Exception, "Authentication failed: {Message}", context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                var logger = context.HttpContext.RequestServices.GetRequiredService<ILogger<Program>>();
                var userId = context.Principal?.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                logger.LogInformation("Token validated successfully for user: {UserId}", userId ?? "Unknown");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

// Add Versioned API Explorer
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddControllers();

// Swagger Configuration
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Smart Parenting Assistant API",
        Version = "v1",
        Description = "AI-powered parenting assistant with sentiment analysis using AWS services (DynamoDB, Comprehend, Bedrock)",
        Contact = new OpenApiContact
        {
            Name = "Smart Parenting Team",
            Email = "support@smartparenting.com"
        }
    });

    // JWT Authentication
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter your JWT token in the format: Bearer {your token}"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });

    // Enable annotations
    options.EnableAnnotations();
});

builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// CORS
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "Smart Parenting Assistant API v1");
    options.RoutePrefix = "swagger";
    options.DocumentTitle = "Smart Parenting Assistant API";
    options.DisplayRequestDuration();
});

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
