namespace Adytum.API.DTOs.Books;

using System.ComponentModel.DataAnnotations;
using Adytum.API.Models;
using Microsoft.AspNetCore.Http;

public class AddBookToLibrary
{
    public string? ISBN { get; set; }

[Required]
    public string Title { get; set; } = string.Empty;

[Required]
    public string Author { get; set; } = string.Empty;

    public string? Publisher { get; set; }
    public int? PublicationYear { get; set; }

    public string? Language { get; set; }

    public string? Translator { get; set; }

    public string? Genre { get; set; }

    public int? Pages { get; set; }

    public string? Description { get; set; }

    // Copertina proveniente da Open Library
    public string? CoverImageUrl { get; set; }

    // Copertina caricata manualmente
    public IFormFile? CoverImage { get; set; }

    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; } = true;

    public string? PersonalNotes { get; set; }
}