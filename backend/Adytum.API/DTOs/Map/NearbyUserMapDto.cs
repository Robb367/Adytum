namespace Adytum.API.DTOs.Map;

public class NearbyUserMapDto
{
    public int UserId { get; set; }

    public string DisplayName { get; set; } = string.Empty;

    public string? City { get; set; }

    public string? Province { get; set; }

    public double Latitude { get; set; }

    public double Longitude { get; set; }

    public double DistanceKm { get; set; }

    public int AvailableBooksCount { get; set; }
}