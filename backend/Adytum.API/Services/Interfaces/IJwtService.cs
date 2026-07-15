namespace Adytum.API.Services.Interfaces;

public interface IJwtService
{
    string GenerateToken(int userId, string username);
}