using System;

namespace Adytum.API.DTOs.Profile;

public class ProfileResponse
{
    public string Username { get; set; } = string.Empty;

    public string DisplayName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string ProfilePictureUrl { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public int SearchRadiusKm { get; set; }

    public DateTime RegistrationDate { get; set; }

    public bool IsPublicProfile { get; set; }

    public int BooksOwned { get; set; }

    public int ActiveLoans { get; set; }

    public int CompletedLoans { get; set; }
    public int AvailableBooks { get; set; }
}