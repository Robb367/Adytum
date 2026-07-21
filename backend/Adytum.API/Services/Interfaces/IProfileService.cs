using Adytum.API.DTOs.Profile;

namespace Adytum.API.Services.Interfaces;

public interface IProfileService
{
    Task<ProfileResponse> GetMyProfileAsync(int userId);

    Task UpdateProfileAsync(int userId, UpdateProfileRequest request);
}