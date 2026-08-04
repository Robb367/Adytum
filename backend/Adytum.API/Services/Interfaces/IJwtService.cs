namespace Adytum.API.Services.Interfaces;
using Adytum.API.Models;
public interface IJwtService
{
    string GenerateToken(int userId, string username, UserRole role);
}