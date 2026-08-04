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

        return new AdminDashboardResponse
        {
            TotalUsers = totalUsers,
            TotalBooks = totalBooks,
            TotalBookCopies = totalBookCopies,
            ActiveLoans = activeLoans,
            CompletedLoans = completedLoans,
            PendingRequests = pendingRequests,
            RecentUsers = recentUsers,
            RecentBooks = recentBooks
        };
    }
}