using Adytum.API.DTOs.BookLookup;
using Adytum.API.DTOs.OpenLibrary;
using Adytum.API.Services.Interfaces;
using System.Text.Json;

namespace Adytum.API.Services;

public class OpenLibraryBookLookupProvider : IBookLookupProvider
{
    private readonly HttpClient _httpClient;

    public OpenLibraryBookLookupProvider(
        HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<BookLookupResponse?> LookupAsync(
        string isbn)
    {
        var url =
            $"https://openlibrary.org/search.json?isbn={Uri.EscapeDataString(isbn)}";

        var response =
            await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json =
            await response.Content.ReadAsStringAsync();

        var searchResponse =
            JsonSerializer.Deserialize<OpenLibrarySearchResponse>(
                json
            );

        var document =
            searchResponse?.Docs.FirstOrDefault();

        if (document == null)
        {
            return null;
        }

        string? coverUrl = null;

        if (document.CoverId.HasValue)
        {
            coverUrl =
                $"https://covers.openlibrary.org/b/id/{document.CoverId.Value}-L.jpg";
        }

        return new BookLookupResponse
        {
            ISBN =
                document.Isbns
                    .FirstOrDefault(i => i == isbn)
                ?? isbn,

            Title =
                document.Title,

            Author =
                document.AuthorNames.FirstOrDefault()
                ?? string.Empty,

            Publisher =
                document.Publishers.FirstOrDefault()
                ?? string.Empty,

            PublicationYear =
                document.FirstPublishYear,

            Language =
                GetLanguageLabel(
                    document.Languages.FirstOrDefault()
                ),

            Pages =
                document.NumberOfPagesMedian,

            Description =
                string.Empty,

            CoverImageUrl =
                coverUrl
        };
    }

    private static string? GetLanguageLabel(
        string? languageCode)
    {
        return languageCode switch
        {
            "ita" => "Italiano",
            "eng" => "Inglese",
            "fre" => "Francese",
            "fra" => "Francese",
            "ger" => "Tedesco",
            "deu" => "Tedesco",
            "spa" => "Spagnolo",
            _ => languageCode
        };
    }
}