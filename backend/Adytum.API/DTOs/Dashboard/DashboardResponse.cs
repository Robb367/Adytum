public class DashboardResponse
{
    public int TotalBooks { get; set; }

    public int AvailableBooks { get; set; }

    public int ActiveLoans { get; set; }

    public int PendingReceivedRequests { get; set; }

    public int PendingSentRequests { get; set; }

    public List<RecentBookDto> RecentBooks { get; set; } = new();
}