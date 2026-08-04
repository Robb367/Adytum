using Adytum.API.DTOs.Admin;

namespace Adytum.API.Services.Interfaces;

public interface IAdminService
{
    Task<AdminDashboardResponse> GetDashboardAsync();
}