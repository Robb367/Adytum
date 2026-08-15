using Adytum.API.DTOs.BookLookup;
using Adytum.API.DTOs.OpenLibrary;
using Adytum.API.Services.Interfaces;
using System.Text.Json;

namespace Adytum.API.Services;

public class OpenLibraryBookLookupProvider : IBookLookupProvider
{
    private readonly HttpClient _httpClient;

    public OpenLibraryBookLookupProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<BookLookupResponse?> LookupAsync(string isbn)
    {
        var url = $"https://openlibrary.org/isbn/{isbn}.json";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        var openLibraryBook =
            JsonSerializer.Deserialize<OpenLibraryResponse>(json);

        if (openLibraryBook == null)
        {
            return null;
        }

        string? coverUrl = null;

        if (openLibraryBook.Covers != null &&
            openLibraryBook.Covers.Any())
        {
            var coverId = openLibraryBook.Covers.First();

            coverUrl =
                $"https://covers.openlibrary.org/b/id/{coverId}-L.jpg";
        }

        return new BookLookupResponse
        {
            ISBN = openLibraryBook.Isbn13.FirstOrDefault()
                   ?? isbn,

            Title = openLibraryBook.Title,

            Publisher =
                openLibraryBook.Publishers.FirstOrDefault()
                ?? string.Empty,

            CoverImageUrl = coverUrl
        };
    }
}