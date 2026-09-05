using Adytum.API.Data;
using Adytum.API.DTOs.Admin;
using Adytum.API.Models;
using Adytum.API.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Adytum.API.Services;

public class AdminService : IAdminService
{
    private readonly AdytumDbContext _context;

    public AdminService(AdytumDbContext context)
    {
        _context = context;
    }

    public async Task<AdminDashboardResponse> GetDashboardAsync()
    {
        var totalUsers = await _context.Users.CountAsync();

        var totalBooks = await _context.Books.CountAsync();

        var totalBookCopies = await _context.BookCopies.CountAsync();

        var activeLoans = await _context.Loans
            .CountAsync(l => l.Status == LoanStatus.Accepted);

        var completedLoans = await _context.Loans
            .CountAsync(l => l.Status == LoanStatus.Returned);

        var pendingRequests = await _context.Loans
            .CountAsync(l => l.Status == LoanStatus.Pending);

        var recentUsers = await _context.Users
            .OrderByDescending(u => u.RegistrationDate)
            .Take(5)
            .Select(u => new RecentUserDto
            {
                Id = u.Id,
                DisplayName = u.DisplayName,
                Username = u.Username,
                RegistrationDate = u.RegistrationDate
            })
            .ToListAsync();

        var thirtyDaysAgo =
            DateTime.UtcNow
                .Date
                .AddDays(-29);

        var rawUsersByDay =
            await _context.Users
                .Where(u =>
                    u.RegistrationDate >= thirtyDaysAgo
                )
                .GroupBy(u =>
                    u.RegistrationDate.Date
                )
                .Select(g =>
                    new
                    {
                        Date = g.Key,
                        Count = g.Count()
                    }
                )
                .ToListAsync();

        var recentBooks = await _context.BookCopies
            .Include(b => b.Book)
            .Include(b => b.Owner)
            .OrderByDescending(b => b.CreatedAt)
            .Take(5)
            .Select(b => new RecentBookDto
            {
                BookCopyId = b.Id,
                Title = b.Book.Title,
                OwnerDisplayName = b.Owner.DisplayName,
                AddedAt = b.CreatedAt
            })
            .ToListAsync();

        var rawBooksByDay =
            await _context.BookCopies
                .Where(b =>
                    b.CreatedAt >= thirtyDaysAgo
                )
                .GroupBy(b =>
                    b.CreatedAt.Date
                )
                .Select(g =>
                    new
                    {
                        Date = g.Key,
                        Count = g.Count()
                    }
                )
                .ToListAsync();

        var activityLast30Days =
            Enumerable
                .Range(0, 30)
                .Select(i =>
                {
                    var date =
                        thirtyDaysAgo.AddDays(i);

                    var users =
                        rawUsersByDay
                            .FirstOrDefault(x =>
                                x.Date == date
                            );

                    var books =
                        rawBooksByDay
                            .FirstOrDefault(x =>
                                x.Date == date
                            );

                    return new AdminActivityPointDto
                    {
                        Date = date,
                        NewUsers = users?.Count ?? 0,
                        NewBooks = books?.Count ?? 0
                    };
                })
                .ToList();

        return new AdminDashboardResponse
        {
            TotalUsers = totalUsers,
            TotalBooks = totalBooks,
            TotalBookCopies = totalBookCopies,
            ActiveLoans = activeLoans,
            CompletedLoans = completedLoans,
            PendingRequests = pendingRequests,
            RecentUsers = recentUsers,
            RecentBooks = recentBooks,
            ActivityLast30Days = activityLast30Days,
        };
    }
}