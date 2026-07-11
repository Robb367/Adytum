namespace Adytum.API.DTOs.Books;
using Adytum.API.Models;

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

    public string CoverImageUrl { get; set; } = string.Empty;

    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; } = true;

    public string PersonalNotes { get; set; } = string.Empty;
}