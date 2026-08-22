using Adytum.API.Data;
using Adytum.API.DTOs;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Adytum.API.DTOs.Users;
using Adytum.API.Exceptions;
using Adytum.API.DTOs.Books;

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

    public async Task<List<UserSearchResult>> SearchUsersAsync(
        string query,
        int currentUserId)
    {
        query = query.Trim();

        if (string.IsNullOrWhiteSpace(query))
        {
            return new List<UserSearchResult>();
        }

        return await _context.Users
            .Where(u =>
                u.Id != currentUserId &&
                u.IsActive &&
                u.IsPublicProfile &&
                (
                    u.Username.Contains(query) ||
                    (
                        u.DisplayName != null &&
                        u.DisplayName.Contains(query)
                    )
                ))
            .Select(u => new UserSearchResult
            {
                UserId = u.Id,

                Username = u.Username,

                DisplayName =
                    u.DisplayName
                    ?? u.Username,

                ProfilePictureUrl =
                    u.ProfilePictureUrl,

                City =
                    u.City,

                Province =
                    u.Province,

                AvailableBooksCount =
                    u.BookCopies.Count(b =>
                        b.AvailableForLoan)
            })
            .OrderBy(u => u.DisplayName)
            .Take(20)
            .ToListAsync();
    }

    public async Task<List<SearchBookResult>> GetAvailableBooksByUserAsync(
    int userId)
    {
        var userExists =
            await _context.Users.AnyAsync(u =>
                u.Id == userId &&
                u.IsActive &&
                u.IsPublicProfile);

        if (!userExists)
        {
            throw new NotFoundException(
                "Profilo utente non trovato."
            );
        }

        return await _context.BookCopies
            .Include(c => c.Book)
            .Include(c => c.Owner)
            .Where(c =>
                c.OwnerId == userId &&
                c.AvailableForLoan)
            .Select(c => new SearchBookResult
            {
                BookCopyId = c.Id,

                Title =
                    c.CustomTitle
                    ?? c.Book.Title,

                Author =
                    c.CustomAuthor
                    ?? c.Book.Author,

                CoverImageUrl =
                    c.CustomCoverImageUrl
                    ?? c.Book.CoverImageUrl,

                OwnerDisplayName =
                    c.Owner.DisplayName
                    ?? c.Owner.Username,

                City =
                    c.Owner.City,

                AvailableForLoan =
                    c.AvailableForLoan,

                Condition =
                    c.Condition
            })
            .ToListAsync();
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

    public async Task<PublicUserProfileResponse> GetPublicUserProfileAsync(
    int userId)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u =>
                u.Id == userId &&
                u.IsActive &&
                u.IsPublicProfile);

        if (user == null)
        {
            throw new NotFoundException(
                "Profilo utente non trovato."
            );
        }

        var totalBooks =
            await _context.BookCopies
                .CountAsync(b =>
                    b.OwnerId == userId);

        var availableBooks =
            await _context.BookCopies
                .CountAsync(b =>
                    b.OwnerId == userId &&
                    b.AvailableForLoan);

        var completedLoans =
            await _context.Loans
                .CountAsync(l =>
                    l.LenderId == userId &&
                    l.Status == LoanStatus.Returned);

        return new PublicUserProfileResponse
        {
            UserId = user.Id,

            Username = user.Username,

            DisplayName =
                user.DisplayName
                ?? user.Username,

            ProfilePictureUrl =
                user.ProfilePictureUrl,

            Bio =
                user.Bio,

            City =
                user.City,

            Province =
                user.Province,

            RegistrationDate =
                user.RegistrationDate,

            TotalBooks =
                totalBooks,

            AvailableBooks =
                availableBooks,

            CompletedLoans =
                completedLoans
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