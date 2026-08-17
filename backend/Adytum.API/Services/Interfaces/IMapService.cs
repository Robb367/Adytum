using Adytum.API.DTOs.Map;

namespace Adytum.API.Services.Interfaces;

public interface IMapService
{
    Task<List<NearbyUserMapDto>> GetNearbyUsersAsync(
        int currentUserId
    );
}