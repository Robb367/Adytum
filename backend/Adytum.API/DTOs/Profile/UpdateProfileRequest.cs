using System;

namespace Adytum.API.DTOs.Profile;

public class UpdateProfileRequest
{
    public string DisplayName { get; set; } = string.Empty;

    public string Bio { get; set; } = string.Empty;

    public string ProfilePictureUrl { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public int SearchRadiusKm { get; set; }

    public bool IsPublicProfile { get; set; }
}