using Adytum.API.DTOs;

namespace Adytum.API.Services.Interfaces;

public interface IUserService
{
    Task<RegisterUserResponse> RegisterUserAsync(RegisterUserRequest request);
    Task<LoginResponse> LoginAsync(LoginRequest request);
}