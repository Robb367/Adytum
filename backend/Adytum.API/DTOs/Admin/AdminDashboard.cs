namespace Adytum.API.DTOs.Admin;
using System.Collections.Generic;

public class AdminDashboardResponse
{
    public List<AdminActivityPointDto> ActivityLast30Days { get; set; } = new();
    public int TotalUsers { get; set; }

    public int TotalBooks { get; set; }

    public int TotalBookCopies { get; set; }

    public int ActiveLoans { get; set; }

    public int CompletedLoans { get; set; }

    public int PendingRequests { get; set; }

    public List<RecentUserDto> RecentUsers { get; set; } = new();

    public List<RecentBookDto> RecentBooks { get; set; } = new();
}