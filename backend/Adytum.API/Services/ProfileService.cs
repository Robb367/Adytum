using Adytum.API.Data;
using Adytum.API.DTOs.Profile;
using Adytum.API.Exceptions;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Services;

public class ProfileService : IProfileService
{
    private readonly AdytumDbContext _context;
    private readonly IGeocodingService _geocodingService;


    public ProfileService(
        AdytumDbContext context,
        IGeocodingService geocodingService)
    {
        _context = context;
        _geocodingService = geocodingService;
    }

    public async Task<ProfileResponse> GetMyProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new NotFoundException("Utente non trovato.");

        var booksOwned = await _context.BookCopies
            .CountAsync(b => b.OwnerId == userId);

        var availableBooks = await _context.BookCopies
            .CountAsync(b =>
                b.OwnerId == userId &&
                b.AvailableForLoan);

        var activeLoans = await _context.Loans
            .CountAsync(l =>
                l.LenderId == userId &&
                l.Status == LoanStatus.Accepted);

        var completedLoans = await _context.Loans
            .CountAsync(l =>
                l.LenderId == userId &&
                l.Status == LoanStatus.Returned);

        return new ProfileResponse
        {
            Username = user.Username,
            DisplayName = user.DisplayName,
            Email = user.Email,
            Bio = user.Bio,
            ProfilePictureUrl = user.ProfilePictureUrl,
            City = user.City,
            Province = user.Province,
            StreetAddress = user.StreetAddress,
            Latitude = user.Latitude,
            Longitude = user.Longitude,
            SearchRadiusKm = user.SearchRadiusKm,
            RegistrationDate = user.RegistrationDate,
            IsPublicProfile = user.IsPublicProfile,
            BooksOwned = booksOwned,
            AvailableBooks = availableBooks,
            ActiveLoans = activeLoans,
            CompletedLoans = completedLoans
        };
    }

    public async Task UpdateProfileAsync(
     int userId,
     UpdateProfileRequest request)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
            throw new NotFoundException("Utente non trovato.");

        user.DisplayName = request.DisplayName;
        user.Bio = request.Bio;
        user.ProfilePictureUrl = request.ProfilePictureUrl;
        user.City = request.City;
        user.Province = request.Province;
        user.StreetAddress = request.StreetAddress;
        user.SearchRadiusKm = request.SearchRadiusKm;
        user.IsPublicProfile = request.IsPublicProfile;

        if (!string.IsNullOrWhiteSpace(request.City))
        {
            var coordinates =
                await _geocodingService.GeocodeAsync(
                    request.City,
                    request.Province,
                    request.StreetAddress
                );

            if (coordinates.HasValue)
            {
                user.Latitude =
                    coordinates.Value.Latitude;

                user.Longitude =
                    coordinates.Value.Longitude;
            }
            else
            {
                throw new BusinessRuleException(
                    "Non è stato possibile trovare la località indicata."
                );
            }
        }

        await _context.SaveChangesAsync();
    }
}