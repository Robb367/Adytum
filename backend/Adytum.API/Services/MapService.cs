using Adytum.API.Data;
using Adytum.API.DTOs.Map;
using Adytum.API.Exceptions;
using Adytum.API.Helpers;
using Adytum.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Services;

public class MapService : IMapService
{
    private readonly AdytumDbContext _context;

    public MapService(
        AdytumDbContext context)
    {
        _context = context;
    }

    public async Task<List<NearbyUserMapDto>>
        GetNearbyUsersAsync(
            int currentUserId)
    {
        var currentUser =
            await _context.Users
                .FirstOrDefaultAsync(u =>
                    u.Id == currentUserId);

        if (currentUser == null)
        {
            throw new NotFoundException(
                "Utente non trovato."
            );
        }

        var users =
            await _context.Users
                .Where(u =>
                    u.Id != currentUserId &&
                    u.IsActive &&
                    u.IsPublicProfile &&
                    u.Latitude != 0 &&
                    u.Longitude != 0)
                .Select(u => new
                {
                    User = u,

                    AvailableBooksCount =
                        u.BookCopies.Count(b =>
                            b.AvailableForLoan)
                })
                .Where(x =>
                    x.AvailableBooksCount > 0)
                .ToListAsync();

        var results =
            new List<NearbyUserMapDto>();

        foreach (var item in users)
        {
            var distance =
                GeoHelper.CalculateDistanceKm(
                    currentUser.Latitude,
                    currentUser.Longitude,
                    item.User.Latitude,
                    item.User.Longitude
                );

            if (distance >
                currentUser.SearchRadiusKm)
            {
                continue;
            }

            results.Add(
                new NearbyUserMapDto
                {
                    UserId =
                        item.User.Id,

                    DisplayName =
                        item.User.DisplayName
                        ?? item.User.Username,

                    City =
                        item.User.City,

                    Province =
                        item.User.Province,

                    Latitude =
                        item.User.Latitude,

                    Longitude =
                        item.User.Longitude,

                    DistanceKm =
                        Math.Round(distance, 2),

                    AvailableBooksCount =
                        item.AvailableBooksCount
                }
            );
        }

        return results
            .OrderBy(u => u.DistanceKm)
            .ToList();
    }
}