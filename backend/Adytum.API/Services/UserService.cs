using Adytum.API.Data;
using Adytum.API.DTOs;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using BCrypt.Net;

namespace Adytum.API.Services;

public class UserService : IUserService
{
    private readonly AdytumDbContext _context;

    public UserService(AdytumDbContext context)
    {
        _context = context;
    }

    public async Task RegisterUserAsync(RegisterUserRequest request)
{
    var user = new User
    {
        Username = request.Username,
        Email = request.Email,
        DisplayName = request.DisplayName,

        PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),

        RegistrationDate = DateTime.UtcNow
    };

    _context.Users.Add(user);

    await _context.SaveChangesAsync();
 }
}