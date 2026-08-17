namespace Adytum.API.DTOs.Dashboard;
public class DashboardResponse
{
    public int TotalBooks { get; set; }
    public int AvailableBooks { get; set; }
    public int ActiveLoans { get; set; }
    public int PendingReceivedRequests { get; set; }
    public int PendingSentRequests { get; set; }
    public List<RecentBookDto> RecentBooks { get; set; } = new();
    public string DisplayName { get; set; } = string.Empty;
    public int TotalLoansCompleted { get; set; }
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public int SearchRadiusKm { get; set; }
    public string? City { get; set; }
    public string? Province { get; set; }
}