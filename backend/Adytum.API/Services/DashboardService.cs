using Adytum.API.DTOs.Dashboard;
using Adytum.API.Models;
using Adytum.API.Data;
using Microsoft.EntityFrameworkCore;
using Adytum.API.Services.Interfaces;

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
                Title = b.Book.Title,
                Author = b.Book.Author,
                CoverUrl = b.Book.CoverImageUrl
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

        return new DashboardResponse
        {
            TotalBooks = totalBooks,
            AvailableBooks = availableBooks,
            ActiveLoans = activeLoans,
            PendingReceivedRequests = pendingReceived,
            PendingSentRequests = pendingSent,
            RecentBooks = recentBooks,
            TotalLoansCompleted = completedLoans
        };
    }
}