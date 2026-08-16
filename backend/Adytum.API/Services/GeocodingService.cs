using System.Text.Json;
using Adytum.API.Services.Interfaces;
using System.Text.Json.Serialization;

namespace Adytum.API.Services;

public class GeocodingService : IGeocodingService
{
    private readonly HttpClient _httpClient;

    public GeocodingService(
        HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<(double Latitude, double Longitude)?>
        GeocodeAsync(
            string city,
            string? province,
            string? streetAddress)
    {
        if (string.IsNullOrWhiteSpace(city))
        {
            return null;
        }

        var locationParts = new List<string>();

        if (!string.IsNullOrWhiteSpace(streetAddress))
        {
            locationParts.Add(streetAddress);
        }

        locationParts.Add(city);

        if (!string.IsNullOrWhiteSpace(province))
        {
            locationParts.Add(province);
        }

        locationParts.Add("Italia");

        var query = string.Join(", ", locationParts);

        var url =
            "https://nominatim.openstreetmap.org/search" +
            $"?q={Uri.EscapeDataString(query)}" +
            "&format=jsonv2" +
            "&limit=1" +
            "&countrycodes=it";

        using var request =
            new HttpRequestMessage(
                HttpMethod.Get,
                url
            );

        request.Headers.UserAgent.ParseAdd(
            "Adytum/1.0"
        );

        var response =
            await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json =
            await response.Content
                .ReadAsStringAsync();

        var results =
            JsonSerializer.Deserialize<
                List<NominatimResult>
            >(json);

        var result =
            results?.FirstOrDefault();


        if (
            result == null ||
            !double.TryParse(
                result.Latitude,
                System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture,
                out var latitude
            ) ||
            !double.TryParse(
                result.Longitude,
                System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture,
                out var longitude
            )
        )
        {
            return null;
        }

        return (
            latitude,
            longitude
        );
    }

    private class NominatimResult
    {
        [JsonPropertyName("lat")]
        public string Latitude { get; set; } = "";
        [JsonPropertyName("lon")]
        public string Longitude { get; set; } = "";
    }
}