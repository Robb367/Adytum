namespace Adytum.API.DTOs.Books;

using Adytum.API.Models;
using Microsoft.AspNetCore.Http;

public class AddBookToLibrary
{
    public string ISBN { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string Publisher { get; set; } = string.Empty;

    public int PublicationYear { get; set; }

    public string Language { get; set; } = string.Empty;

    public string Translator { get; set; } = string.Empty;

    public string Genre { get; set; } = string.Empty;

    public int Pages { get; set; }

    public string Description { get; set; } = string.Empty;

    // Copertina proveniente da Open Library
    public string? CoverImageUrl { get; set; }

    // Copertina caricata manualmente
    public IFormFile? CoverImage { get; set; }

    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; } = true;

    public string PersonalNotes { get; set; } = string.Empty;
}