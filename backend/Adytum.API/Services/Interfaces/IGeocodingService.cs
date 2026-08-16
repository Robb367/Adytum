namespace Adytum.API.Services.Interfaces;

public interface IGeocodingService
{
    Task<(double Latitude, double Longitude)?>
        GeocodeAsync(
            string city,
            string? province,
            string? streetAddress
        );
}