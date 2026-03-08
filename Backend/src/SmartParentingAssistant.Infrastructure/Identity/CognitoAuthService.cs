using Amazon.CognitoIdentityProvider;
using Amazon.CognitoIdentityProvider.Model;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SmartParentingAssistant.Application.DTOs;
using SmartParentingAssistant.Application.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;

namespace SmartParentingAssistant.Infrastructure.Identity;

public class CognitoAuthService : IAuthService
{
    private readonly IAmazonCognitoIdentityProvider _cognitoClient;
    private readonly IUserRepository _userRepository;
    private readonly ILogger<CognitoAuthService> _logger;
    private readonly string _userPoolId;
    private readonly string _clientId;
    private readonly string? _clientSecret;

    public CognitoAuthService(
        IAmazonCognitoIdentityProvider cognitoClient,
        IUserRepository userRepository,
        IConfiguration configuration,
        ILogger<CognitoAuthService> logger)
    {
        _cognitoClient = cognitoClient;
        _userRepository = userRepository;
        _logger = logger;
        _userPoolId = configuration["AWS:Cognito:UserPoolId"] 
            ?? throw new ArgumentNullException("AWS:Cognito:UserPoolId is required");
        _clientId = configuration["AWS:Cognito:AppClientId"] 
            ?? throw new ArgumentNullException("AWS:Cognito:AppClientId is required");
        _clientSecret = configuration["AWS:Cognito:AppClientSecret"]; // Optional
    }

    private string? ComputeSecretHash(string username)
    {
        if (string.IsNullOrEmpty(_clientSecret))
            return null;

        var message = Encoding.UTF8.GetBytes(username + _clientId);
        var key = Encoding.UTF8.GetBytes(_clientSecret);

        using var hmac = new HMACSHA256(key);
        var hash = hmac.ComputeHash(message);
        return Convert.ToBase64String(hash);
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto request)
    {
        try
        {
            var signUpRequest = new SignUpRequest
            {
                ClientId = _clientId,
                Username = request.Email,
                Password = request.Password,
                UserAttributes = new List<AttributeType>
                {
                    new AttributeType { Name = "email", Value = request.Email },
                    new AttributeType { Name = "name", Value = request.Name }
                }
            };

            // Add SECRET_HASH if client secret is configured
            var secretHash = ComputeSecretHash(request.Email);
            if (secretHash != null)
            {
                signUpRequest.SecretHash = secretHash;
            }

            var response = await _cognitoClient.SignUpAsync(signUpRequest);

            _logger.LogInformation("User registered in Cognito: {Email}, UserSub: {UserSub}", 
                request.Email, response.UserSub);

            // Store user metadata in DynamoDB for additional data
            var user = new Domain.Entities.User
            {
                Id = response.UserSub,
                Email = request.Email,
                Name = request.Name,
                Location = request.Location,
                PasswordHash = "", // Not needed with Cognito
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.CreateAsync(user);

            return new AuthResponseDto(
                Token: null, // No token until email is verified
                UserId: response.UserSub,
                Email: request.Email,
                Name: request.Name
            );
        }
        catch (UsernameExistsException)
        {
            throw new InvalidOperationException("User already exists");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error registering user in Cognito");
            throw;
        }
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto request)
    {
        try
        {
            var authParameters = new Dictionary<string, string>
            {
                { "USERNAME", request.Email },
                { "PASSWORD", request.Password }
            };

            // Add SECRET_HASH if client secret is configured
            var secretHash = ComputeSecretHash(request.Email);
            if (secretHash != null)
            {
                authParameters.Add("SECRET_HASH", secretHash);
            }

            var authRequest = new InitiateAuthRequest
            {
                ClientId = _clientId,
                AuthFlow = AuthFlowType.USER_PASSWORD_AUTH,
                AuthParameters = authParameters
            };

            var response = await _cognitoClient.InitiateAuthAsync(authRequest);

            if (response.AuthenticationResult == null)
            {
                throw new UnauthorizedAccessException("Authentication failed");
            }

            // Get tokens from Cognito
            var idToken = response.AuthenticationResult.IdToken;
            var accessToken = response.AuthenticationResult.AccessToken;
            var refreshToken = response.AuthenticationResult.RefreshToken;

            // Decode ID token to get user info
            var handler = new JwtSecurityTokenHandler();
            var token = handler.ReadJwtToken(idToken);

            var userId = token.Claims.FirstOrDefault(c => c.Type == "sub")?.Value 
                ?? throw new InvalidOperationException("User ID not found in token");
            var email = token.Claims.FirstOrDefault(c => c.Type == "email")?.Value 
                ?? request.Email;
            var name = token.Claims.FirstOrDefault(c => c.Type == "name")?.Value ?? "";

            // Update last login in DynamoDB
            await _userRepository.UpdateLastLoginAsync(userId);

            _logger.LogInformation("User logged in successfully: {Email}", email);

            return new AuthResponseDto(idToken, userId, email, name);
        }
        catch (NotAuthorizedException)
        {
            throw new UnauthorizedAccessException("Invalid credentials");
        }
        catch (UserNotConfirmedException)
        {
            throw new UnauthorizedAccessException("Email not verified. Please check your email.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            throw;
        }
    }

    public string GenerateJwtToken(string userId, string email)
    {
        // Not needed - Cognito generates tokens automatically
        throw new NotImplementedException("Cognito generates JWT tokens automatically");
    }
}
