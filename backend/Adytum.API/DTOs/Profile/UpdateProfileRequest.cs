using System;

namespace Adytum.API.DTOs.Profile;

public class UpdateProfileRequest
{
    public string? DisplayName { get; set; }

    public string? Bio { get; set; }

    public string? ProfilePictureUrl { get; set; }

    public string? City { get; set; }

    public string? Province { get; set; }

    public string? StreetAddress { get; set; }

    public int SearchRadiusKm { get; set; }

    public bool IsPublicProfile { get; set; }
}