using Adytum.API.DTOs.BookLookup;
using Adytum.API.Services.Interfaces;
using System.Text.Json;
using Adytum.API.DTOs.OpenLibrary;
using System.Linq;

namespace Adytum.API.Services;

public class OpenLibraryBookLookupService : IBookLookupService
{
    private readonly HttpClient _httpClient;

    public OpenLibraryBookLookupService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<BookLookupResponse?> GetBookByIsbnAsync(string isbn)
    {
        var url = $"https://openlibrary.org/isbn/{isbn}.json";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }
        var json = await response.Content.ReadAsStringAsync();
        Console.WriteLine(json);
        var openLibraryBook = JsonSerializer.Deserialize<OpenLibraryResponse>(json);
        if (openLibraryBook == null)
        {
            return null;
        }
        var book = new BookLookupResponse
        {
            ISBN = openLibraryBook.Isbn13.FirstOrDefault() ?? string.Empty,
            Title = openLibraryBook.Title,
            Publisher = openLibraryBook.Publishers.FirstOrDefault() ?? string.Empty,
            CoverImageUrl = openLibraryBook.Covers.Any()
        ? $"https://covers.openlibrary.org/b/id/{openLibraryBook.Covers.First()}-L.jpg"
        : string.Empty
        };
        return book;
    }
}