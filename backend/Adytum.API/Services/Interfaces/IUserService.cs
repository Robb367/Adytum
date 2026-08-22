using Adytum.API.DTOs;
using Adytum.API.DTOs.Users;
using Adytum.API.DTOs.Books;

namespace Adytum.API.Services.Interfaces;

public interface IUserService
{
    Task<RegisterUserResponse> RegisterUserAsync(RegisterUserRequest request);
    Task<LoginResponse> LoginAsync(LoginRequest request);

    Task<List<UserSearchResult>> SearchUsersAsync(
    string query,
    int currentUserId
    );

    Task<List<SearchBookResult>> GetAvailableBooksByUserAsync(
        int userId
    );
    Task<PublicUserProfileResponse> GetPublicUserProfileAsync(int userId);
}