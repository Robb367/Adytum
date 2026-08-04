using Adytum.API.Data;
using Adytum.API.DTOs;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Services;

public class UserService : IUserService
{
    private readonly AdytumDbContext _context;

    private readonly IJwtService _jwtService;

    public UserService(
    AdytumDbContext context,
    IJwtService jwtService)
    {
        _context = context;
        _jwtService = jwtService;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Email == request.Login ||
                u.Username == request.Login);

        if (user == null)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Credenziali non valide."
            };

        }

        bool validPassword = BCrypt.Net.BCrypt.Verify(
        request.Password,
        user.PasswordHash);

        if (!validPassword)
        {
            return new LoginResponse
            {
                Success = false,
                Message = "Credenziali non valide."
            };
        }

        var token = _jwtService.GenerateToken(
            user.Id,
            user.Username,
            user.Role);

        return new LoginResponse
        {
            Success = true,
            Message = "Login effettuato con successo.",
            Token = token
        };
    }
    public async Task<RegisterUserResponse> RegisterUserAsync(RegisterUserRequest request)
    {

        bool emailExists = await _context.Users
            .AnyAsync(u => u.Email == request.Email);

        if (emailExists)
        {
            return new RegisterUserResponse
            {
                Success = false,
                Message = "Questo indirizzo email è già in uso."
            };
        }

        bool usernameExists = await _context.Users
            .AnyAsync(u => u.Username == request.Username);

        if (usernameExists)
        {
            return new RegisterUserResponse
            {
                Success = false,
                Message = "Questo username è già in uso."
            };
        }

        var user = new User
        {

            Username = request.Username,
            Email = request.Email,
            DisplayName = string.IsNullOrWhiteSpace(request.DisplayName)
                ? request.Username
                : request.DisplayName,
            
            Role = UserRole.User,

            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),

            RegistrationDate = DateTime.UtcNow
        };


        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return new RegisterUserResponse
        {
            Success = true,
            Message = "Registrazione completata con successo."
        };
    }
}