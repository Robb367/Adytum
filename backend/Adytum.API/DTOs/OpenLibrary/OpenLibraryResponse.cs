using System.Text.Json.Serialization;

namespace Adytum.API.DTOs.OpenLibrary;

public class OpenLibraryResponse
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("publishers")]
    public List<string> Publishers { get; set; } = new();

    [JsonPropertyName("isbn_13")]
    public List<string> Isbn13 { get; set; } = new();

    [JsonPropertyName("covers")]
    public List<int> Covers { get; set; } = new();
}