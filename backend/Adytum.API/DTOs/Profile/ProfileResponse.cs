using System;

namespace Adytum.API.DTOs.Profile;

public class ProfileResponse
{
    public string Username { get; set; } = string.Empty;

    public string? DisplayName { get; set; }

    public string Email { get; set; } = string.Empty;

    public string? Bio { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public string? City { get; set; }

    public string? Province { get; set; }

    public string? StreetAddress { get; set; }

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