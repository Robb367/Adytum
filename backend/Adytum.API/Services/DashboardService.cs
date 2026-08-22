using Adytum.API.DTOs.Dashboard;
using Adytum.API.Models;
using Adytum.API.Data;
using Microsoft.EntityFrameworkCore;
using Adytum.API.Services.Interfaces;
using Adytum.API.Exceptions;

namespace Adytum.API.Services;

public class DashboardService : IDashboardService
{
    private readonly AdytumDbContext _context;

    public DashboardService(AdytumDbContext context)
    {
        _context = context;
    }

    public async Task<DashboardResponse> GetDashboardAsync(int userId)
    {
        var totalBooks = await _context.BookCopies
    .CountAsync(b => b.OwnerId == userId);

        var recentBooks = await _context.BookCopies
    .Include(b => b.Book)
    .Where(b => b.OwnerId == userId)
    .OrderByDescending(b => b.CreatedAt)
    .Take(5)
    .Select(b => new RecentBookDto
    {
        BookCopyId = b.Id,

        Title =
            b.CustomTitle
            ?? b.Book.Title,

        Author =
            b.CustomAuthor
            ?? b.Book.Author,

        CoverImageUrl =
            b.CustomCoverImageUrl
            ?? b.Book.CoverImageUrl
    })
    .ToListAsync();

        var availableBooks = await _context.BookCopies
            .CountAsync(b =>
                b.OwnerId == userId &&
                b.AvailableForLoan);

        var activeLoans = await _context.Loans
            .CountAsync(l =>
                l.LenderId == userId &&
                l.Status == LoanStatus.Accepted);

        var pendingReceived = await _context.Loans
            .CountAsync(l =>
                l.LenderId == userId &&
                l.Status == LoanStatus.Pending);

        var pendingSent = await _context.Loans
            .CountAsync(l =>
                l.BorrowerId == userId &&
                l.Status == LoanStatus.Pending);

        var completedLoans = await _context.Loans
            .CountAsync(l =>
                l.LenderId == userId &&
                l.Status == LoanStatus.Returned);

        var user = await _context.Users
    .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            throw new NotFoundException("Utente non trovato.");
        }

        var displayName =
            user.DisplayName
            ?? user.Username;

        var totalViews =
            await _context.BookViews
                .CountAsync(v =>
                    v.BookCopy.OwnerId == userId
                );


        var thirtyDaysAgo =
            DateTime.UtcNow
                .Date
                .AddDays(-29);


        var viewsLast30Days =
            await _context.BookViews
                .CountAsync(v =>
                    v.BookCopy.OwnerId == userId &&
                    v.ViewedAt >= thirtyDaysAgo
                );

        var mostViewedBook =
            await _context.BookViews

                .Where(v =>
                    v.BookCopy.OwnerId == userId
                )

                .GroupBy(v => new
                {
                    v.BookCopyId,

                    Title =
                        v.BookCopy.CustomTitle
                        ?? v.BookCopy.Book.Title,

                    Author =
                        v.BookCopy.CustomAuthor
                        ?? v.BookCopy.Book.Author,

                    CoverImageUrl =
                        v.BookCopy.CustomCoverImageUrl
                        ?? v.BookCopy.Book.CoverImageUrl
                })

                .Select(g =>
                    new MostViewedBookDto
                    {
                        BookCopyId =
                            g.Key.BookCopyId,

                        Title =
                            g.Key.Title,

                        Author =
                            g.Key.Author,

                        CoverImageUrl =
                            g.Key.CoverImageUrl,

                        Views =
                            g.Count()
                    }
                )

                .OrderByDescending(b =>
                    b.Views
                )

                .FirstOrDefaultAsync();

        var rawViewsByDay =
            await _context.BookViews

                .Where(v =>
                    v.BookCopy.OwnerId == userId &&
                    v.ViewedAt >= thirtyDaysAgo
                )

                .GroupBy(v =>
                    v.ViewedAt.Date
                )

                .Select(g =>
                    new
                    {
                        Date = g.Key,
                        Views = g.Count()
                    }
                )

                .ToListAsync();

        var viewsByDay =
            Enumerable
                .Range(0, 30)

                .Select(i =>
                {
                    var date =
                        thirtyDaysAgo
                            .AddDays(i);

                    var day =
                        rawViewsByDay
                            .FirstOrDefault(x =>
                                x.Date == date
                            );

                    return new DashboardViewPointDto
                    {
                        Date = date,

                        Views =
                            day?.Views ?? 0
                    };
                })

                .ToList();

        return new DashboardResponse
        {
            TotalBooks = totalBooks,
            AvailableBooks = availableBooks,
            ActiveLoans = activeLoans,
            PendingReceivedRequests = pendingReceived,
            PendingSentRequests = pendingSent,
            RecentBooks = recentBooks,
            TotalLoansCompleted = completedLoans,
            DisplayName = displayName,
            Latitude = user.Latitude,
            Longitude = user.Longitude,
            SearchRadiusKm = user.SearchRadiusKm,
            City = user.City,
            Province = user.Province,
            TotalViews = totalViews,
            ViewsLast30Days = viewsLast30Days,
            MostViewedBook = mostViewedBook,
            ViewsByDay = viewsByDay
        };
    }
}