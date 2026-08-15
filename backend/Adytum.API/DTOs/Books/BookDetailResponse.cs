namespace Adytum.API.DTOs.Books;

using Adytum.API.Models;

public class BookDetailsResponse
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string ISBN { get; set; } = string.Empty;

    public string Publisher { get; set; } = string.Empty;

    public int? PublicationYear { get; set; }

    public string Genre { get; set; } = string.Empty;

    public string Language { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string CoverImageUrl { get; set; } = string.Empty;

    public BookCopyCondition Condition { get; set; }

    public bool AvailableForLoan { get; set; }

    public string OwnerDisplayName { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public double DistanceKm { get; set; }

    public bool IsOwnedByCurrentUser { get; set; }

    public string PersonalNotes { get; set; } = string.Empty;
}