namespace Adytum.API.DTOs.Users;

public class UserSearchResult
{
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string? ProfilePictureUrl { get; set; }

    public string? City { get; set; }

    public string? Province { get; set; }

    public int AvailableBooksCount { get; set; }
}