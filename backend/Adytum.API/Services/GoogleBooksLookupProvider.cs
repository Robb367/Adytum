using Adytum.API.DTOs.BookLookup;
using Adytum.API.Services.Interfaces;
using System.Text.Json;

namespace Adytum.API.Services;

public class GoogleBooksLookupProvider : IBookLookupProvider
{
    private readonly HttpClient _httpClient;

    public GoogleBooksLookupProvider(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<BookLookupResponse?> LookupAsync(string isbn)
    {
        var url =
            $"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}";

        var response = await _httpClient.GetAsync(url);

        if (!response.IsSuccessStatusCode)
        {
            return null;
        }

        var json = await response.Content.ReadAsStringAsync();

        using var document = JsonDocument.Parse(json);

        var root = document.RootElement;

        if (!root.TryGetProperty("items", out var items) ||
            items.GetArrayLength() == 0)
        {
            return null;
        }

        var volumeInfo = items[0].GetProperty("volumeInfo");

        string title = string.Empty;

        if (volumeInfo.TryGetProperty("title", out var titleProperty))
        {
            title = titleProperty.GetString() ?? string.Empty;
        }

        string author = string.Empty;

        if (volumeInfo.TryGetProperty("authors", out var authors) &&
            authors.GetArrayLength() > 0)
        {
            author = authors[0].GetString() ?? string.Empty;
        }

        string publisher = string.Empty;

        if (volumeInfo.TryGetProperty("publisher", out var publisherProperty))
        {
            publisher = publisherProperty.GetString() ?? string.Empty;
        }

        int publicationYear = 0;

        if (volumeInfo.TryGetProperty(
                "publishedDate",
                out var publishedDate))
        {
            var date = publishedDate.GetString();

            if (!string.IsNullOrEmpty(date) &&
                int.TryParse(
                    date.Length >= 4
                        ? date[..4]
                        : date,
                    out var year))
            {
                publicationYear = year;
            }
        }

        int pages = 0;

        if (volumeInfo.TryGetProperty(
                "pageCount",
                out var pageCount))
        {
            pages = pageCount.GetInt32();
        }

        string description = string.Empty;

        if (volumeInfo.TryGetProperty(
                "description",
                out var descriptionProperty))
        {
            description =
                descriptionProperty.GetString()
                ?? string.Empty;
        }

        string language = string.Empty;

        if (volumeInfo.TryGetProperty(
                "language",
                out var languageProperty))
        {
            language =
                languageProperty.GetString()
                ?? string.Empty;
        }

        string? coverUrl = null;

        if (volumeInfo.TryGetProperty(
                "imageLinks",
                out var imageLinks) &&
            imageLinks.TryGetProperty(
                "thumbnail",
                out var thumbnail))
        {
            coverUrl = thumbnail.GetString();
        }

        return new BookLookupResponse
        {
            ISBN = isbn,
            Title = title,
            Author = author,
            Publisher = publisher,
            PublicationYear = publicationYear,
            Language = language,
            Pages = pages,
            Description = description,
            CoverImageUrl = coverUrl
        };
    }
}