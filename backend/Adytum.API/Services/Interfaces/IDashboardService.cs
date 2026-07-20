using Adytum.API.DTOs.Dashboard;

namespace Adytum.API.Services.Interfaces;

public interface IDashboardService
{
    Task<DashboardResponse> GetDashboardAsync(int userId);
}