namespace Adytum.API.DTOs.Admin;

public class RecentUserDto
{
    public int Id { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public string Username { get; set; } = string.Empty;

    public DateTime RegistrationDate { get; set; }
}