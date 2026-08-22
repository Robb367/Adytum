namespace Adytum.API.DTOs.Users;

public class PublicUserProfileResponse
{
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string? ProfilePictureUrl { get; set; }

    public string? Bio { get; set; }

    public string? City { get; set; }

    public string? Province { get; set; }

    public DateTime RegistrationDate { get; set; }

    public int TotalBooks { get; set; }

    public int AvailableBooks { get; set; }

    public int CompletedLoans { get; set; }
}