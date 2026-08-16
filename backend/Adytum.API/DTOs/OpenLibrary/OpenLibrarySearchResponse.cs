using System.Text.Json.Serialization;

namespace Adytum.API.DTOs.OpenLibrary;

public class OpenLibrarySearchResponse
{
    [JsonPropertyName("docs")]
    public List<OpenLibrarySearchDocument> Docs { get; set; } = new();
}

public class OpenLibrarySearchDocument
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("author_name")]
    public List<string> AuthorNames { get; set; } = new();

    [JsonPropertyName("publisher")]
    public List<string> Publishers { get; set; } = new();

    [JsonPropertyName("first_publish_year")]
    public int? FirstPublishYear { get; set; }

    [JsonPropertyName("language")]
    public List<string> Languages { get; set; } = new();

    [JsonPropertyName("number_of_pages_median")]
    public int? NumberOfPagesMedian { get; set; }

    [JsonPropertyName("cover_i")]
    public int? CoverId { get; set; }

    [JsonPropertyName("isbn")]
    public List<string> Isbns { get; set; } = new();
}