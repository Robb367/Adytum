namespace Adytum.API.DTOs.Books;

public class BooksNearby
{
    public int BookCopyId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Author { get; set; } = string.Empty;

    public string? CoverImageUrl { get; set; }

    public string? ThumbnailUrl { get; set; }

    public string OwnerDisplayName { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string Province { get; set; } = string.Empty;

    public double DistanceKm { get; set; }

    public bool AvailableForLoan { get; set; }
}